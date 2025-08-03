/** Cached currency exchange rate */
export interface ExchangeRate {
  /** Unique identifier, e.g., base+target+date */
  id: string;
  /** Base currency ISO code */
  baseCurrency: string;
  /** Target currency ISO code */
  targetCurrency: string;
  /** Conversion rate */
  rate: number;
  /** When the rate was fetched */
  fetchedAt: Date;
  /** Source of the rate */
  source: string;
  /** Suggested expiration */
  expiresAt?: Date;
}
