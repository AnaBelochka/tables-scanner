'use client';
import { useEffect } from 'react';
import { ScannerApiResponse, TickEventPayload } from './basic-types';
import { convertToNumber, getAltMarketCap } from './utils';
import { getScannerData } from './api';
import { convertToRowData, getBaseFilterForTable } from './helpers';
import { useScannerStore, TableType } from './store';
import { ws } from './ws';

export function useScanner(type: TableType) {
  const { filters, upsertMany, replaceForType, setLoading, setError } = useScannerStore();

  useEffect(() => {
    let mounted = true;
    const paramsToRequest = getBaseFilterForTable(type, filters);

    (async () => {
      setLoading(type, true);
      setError(type, null);

      try {
        const resp: ScannerApiResponse = await getScannerData(paramsToRequest);
        const rows = resp.pairs.map(convertToRowData);

        if (!mounted) {
          return;
        }

        upsertMany(rows, type);

        ws.connect();
        ws.send({ event: 'scanner-filter', data: paramsToRequest });

        rows.forEach(({ pairAddress, tokenAddress, chain }) => {
          ws.send({
            event: 'subscribe-pair',
            data: { pair: pairAddress, token: tokenAddress, chain },
          });
          ws.send({
            event: 'subscribe-pair-stats',
            data: { pair: pairAddress, token: tokenAddress, chain },
          });
        });
      } catch (e: any) {
        setError(type, e?.message ?? 'Failed to load');
      } finally {
        setLoading(type, false);
      }
    })();

    const off = ws.on((message) => {
      if (message.event === 'scanner-pairs') {
        const rows = message.data.results.pairs.map(convertToRowData);

        replaceForType(rows, type);
      }

      if (message.event === 'tick') {
        const data = message.data as TickEventPayload;
        const pair = data.pair.pair;
        const swaps = (data.swaps || []).filter((s) => !s.isOutlier);
        const latest = swaps[swaps.length - 1];

        if (pair && latest) {
          const newPrice = convertToNumber(latest.priceToken1Usd);

          useScannerStore.setState((state) => {
            const curr = state.byPair[pair];

            if (!curr) {
              return {};
            }

            const newMcap =
              getAltMarketCap(curr.token1TotalSupplyFormatted, newPrice) || curr.mcapUsd;

            return {
              byPair: {
                ...state.byPair,
                [pair]: { ...curr, priceUsd: newPrice || curr.priceUsd, mcapUsd: newMcap },
              },
            };
          });
        }
      }

      if (message.event === 'pair-stats') {
        const messageData = message.data;

        const pairAddress = messageData.pair.pairAddress;

        useScannerStore.setState((state) => {
          const curr = state.byPair[pairAddress];

          if (!curr) {
            return {};
          }

          const burned = convertToNumber(messageData.pair.burnedSupply) > 0;

          return {
            byPair: {
              ...state.byPair,
              [pairAddress]: {
                ...curr,
                audit: {
                  ...curr.audit,
                  burned,
                  mintable: !messageData.pair.mintAuthorityRenounced,
                  freezable: !messageData.pair.freezeAuthorityRenounced,
                  contractVerified: messageData.pair.isVerified ?? curr.audit.contractVerified,
                  honeypot: !!messageData.pair.token1IsHoneypot,
                },
                liquidity: {
                  ...curr.liquidity,
                  lockedAmount:
                    convertToNumber(messageData.pair.lockedAmount) || curr.liquidity.lockedAmount,
                },
              },
            },
          };
        });
      }
    });

    return () => {
      mounted = false;
      off();
    };
  }, [type, filters, upsertMany, replaceForType, setLoading, setError]);
}
