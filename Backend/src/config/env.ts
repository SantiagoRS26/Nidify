import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nidify',
  jwtSecret: process.env.JWT_SECRET ?? 'changeme',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'changeme-refresh',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI ??
    'http://localhost:3000/api/v1/auth/google/callback',
  frontendRedirectUri:
    process.env.FRONTEND_REDIRECT_URI ??
    'http://localhost:4200/auth/google/callback',
  exchangeRateApiBase:
    process.env.EXCHANGE_RATE_API_BASE ?? 'https://api.exchangerate.host',
  exchangeRateTtlMinutes: Number(process.env.EXCHANGE_RATE_TTL_MINUTES ?? 60),
};
