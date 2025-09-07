'use client';
import { create } from 'zustand';
import { GetScannerResultParams } from './basic-types';
import { TokenRow } from './types';

export type TableType = 'trending' | 'new';

type ScannerState = {
  byPair: Record<string, TokenRow>;
  order: Record<TableType, string[]>;
  filters: GetScannerResultParams;
  loading: Record<TableType, boolean>;
  error: Record<TableType, string | null>;
  setFilters: (p: Partial<GetScannerResultParams>) => void;
  upsertMany: (rows: TokenRow[], type: TableType) => void;
  replaceForType: (rows: TokenRow[], type: TableType) => void;
  setLoading: (type: TableType, v: boolean) => void;
  setError: (type: TableType, msg: string | null) => void;
};

export const useScannerStore = create<ScannerState>((setState) => ({
  byPair: {},
  order: { trending: [], new: [] },
  filters: {},
  loading: { trending: false, new: false },
  error: { trending: null, new: null },
  setFilters: (params) => setState((state) => ({ filters: { ...state.filters, ...params } })),
  upsertMany: (rows, type) =>
    setState((state) => {
      const by = { ...state.byPair };
      const ord = new Set(state.order[type]);

      rows.forEach((r) => {
        by[r.pairAddress] = { ...by[r.pairAddress], ...r };
        ord.add(r.pairAddress);
      });

      return { byPair: by, order: { ...state.order, [type]: Array.from(ord) } };
    }),
  replaceForType: (rows, type) =>
    setState((state) => {
      const by = { ...state.byPair };
      const next = rows.map((row) => {
        by[row.pairAddress] = { ...by[row.pairAddress], ...row };

        return row.pairAddress;
      });
      const other = type === 'trending' ? state.order.new : state.order.trending;

      Object.keys(by).forEach((pair) => {
        if (!next.includes(pair) && !other.includes(pair)) delete by[pair];
      });

      return { byPair: by, order: { ...state.order, [type]: next } };
    }),
  setLoading: (type, value) =>
    setState((state) => ({ loading: { ...state.loading, [type]: value } })),
  setError: (type, msg) => setState((state) => ({ error: { ...state.error, [type]: msg } })),
}));
