// ─── Date Formatting ────────────────────────────────
export function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeDate(date) {
  if (!date) return "";
  const now = new Date();
  const target = new Date(date);
  const diffMs = target - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `In ${diffDays} days`;
  return formatDate(date);
}

// ─── Salary Formatting ─────────────────────────────
export function formatSalary(salary) {
  if (!salary || (!salary.min && !salary.max)) return "—";
  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: salary.currency || "INR",
      maximumFractionDigits: 0,
    }).format(n);

  if (salary.min && salary.max)
    return `${fmt(salary.min)} – ${fmt(salary.max)}`;
  if (salary.min) return `${fmt(salary.min)}+`;
  return `Up to ${fmt(salary.max)}`;
}

// ─── Text Helpers ───────────────────────────────────
export function truncate(str, maxLen = 60) {
  if (!str || str.length <= maxLen) return str || "";
  return str.slice(0, maxLen) + "…";
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
