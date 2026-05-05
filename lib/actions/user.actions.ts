"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { 
  userProfileSchema, 
  financeSettingsSchema, 
  securitySettingsSchema, 
  notificationSettingsSchema 
} from "../validations";

const CURRENT_USER_ID = "user_1";

export async function updateUserProfile(data: any) {
  const validatedData = userProfileSchema.parse(data);
  try {
    await db
      .update(schema.users)
      .set({
        ...data,
      })
      .where(eq(schema.users.id, CURRENT_USER_ID));

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
      .set({
        ...data,
      })
      .where(eq(schema.users.id, CURRENT_USER_ID));

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
      .set({
        ...data,
      })
      .where(eq(schema.users.id, CURRENT_USER_ID));

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
      .set({
        ...data,
      })
      .where(eq(schema.users.id, CURRENT_USER_ID));

    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update notification settings:", error);
    return { success: false, error: "Gagal memperbarui preferensi notifikasi." };
  }
}


