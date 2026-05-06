import { z } from "zod";

// Transaction Schema
export const transactionSchema = z.object({
  amount: z.number().positive("Jumlah harus lebih dari 0"),
  categoryName: z.string().min(1, "Kategori harus dipilih"),
  type: z.enum(["income", "expense"]),
  description: z.string().optional(),
  store: z.string().optional(),
  date: z.string().optional(),
});

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori tidak boleh kosong"),
  type: z.enum(["income", "expense"]),
  color: z.string().optional(),
  icon: z.string().optional(),
  priority: z.enum(["Kebutuhan", "Keinginan"]).optional(),
});

// Budget Schema
export const budgetSchema = z.object({
  categoryId: z.number(),
  amount: z.number().nonnegative("Anggaran tidak boleh negatif"),
});

// Saving Goal Schema
export const savingGoalSchema = z.object({
  name: z.string().min(1, "Nama target tidak boleh kosong"),
  targetAmount: z.number().positive("Target harus lebih dari 0"),
  iconName: z.string().optional(),
  color: z.string().optional(),
  dueDate: z.string().optional(),
});

// Saving Contribution Schema
export const savingContributionSchema = z.object({
  goalId: z.number(),
  amount: z.number().positive("Jumlah tabungan harus lebih dari 0"),
});

export const billSchema = z.object({
  name: z.string().min(1, "Nama tagihan tidak boleh kosong"),
  provider: z.string().optional(),
  amount: z.number().positive("Jumlah tagihan harus lebih dari 0"),
  dueDate: z.string(),
  category: z.string().optional(),
  urgent: z.boolean().optional(),
  iconName: z.string().optional(),
});

// User Profile Schema
export const userProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional().or(z.literal("")),
});

// Finance Settings Schema
export const financeSettingsSchema = z.object({
  currency: z.string().optional(),
  budgetStartDay: z.number().min(1).max(31).optional(),
});

// Security Settings Schema
export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().optional(),
});

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
});
// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
