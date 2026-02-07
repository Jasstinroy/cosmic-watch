import cron from 'node-cron';
import { fetchAsteroidData } from './nasaFetcher.js';

export const initScheduler = () => {
  // Schedule task to run every 4 hours
  cron.schedule('0 */4 * * *', () => {
    console.log('⏰ Running scheduled asteroid data update...');
    fetchAsteroidData();
  });
  
  // Run immediately on server startup so we have data right away
  fetchAsteroidData();
};