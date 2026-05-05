"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  userProfileSchema,
  financeSettingsSchema,
  securitySettingsSchema,
  notificationSettingsSchema,
} from "../validations";

import { getUserId } from "../session";

export async function updateUserProfile(data: any) {
  const validatedData = userProfileSchema.parse(data);
  try {
    await db
      .update(schema.users)
      .set(validatedData)
      .where(eq(schema.users.id, await getUserId()));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return { success: false, error: "Gagal memperbarui profil." };
  }
}

export async function updateFinanceSettings(data: any) {
  const validatedData = financeSettingsSchema.parse(data);
  try {
    await db
      .update(schema.users)
      .set(validatedData)
      .where(eq(schema.users.id, await getUserId()));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/statistik");

    return { success: true };
  } catch (error) {
    console.error("Failed to update finance settings:", error);
    return { success: false, error: "Gagal memperbarui pengaturan keuangan." };
  }
}

export async function updateSecuritySettings(data: any) {
  const validatedData = securitySettingsSchema.parse(data);
  try {
    await db
      .update(schema.users)
      .set(validatedData)
      .where(eq(schema.users.id, await getUserId()));

    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update security settings:", error);
    return { success: false, error: "Gagal memperbarui pengaturan keamanan." };
  }
}

export async function updateNotificationSettings(data: any) {
  const validatedData = notificationSettingsSchema.parse(data);
  try {
    await db
      .update(schema.users)
      .set(validatedData)
      .where(eq(schema.users.id, await getUserId()));

    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update notification settings:", error);
    return {
      success: false,
      error: "Gagal memperbarui preferensi notifikasi.",
    };
  }
}

export async function completeOnboarding(data: {
  balance: number;
  currency: string;
  budgetStartDay: number;
}) {
  const userId = await getUserId();
  try {
    // 1. Buat kategori standar jika belum ada
    const defaultCategories = [
      { name: "Saldo Awal", type: "income", color: "#10b981", icon: "Wallet", priority: "Kebutuhan" },
      { name: "Gaji", type: "income", color: "#8b5cf6", icon: "CreditCard", priority: "Kebutuhan" },
      { name: "Bonus", type: "income", color: "#f59e0b", icon: "Sparkles", priority: "Keinginan" },
      { name: "Makanan", type: "expense", color: "#ef4444", icon: "Utensils", priority: "Kebutuhan" },
      { name: "Transportasi", type: "expense", color: "#3b82f6", icon: "Car", priority: "Kebutuhan" },
      { name: "Belanja", type: "expense", color: "#ec4899", icon: "ShoppingBag", priority: "Keinginan" },
      { name: "Hiburan", type: "expense", color: "#f97316", icon: "Gamepad2", priority: "Keinginan" },
      { name: "Tagihan", type: "expense", color: "#64748b", icon: "Receipt", priority: "Kebutuhan" },
    ];

    for (const cat of defaultCategories) {
      const existing = await db.query.categories.findFirst({
        where: and(
          eq(schema.categories.name, cat.name),
          eq(schema.categories.type, cat.type as any)
        ),
      });

      if (!existing) {
        await db.insert(schema.categories).values({
          name: cat.name,
          type: cat.type as any,
          color: cat.color,
          icon: cat.icon,
          priority: cat.priority as any,
        });
      }
    }

    // Ambil ID kategori Saldo Awal untuk transaksi
    const saldoAwalCat = await db.query.categories.findFirst({
      where: and(
        eq(schema.categories.name, "Saldo Awal"),
        eq(schema.categories.type, "income")
      ),
    });

    // 2. Buat transaksi pemasukan untuk saldo awal jika balance > 0
    if (data.balance > 0 && saldoAwalCat) {
      await db.insert(schema.transactions).values({
        userId,
        amount: data.balance,
        categoryId: saldoAwalCat.id,
        type: "income",
        description: "Saldo Awal Onboarding",
        date: new Date().toISOString().split("T")[0],
      });
    }

    // 3. Update status onboarding (kita set balance di user tetap 0 karena sudah masuk ke transaksi)
    // Atau set balance di user sebagai 'initial' baseline
    await db
      .update(schema.users)
      .set({
        balance: 0, // Reset balance di tabel user karena sudah ada di transaksi
        currency: data.currency,
        budgetStartDay: data.budgetStartDay,
        hasOnboarding: true,
      })
      .where(eq(schema.users.id, userId));

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
    return { success: false };
  }
}
