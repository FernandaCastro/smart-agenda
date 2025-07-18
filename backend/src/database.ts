import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("MONGODB_URI not found in environment variables");
}

const client = new MongoClient(uri);
export const db = client.db(); 

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw error;
  }
}
