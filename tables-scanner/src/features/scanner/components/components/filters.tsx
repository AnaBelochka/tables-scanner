'use client';

import { useScannerStore } from '../../store';
import { SupportedChainName } from '../../basic-types';

export const Filters = () => {
  const { filters, setFilters } = useScannerStore();

  return (
    <div className="grid grid-cols-2 gap-2 p-2 md:grid-cols-6">
      <select
        className="rounded border p-2"
        value={filters.chain ?? ''}
        onChange={(e) =>
          setFilters({ chain: (e.target.value || null) as SupportedChainName | null })
        }
      >
        <option value="">All chains</option>
        <option value="ETH">ETH</option>
        <option value="SOL">SOL</option>
        <option value="BASE">BASE</option>
        <option value="BSC">BSC</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!filters.isNotHP}
          onChange={(e) => setFilters({ isNotHP: e.target.checked })}
        />
        Exclude honeypots
      </label>

      <input
        className="rounded border p-2"
        placeholder="Min Vol 24h ($)"
        type="number"
        onChange={(e) => setFilters({ minVol24H: e.target.value ? Number(e.target.value) : null })}
      />

      <input
        className="rounded border p-2"
        placeholder="Max Age (hours)"
        type="number"
        onChange={(e) =>
          setFilters({ maxAge: e.target.value ? Number(e.target.value) * 3600 : null })
        }
      />

      <input
        className="rounded border p-2"
        placeholder="Min Liquidity ($)"
        type="number"
        onChange={(e) => setFilters({ minLiq: e.target.value ? Number(e.target.value) : null })}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!filters.isVerified}
          onChange={(e) => setFilters({ isVerified: e.target.checked })}
        />
        Verified only
      </label>
    </div>
  );
};
