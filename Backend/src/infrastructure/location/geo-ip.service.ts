import { ExchangeRateProvider } from '../currency/exchange-rate.provider';

export class GeoIpService {
  private readonly exchange = new ExchangeRateProvider();

  async getCurrency(ip?: string): Promise<string | null> {
    try {
      const url = ip
        ? `https://ipapi.co/${ip}/json/`
        : 'https://ipapi.co/json/';
      const res = await fetch(url);
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as { currency?: string };
      const currency = data.currency;
      if (!currency) {
        return null;
      }
      const supported = await this.exchange.fetchSupportedCurrencies('USD');
      return supported.includes(currency) ? currency : null;
    } catch {
      return null;
    }
  }
}
