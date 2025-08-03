import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nidify',
  jwtSecret: process.env.JWT_SECRET ?? 'changeme',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
};
