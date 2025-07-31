import express from 'express';
import cors from 'cors';
import appRoutes from './routes/app.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'http://localhost:8081';
const allowedOrigins = ALLOWED_ORIGINS.split(',').map(origin => origin.trim());

app.use(cors(
    {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Permite envio de cookies
    }));



app.use('/', appRoutes);
app.use('/auth', authRoutes);


export default app;
