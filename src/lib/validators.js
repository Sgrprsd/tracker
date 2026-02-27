import { z } from "zod";

// ─── Auth ───────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Application ────────────────────────────────────
export const APPLICATION_STATUSES = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
  "accepted",
];

export const APPLICATION_PRIORITIES = ["low", "medium", "high"];

export const APPLICATION_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
];

const contactSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  linkedIn: z.string().url().optional().or(z.literal("")),
});

export const createApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required").max(100),
  position: z.string().min(1, "Position is required").max(100),
  status: z.enum(APPLICATION_STATUSES).default("wishlist"),
  priority: z.enum(APPLICATION_PRIORITIES).default("medium"),
  jobUrl: z.string().url().optional().or(z.literal("")),
  salary: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
      currency: z.string().default("INR"),
    })
    .optional(),
  location: z.string().max(100).optional(),
  type: z.enum(APPLICATION_TYPES).optional(),
  notes: z.string().max(2000).optional(),
  appliedDate: z.string().datetime().optional().or(z.literal("")),
  interviewDate: z.string().datetime().optional().or(z.literal("")),
  followUpDate: z.string().datetime().optional().or(z.literal("")),
  contacts: z.array(contactSchema).max(10).optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
});

// ─── Helpers ────────────────────────────────────────
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}
