import cron from 'node-cron';
import { fetchAsteroidData } from './nasaFetcher.js';
import Asteroid from '../models/Asteroid.js';
import User from '../models/User.js'; // Import User model
import { sendRiskAlert } from './emailService.js'; // Import Email Service

export const initScheduler = () => {
  // Task 1: Data Refresh (Every 4 hours)
  cron.schedule('0 */4 * * *', async () => {
    console.log('🔄 Cron: Refreshing Asteroid Data from NASA...');
    await fetchAsteroidData();
  });

  // Task 2: Daily Risk Alert (Runs every day at 09:00 AM)
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Cron: Running Daily Risk Analysis...');
    
    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. Find Critical Asteroids for TODAY
      const hazardousAsteroids = await Asteroid.find({ 
        riskScore: { $gt: 1 }, // Fetch anything with risk > 1 to filter later
        approachDate: today 
      });

      if (hazardousAsteroids.length === 0) {
        console.log('✅ No threats today. No emails sent.');
        return;
      }

      console.log(`⚠️ Found ${hazardousAsteroids.length} potential threats today.`);

      // 2. Fetch Users with "Daily" or "Always" preferences
      const users = await User.find({ 'alertPreferences.emailFrequency': { $ne: 'never' } });

      // 3. Match Asteroids to Users based on Risk Score
      for (const user of users) {
        const userThreshold = user.alertPreferences.minRiskScore || 50;
        
        // Find the highest risk asteroid that exceeds user's threshold
        const relevantThreat = hazardousAsteroids.find(ast => ast.riskScore >= userThreshold);

        if (relevantThreat) {
          console.log(`⚡ Triggering alert for ${user.username} (Threshold: ${userThreshold})`);
          await sendRiskAlert(user.email, user.username, relevantThreat);
        }
      }

    } catch (err) {
      console.error('❌ Alert Check Failed:', err.message);
    }
  });
};