// connect.js
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env first

console.log("MONGODB_URI:", process.env.MONGODB_URI); // ✅ Check if it's loaded

import { MongoClient } from "mongodb";

let cachedClient = null;

module.exports =  async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}
