// ─── Application Status Config ──────────────────────
export const STATUS_CONFIG = {
  wishlist: {
    label: "Wishlist",
    color: "#6b7280",
    bgColor: "#f3f4f6",
    order: 0,
  },
  applied: {
    label: "Applied",
    color: "#3b82f6",
    bgColor: "#eff6ff",
    order: 1,
  },
  interview: {
    label: "Interview",
    color: "#f59e0b",
    bgColor: "#fffbeb",
    order: 2,
  },
  offer: {
    label: "Offer",
    color: "#10b981",
    bgColor: "#ecfdf5",
    order: 3,
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444",
    bgColor: "#fef2f2",
    order: 4,
  },
  accepted: {
    label: "Accepted",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
    order: 5,
  },
};

// ─── Priority Config ────────────────────────────────
export const PRIORITY_CONFIG = {
  low: { label: "Low", color: "#6b7280", icon: "↓" },
  medium: { label: "Medium", color: "#f59e0b", icon: "→" },
  high: { label: "High", color: "#ef4444", icon: "↑" },
};

// ─── Job Type Config ────────────────────────────────
export const TYPE_CONFIG = {
  "full-time": { label: "Full-time" },
  "part-time": { label: "Part-time" },
  contract: { label: "Contract" },
  internship: { label: "Internship" },
};

// ─── Kanban Column Order ────────────────────────────
export const KANBAN_COLUMNS = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
  "accepted",
];
