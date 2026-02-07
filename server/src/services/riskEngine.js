export const calculateRiskScore = (asteroid) => {
  let score = 0;

  if (asteroid.is_potentially_hazardous_asteroid) {
    score += 50;
  }

 
  const distance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers);
  if (distance < 2000000) score += 30;
  else if (distance < 7500000) score += 10;

  const diameter = asteroid.estimated_diameter.meters.estimated_diameter_max;
  if (diameter > 1000) score += 20; 
  else if (diameter > 100) score += 10;


  return Math.min(score, 100);
};