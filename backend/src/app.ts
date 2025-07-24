import express from 'express';
import cors from 'cors';
import appRoutes from './routes/app.route.js';
import authRoutes from './routes/auth.route.js';

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', appRoutes);
app.use('/auth', authRoutes);


export default app;
