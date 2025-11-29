import mongoose from 'mongoose';
import { logger } from '../utils/logger.util';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adcampaign';

export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info(`Attempting to connect to MongoDB...`);
    logger.info(`Using MongoDB URI from env: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    await mongoose.connect(MONGODB_URI);
    logger.info(`MongoDB connected successfully`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    logger.info('Retrying connection in 5 seconds...');
    // Retry connection after 5 seconds
    setTimeout(connectDatabase, 5000);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongoose connection closed due to app termination');
  process.exit(0);
});

