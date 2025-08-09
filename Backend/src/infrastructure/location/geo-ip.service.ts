export class GeoIpService {
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
      return data.currency ?? null;
    } catch {
      return null;
    }
  }
}
