import mongoose from 'mongoose';
import { config } from '../../config/env';

export const connectMongo = async (): Promise<void> => {
  await mongoose.connect(config.mongoUri);
};
