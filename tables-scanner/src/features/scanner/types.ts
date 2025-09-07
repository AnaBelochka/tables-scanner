export type TokenLinks = {
  webLink?: string | null;
  discordLink?: string | null;
  twitterLink?: string | null;
  telegramLink?: string | null;
};

export type TokenRow = {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenImageUri?: string | null;
  tokenLinks: TokenLinks;
  transactions: { buys: number; sells: number; txns: number };
  fees: { buyFee: number; sellFee: number };
  priceUsd: number;
  mcapUsd: number;
  mcapInitialUsd?: number;
  mcapChangePc?: number;
  liquidity: {
    current: number;
    lockedAmount?: number;
    changePc?: number;
  };
  chain: string;
  tokenAddress: string;
  pairAddress: string;
  volumeUsd24h: number;
  priceChangePcs: { '5m': number; '1h': number; '6h': number; '24h': number };
  audit: { mintable: boolean; freezable: boolean; honeypot: boolean; contractVerified: boolean };
  tokenCreatedAt: Date;
  token1TotalSupplyFormatted?: string;
};
