import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import asteroidRoutes from './routes/asteroids.js';
import { initScheduler } from './services/alertScheduler.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import watchlistRoutes from './routes/watchlist.js';
import alertRoutes from './routes/alert.js';
dotenv.config();



const app = express();


const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow non-browser requests (e.g., server-to-server, curl)
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS policy: Origin not allowed'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Cosmic Watch Backend Running', 
        status: 'OK' 
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/asteroids', asteroidRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alerts', alertRoutes);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    connectDB();
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    

    initScheduler();
});