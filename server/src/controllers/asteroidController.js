import Asteroid from '../models/Asteroid.js';

export const getAsteroids = async (req, res) => {
  try {
    
    const asteroids = await Asteroid.find().sort({ riskScore: -1 });
    res.json(asteroids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAsteroidById = async (req, res) => {
  try {
    const asteroid = await Asteroid.findOne({ nasaId: req.params.id });
    if (!asteroid) {
      return res.status(404).json({ message: 'Asteroid not found' });
    }
    res.json(asteroid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};