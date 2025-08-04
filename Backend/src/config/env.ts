import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nidify',
  jwtSecret: process.env.JWT_SECRET ?? 'changeme',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  exchangeRateApiBase:
    process.env.EXCHANGE_RATE_API_BASE ?? 'https://api.exchangerate.host',
  exchangeRateTtlMinutes: Number(process.env.EXCHANGE_RATE_TTL_MINUTES ?? 60),
};
