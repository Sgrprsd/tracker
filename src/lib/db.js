import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local",
  );
}

let cached = global._mongoClientPromise;

if (!cached) {
  cached = global._mongoClientPromise = { client: null, promise: null };
}

async function getClient() {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI).then((client) => {
      console.log("✅ Connected to MongoDB successfully");
      return client;
    });
  }

  cached.client = await cached.promise;
  return cached.client;
}

export async function getDb() {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || "job_tracker");
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
