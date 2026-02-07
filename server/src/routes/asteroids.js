import express from 'express';
import { 
  getAsteroids, 
  getAsteroidById 
} from '../controllers/asteroidController.js';

const router = express.Router();

router.get('/', getAsteroids);
router.get('/:id', getAsteroidById);

export default router;