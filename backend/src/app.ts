import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);

export default app;
