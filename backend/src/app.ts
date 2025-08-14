const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const dotenv = require('dotenv');

import appRoutes from './routes/app.route';
import authRoutes from './routes/auth.route';
import { timezoneMiddleware } from './middlewares/timezone.middleware';

//Configure Environment Variables
dotenv.config();

//Configure Day.js for UTC and Timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();

// Middleware configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'http://localhost:8081';
const allowedOrigins = ALLOWED_ORIGINS.split(',').map(origin => origin.trim());

app.use(cors(
    {
        origin: function (origin: any, callback: any) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Permite envio de cookies
    }));

app.use(express.json({ type: 'application/json', limit: '1mb' }));
app.use(cookieParser());
app.use(timezoneMiddleware);

// Set up routes
app.use('/', appRoutes);
app.use('/auth', authRoutes);


export default app;
