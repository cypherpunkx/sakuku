import { z } from "zod";
import {
  transactionSchema,
  categorySchema,
  billSchema,
  userProfileSchema,
  financeSettingsSchema,
} from "@/lib/validations";

// --- Database Entities ---
export type Transaction = {
  id: number;
  amount: number;
  description: string | null;
  date: Date;
  category: string;
  categoryName?: string | null; // Added for UI display from joins
  type: "income" | "expense";
  store: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Category = {
  id: number;
  name: string;
  type: "income" | "expense";
  priority: "Kebutuhan" | "Keinginan" | null;
  color: string | null;
  bg?: string; // Optional since it might not be in DB yet
  icon: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

// --- Form & Validation Types ---
export type TransactionFormValues = z.infer<typeof transactionSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type BillFormValues = z.infer<typeof billSchema>;
export type UserProfileValues = z.infer<typeof userProfileSchema>;
export type FinanceSettingsValues = z.infer<typeof financeSettingsSchema>;

// --- Component Props ---
export interface CategoryManagerProps {
  categories: Category[];
}

export interface TransactionModalProps {
  categories?: Category[];
  transaction?: Transaction | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  currency?: string;
}
