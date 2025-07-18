import app from './app.js';
import { connectToDatabase } from "./database.js";

await connectToDatabase(); // connect db before making API available

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 5001;

app.listen(PORT, () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
