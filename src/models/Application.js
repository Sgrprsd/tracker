import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";

const COLLECTION = "applications";

// ─── Create ─────────────────────────────────────────
export async function createApplication(userId, data) {
  const col = await getCollection(COLLECTION);
  const now = new Date();

  const doc = {
    userId: new ObjectId(userId),
    company: data.company,
    position: data.position,
    status: data.status || "wishlist",
    priority: data.priority || "medium",
    jobUrl: data.jobUrl || "",
    salary: data.salary || { min: 0, max: 0, currency: "INR" },
    location: data.location || "",
    type: data.type || "full-time",
    notes: data.notes || "",
    appliedDate: data.appliedDate ? new Date(data.appliedDate) : null,
    interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
    followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
    contacts: data.contacts || [],
    statusHistory: [{ status: data.status || "wishlist", changedAt: now }],
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

// ─── Read ───────────────────────────────────────────
export async function getApplicationsByUser(
  userId,
  { status, priority, search, sort = "createdAt", order = "desc" } = {},
) {
  const col = await getCollection(COLLECTION);

  const filter = { userId: new ObjectId(userId) };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { company: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
    ];
  }

  const sortDir = order === "asc" ? 1 : -1;
  return col
    .find(filter)
    .sort({ [sort]: sortDir })
    .toArray();
}

export async function getApplicationById(userId, id) {
  const col = await getCollection(COLLECTION);
  return col.findOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  });
}

// ─── Update ─────────────────────────────────────────
export async function updateApplication(userId, id, data) {
  const col = await getCollection(COLLECTION);

  const updateFields = { ...data, updatedAt: new Date() };

  // Convert date strings to Date objects (empty strings become null)
  updateFields.appliedDate = updateFields.appliedDate
    ? new Date(updateFields.appliedDate)
    : null;
  updateFields.interviewDate = updateFields.interviewDate
    ? new Date(updateFields.interviewDate)
    : null;
  updateFields.followUpDate = updateFields.followUpDate
    ? new Date(updateFields.followUpDate)
    : null;

  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(id), userId: new ObjectId(userId) },
    { $set: updateFields },
    { returnDocument: "after" },
  );

  return result;
}

export async function updateApplicationStatus(userId, id, status) {
  const col = await getCollection(COLLECTION);
  const now = new Date();

  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(id), userId: new ObjectId(userId) },
    {
      $set: { status, updatedAt: now },
      $push: { statusHistory: { status, changedAt: now } },
    },
    { returnDocument: "after" },
  );

  return result;
}

// ─── Delete ─────────────────────────────────────────
export async function deleteApplication(userId, id) {
  const col = await getCollection(COLLECTION);
  const result = await col.deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  });
  return result.deletedCount > 0;
}

// ─── Dashboard Stats ────────────────────────────────
export async function getApplicationStats(userId) {
  const col = await getCollection(COLLECTION);
  const uid = new ObjectId(userId);

  const [statusCounts, totalCount, recentApplications] = await Promise.all([
    col
      .aggregate([
        { $match: { userId: uid } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray(),
    col.countDocuments({ userId: uid }),
    col.find({ userId: uid }).sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

  return { statusCounts, totalCount, recentApplications };
}

// ─── Follow-ups ─────────────────────────────────────
export async function getUpcomingFollowUps(userId) {
  const col = await getCollection(COLLECTION);
  return col
    .find({
      userId: new ObjectId(userId),
      followUpDate: { $ne: null, $exists: true, $type: "date" },
      status: { $nin: ["rejected", "accepted"] },
    })
    .sort({ followUpDate: 1 })
    .toArray();
}

// ─── Indexes ────────────────────────────────────────
export async function ensureApplicationIndexes() {
  const col = await getCollection(COLLECTION);
  await Promise.all([
    col.createIndex({ userId: 1, status: 1 }),
    col.createIndex({ userId: 1, followUpDate: 1 }),
    col.createIndex({ userId: 1, createdAt: -1 }),
  ]);
}
