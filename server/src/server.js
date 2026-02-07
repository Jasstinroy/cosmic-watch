import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import asteroidRoutes from './routes/asteroids.js';
import { initScheduler } from './services/alertScheduler.js';

dotenv.config();

connectDB();

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/asteroids', asteroidRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Cosmic Watch Backend Running', 
        status: 'OK' 
    });
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    

    initScheduler();
});