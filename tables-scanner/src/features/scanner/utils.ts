import { MINUTE } from '@/src/common/constants';

export const convertToNumber = (param?: string | number | null): number => {
  const result = typeof param === 'string' ? parseFloat(param) : (param as number);

  return Number.isFinite(result) ? result : 0;
};

type PickMarketCapParams = {
  currentMcap: string;
  initialMcap: string;
  pairMcapUsd: string;
  pairMcapUsdInitial: string;
};

export const pickMarketCap = (r: PickMarketCapParams): number => {
  const list = [
    convertToNumber(r.currentMcap),
    convertToNumber(r.initialMcap),
    convertToNumber(r.pairMcapUsd),
    convertToNumber(r.pairMcapUsdInitial),
  ];
  const firstPos = list.find((x) => x > 0);

  return firstPos ?? 0;
};

export const getAltMarketCap = (totalSupplyFormatted?: string, price?: string | number): number => {
  const supply = convertToNumber(totalSupplyFormatted);
  const p = convertToNumber(price);

  if (supply > 0 && p > 0) {
    return supply * p;
  }

  return 0;
};

export const getTimeAgo = (date: Date) => {
  const mins = Math.floor((Date.now() - date.getTime()) / MINUTE);

  if (mins < 60) {
    return `${mins}m`;
  }

  const h = Math.floor(mins / 60);

  if (h < 24) {
    return `${h}h`;
  }

  return `${Math.floor(h / 24)}d`;
};
