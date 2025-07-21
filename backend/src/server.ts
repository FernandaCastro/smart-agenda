import app from './app.js';
import { connectToDatabase } from "./config/database.js";

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 5001;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
});

