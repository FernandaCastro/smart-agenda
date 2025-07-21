import mongoose from "mongoose";

export async function connectToDatabase() {

    const uri = process.env.MONGODB_URI as string;

    if (!uri) {
        throw new Error("MONGODB_URI not found in environment variables");
    }

    //await mongoose.connect(uri, { maxPoolSize: 10 });
    await mongoose.connect(uri)
        .then(() => console.log("✅ Connected to MongoDB"))
        .catch(error => console.error("❌ Error connecting to MongoDB:", error))

    //disconnect on process exit 
    process.on('SIGINT', async () => {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB (SIGINT)');
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB (SIGTERM)');
        process.exit(0);
    });



}