import {
  GetScannerResultParams,
  NEW_TOKENS_FILTERS,
  ScannerResult,
  TRENDING_TOKENS_FILTERS,
} from './basic-types';
import { TokenRow } from './types';
import { convertToNumber, pickMarketCap } from './utils';
import { TableType } from './store';
import { BILLION, MILLION, THOUSAND } from '../../common/constants';

export const convertToRowData = ({
  pairAddress,
  token1Name,
  token1Symbol,
  token1Address,
  price,
  volume,
  currentMcap,
  initialMcap,
  pairMcapUsd,
  pairMcapUsdInitial,
  percentChangeInMcap,
  diff5M,
  diff1H,
  diff6H,
  diff24H,
  buys,
  sells,
  txns,
  isMintAuthDisabled,
  isFreezeAuthDisabled,
  honeyPot,
  contractVerified,
  age,
  liquidity,
  liquidityLockedAmount,
  percentChangeInLiquidity,
  token1TotalSupplyFormatted,
  token1ImageUri,
  webLink,
  discordLink,
  twitterLink,
  telegramLink,
  buyFee,
  sellFee,
  chainId,
}: ScannerResult): TokenRow => ({
  pairAddress,
  id: pairAddress,
  tokenName: token1Name,
  tokenSymbol: token1Symbol,
  tokenImageUri: token1ImageUri,
  tokenLinks: {
    webLink,
    discordLink,
    twitterLink,
    telegramLink,
  },
  transactions: {
    buys: convertToNumber(buys),
    sells: convertToNumber(sells),
    txns: convertToNumber(txns),
  },
  fees: { buyFee: convertToNumber(buyFee), sellFee: convertToNumber(sellFee) },
  priceUsd: convertToNumber(price),
  mcapUsd: pickMarketCap({
    currentMcap,
    initialMcap,
    pairMcapUsd,
    pairMcapUsdInitial,
  }),
  mcapInitialUsd: convertToNumber(initialMcap) > 0 ? convertToNumber(initialMcap) : undefined,
  mcapChangePc: convertToNumber(percentChangeInMcap),
  liquidity: {
    current: convertToNumber(liquidity),
    lockedAmount: convertToNumber(liquidityLockedAmount) || undefined,
    changePc: convertToNumber(percentChangeInLiquidity) || undefined,
  },
  audit: {
    mintable: !isMintAuthDisabled,
    freezable: !isFreezeAuthDisabled,
    honeypot: !!honeyPot,
    contractVerified,
  },
  chain: String(chainId),
  priceChangePcs: {
    '5m': convertToNumber(diff5M),
    '1h': convertToNumber(diff1H),
    '6h': convertToNumber(diff6H),
    '24h': convertToNumber(diff24H),
  },
  tokenAddress: token1Address,
  volumeUsd24h: convertToNumber(volume),
  tokenCreatedAt: new Date(age),
  token1TotalSupplyFormatted: token1TotalSupplyFormatted,
});

export const getBaseFilterForTable = (
  type: TableType,
  uiFilters: GetScannerResultParams,
): GetScannerResultParams => {
  const preset = type === 'trending' ? TRENDING_TOKENS_FILTERS : NEW_TOKENS_FILTERS;

  return { ...preset, ...uiFilters, page: 1 };
};

export const getFormattedPrice = (value: number, precision = 2) => {
  if (!Number.isFinite(value)) return '—';

  if (Math.abs(value) >= BILLION) {
    return (value / BILLION).toFixed(precision) + 'B';
  }

  if (Math.abs(value) >= MILLION) {
    return (value / MILLION).toFixed(precision) + 'M';
  }

  if (Math.abs(value) >= THOUSAND) {
    return (value / THOUSAND).toFixed(precision) + 'K';
  }

  return value.toFixed(precision);
};
