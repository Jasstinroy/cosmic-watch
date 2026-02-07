import axios from 'axios';
import Asteroid from '../models/Asteroid.js';
import { calculateRiskScore } from './riskEngine.js';

const NASA_API_URL = 'https://api.nasa.gov/neo/rest/v1/feed';

export const fetchAsteroidData = async () => {
  try {
    console.log('🚀 Fetching fresh data from NASA...');
    
    const today = new Date().toISOString().split('T')[0];
    
    const response = await axios.get(NASA_API_URL, {
      params: {
        start_date: today,
        end_date: today,
        api_key: process.env.NASA_API_KEY
      }
    });

    const asteroidsObj = response.data.near_earth_objects;
    const asteroidsList = Object.values(asteroidsObj).flat();

    const operations = asteroidsList.map(ast => {
      const riskScore = calculateRiskScore(ast);
      
      return {
        updateOne: {
          filter: { nasaId: ast.id },
          update: {
            nasaId: ast.id,
            name: ast.name,
            diameter: ast.estimated_diameter.meters.estimated_diameter_max,
            velocity: parseFloat(ast.close_approach_data[0].relative_velocity.kilometers_per_hour),
            distance: parseFloat(ast.close_approach_data[0].miss_distance.kilometers),
            isHazardous: ast.is_potentially_hazardous_asteroid,
            riskScore: riskScore,
            approachDate: ast.close_approach_data[0].close_approach_date_full,
            lastUpdated: new Date()
          },
          upsert: true 
        }
      };
    });

    if (operations.length > 0) {
      await Asteroid.bulkWrite(operations);
      console.log(` Processed and cached ${operations.length} asteroids.`);
    }
  } catch (error) {
    console.error(' Error fetching NASA data:', error.message);
  }
};