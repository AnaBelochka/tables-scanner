'use client';

import React, { useMemo, useRef } from 'react';
import Image from 'next/image';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useScannerStore } from '../../store';
import { TokenRow } from '../../types';
import { getTimeAgo } from '../../utils';
import { getFormattedPrice } from '../../helpers';
import { Links, ColumnGroup, Chip, TableSkeletonRows, LoadingOverlay } from './components';

const NORMAL_COLUMN_WIDTH = 150;

export type Props = {
  title: string;
  type: 'trending' | 'new';
  defaultSort?: { id: string; desc?: boolean };
};

export const Table = ({ title, type, defaultSort }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { byPair, order, loading, error } = useScannerStore();
  const data: TokenRow[] = useMemo(
    () => order[type].map((pair) => byPair[pair]).filter(Boolean),
    [byPair, order, type],
  );

  const columns = useMemo<ColumnDef<TokenRow>[]>(
    () => [
      {
        id: 'token',
        header: 'Token',
        accessorFn: () => 'token',
        size: 250,
        cell: (ctx) => {
          const row = ctx.row.original;
          const place = ctx.row.index + 1;

          return (
            <div className="flex flex-col gap-2 py-2">
              <div className="flex gap-1">
                {row.tokenImageUri && (
                  <Image
                    src={row.tokenImageUri}
                    alt={row.tokenSymbol}
                    width={20}
                    height={20}
                    style={{ height: 20 }}
                    className="rounded-full"
                  />
                )}

                <div className="flex flex-nowrap">
                  <span className="opacity-80">#{place}</span>
                  <span className="text-nowrap">&nbsp;{row.tokenName}&nbsp;</span>
                  <span className="opacity-70">/&nbsp;{row.tokenSymbol}</span>
                </div>
              </div>

              <Links {...row.tokenLinks} />
            </div>
          );
        },
      },
      {
        id: 'priceUsd',
        header: 'Price ($)',
        accessorKey: 'priceUsd',
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => `$${getFormattedPrice(c.getValue() as number, 5)}`,
      },
      {
        id: 'age',
        header: 'Age',
        accessorFn: (r) => r.tokenCreatedAt.getTime(),
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => <span>{getTimeAgo(c.row.original.tokenCreatedAt)}</span>,
        sortingFn: (a, b, id) => Number(a.getValue(id)) - Number(b.getValue(id)),
      },
      {
        id: 'volumeUsd24h',
        header: 'Vol 24h ($)',
        accessorKey: 'volumeUsd24h',
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => `$${getFormattedPrice(c.getValue() as number)}`,
      },
      {
        id: 'txns',
        header: 'Buys/Sells',
        accessorFn: (r) => r.transactions.txns,
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => {
          const r = c.row.original;
          return (
            <div className="flex flex-col gap-1">
              <span>
                <span>{getFormattedPrice(r.transactions.txns)}</span>
              </span>
              <span>
                <span className="text-green-600">{getFormattedPrice(r.transactions.buys)}</span>
                &nbsp;/&nbsp;
                <span className="text-red-600">{getFormattedPrice(r.transactions.sells)}</span>
              </span>
            </div>
          );
        },
      },
      {
        id: 'fees',
        header: 'Fees/Taxes',
        accessorFn: () => 'fees',
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => {
          const r = c.row.original;
          return (
            <span>
              <span className="text-green-600">{getFormattedPrice(r.fees.buyFee, 0)}%</span>
              &nbsp;/&nbsp;
              <span className="text-red-600">{getFormattedPrice(r.fees.sellFee, 0)}%</span>
            </span>
          );
        },
      },
      {
        id: 'mcap',
        header: 'MarketCap',
        size: NORMAL_COLUMN_WIDTH,
        accessorFn: (r) => r.mcapUsd,
        cell: (c) => {
          const r = c.row.original;
          return (
            <div className="flex flex-col gap-1">
              <span>
                <span className="font-medium">${getFormattedPrice(r.mcapUsd)}</span>
                &nbsp;/&nbsp;
                <span className="opacity-70">
                  {r.mcapInitialUsd ? `$${getFormattedPrice(r.mcapInitialUsd)}` : '—'}
                </span>
              </span>
              <span className={Number(r.mcapChangePc) >= 0 ? 'text-green-500' : 'text-red-500'}>
                {getFormattedPrice(r.mcapChangePc ?? 0)}%
              </span>
            </div>
          );
        },
      },
      {
        id: 'liquidity',
        header: 'Liquidity',
        size: NORMAL_COLUMN_WIDTH,
        accessorFn: (r) => r.liquidity.current,
        cell: (c) => {
          const r = c.row.original;

          return (
            <div className="flex flex-col gap-1">
              <span>
                <span className="font-medium">${getFormattedPrice(r.liquidity.current)}</span>
                &nbsp;/&nbsp;
                <span className="opacity-70">
                  {r.mcapInitialUsd ? `$${getFormattedPrice(r.liquidity.lockedAmount ?? 0)}` : '—'}
                </span>
              </span>
              <span className={Number(r.mcapChangePc) >= 0 ? 'text-green-500' : 'text-red-500'}>
                {getFormattedPrice(r.liquidity.changePc ?? 0)}%
              </span>
            </div>
          );
        },
      },
      {
        id: '5m',
        header: '5m',
        accessorKey: '5m',
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => {
          const r = c.row.original;

          return <Chip value={getFormattedPrice(r.priceChangePcs['5m'] ?? 0)} />;
        },
      },
      {
        id: '1h',
        header: '1h',
        accessorKey: '1h',
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => {
          const r = c.row.original;

          return <Chip value={getFormattedPrice(r.priceChangePcs['1h'] ?? 0)} />;
        },
      },
      {
        id: '6h',
        header: '6h',
        accessorKey: '6h',
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => {
          const r = c.row.original;

          return <Chip value={getFormattedPrice(r.priceChangePcs['6h'] ?? 0)} />;
        },
      },
      {
        id: '24h',
        header: '24h',
        accessorKey: '24h',
        size: NORMAL_COLUMN_WIDTH,
        cell: (c) => {
          const r = c.row.original;

          return <Chip value={getFormattedPrice(r.priceChangePcs['24h'] ?? 0)} />;
        },
      },
      {
        id: 'audit',
        header: 'Audit',
        enableSorting: false,
        minSize: 500,
        maxSize: Number.MAX_SAFE_INTEGER,
        cell: (c) => {
          const a = c.row.original.audit;
          const Dot = (ok: boolean, label: string) => (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${ok ? 'border-emerald-400 text-emerald-400' : 'border-red-400 text-red-400'}`}
            >
              <span className={`h-2 w-2 rounded-full ${ok ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {label}
            </span>
          );
          return (
            <div className="flex justify-end gap-2">
              {Dot(a.mintable, 'Mintable')}
              {Dot(a.freezable, 'Freezeable')}
              {Dot(a.contractVerified, 'Burned')}
              {Dot(a.honeypot, 'Verified')}
            </div>
          );
        },
      },
    ],
    [],
  );

  // TODO
  const [sorting, setSorting] = React.useState<SortingState>(
    defaultSort ? [defaultSort as any] : [],
  );
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 44,
    overscan: 12,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1].end : 0;

  const leafCols = table.getVisibleLeafColumns();
  const colCount = leafCols.length;

  const showInitialSkeleton = loading[type] && data.length === 0;
  const showOverlay = loading[type] && data.length > 0;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border">
      <div className="border-b bg-gray-50 px-3 py-2 font-semibold dark:bg-gray-900">{title}</div>

      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height: 520, scrollbarGutter: 'stable' }}
      >
        <table className="min-w-full table-fixed border-collapse text-sm">
          <ColumnGroup table={table} />

          <thead className="sticky top-0 z-10 bg-white dark:bg-gray-900">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b">
                {hg.headers.map((h, index) => (
                  <th
                    key={h.id}
                    className="cursor-pointer px-3 py-2 text-left select-none"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    <div className={`flex ${index === 0 ? 'justify-start' : 'justify-end'} gap-1`}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === 'asc' && '▲'}
                      {h.column.getIsSorted() === 'desc' && '▼'}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {/* State: error */}
            {error[type] && data.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-6 text-center text-red-500">
                  {error[type]}
                </td>
              </tr>
            )}

            {/* State: initial loading → display skeletons */}
            {showInitialSkeleton && <TableSkeletonRows colCount={colCount} rows={12} />}

            {/* Virtual rows */}
            {!showInitialSkeleton && (
              <>
                {paddingTop > 0 && (
                  <tr>
                    <td colSpan={colCount} style={{ height: paddingTop }} />
                  </tr>
                )}
                {virtualRows.map((vr) => {
                  const row = table.getRowModel().rows[vr.index];
                  const isEven = vr.index % 2 === 0;
                  return (
                    <tr
                      key={row.id}
                      ref={rowVirtualizer.measureElement}
                      style={{ height: vr.size }}
                      className={`border-b hover:bg-gray-100 dark:hover:bg-gray-800/60 ${
                        isEven ? 'bg-gray-50 dark:bg-gray-800/40' : ''
                      }`}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <td
                          key={cell.id}
                          className={`px-3 py-2 ${index === 0 ? 'text-left' : 'text-right'}`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td colSpan={colCount} style={{ height: paddingBottom }} />
                  </tr>
                )}
                {/* Error state */}
                {!loading[type] && !error[type] && data.length === 0 && (
                  <tr>
                    <td colSpan={colCount} className="px-4 py-6 text-center text-gray-500">
                      No data
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>

        {/* Лёгкий оверлей при последующих обновлениях */}
        {showOverlay && <LoadingOverlay />}
      </div>
    </div>
  );
};
