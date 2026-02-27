import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";

const COLLECTION = "users";

export async function createUser({ name, email, password }) {
  const col = await getCollection(COLLECTION);
  const result = await col.insertOne({
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function findUserByEmail(email) {
  const col = await getCollection(COLLECTION);
  return col.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id) {
  const col = await getCollection(COLLECTION);
  return col.findOne({ _id: new ObjectId(id) });
}

// Run once on app startup to ensure indexes
export async function ensureUserIndexes() {
  const col = await getCollection(COLLECTION);
  await col.createIndex({ email: 1 }, { unique: true });
}
