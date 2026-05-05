"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../validations";
import { createSession, deleteSession } from "../session";
import { generateId } from "../id";
import { redirect } from "next/navigation";

export async function signUp(formData: any) {
  const validatedFields = registerSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (existingUser) {
    return {
      error: { email: ["Email sudah terdaftar"] },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = generateId();

  try {
    await db.insert(schema.users).values({
      id: userId,
      name,
      email,
      password: hashedPassword,
      balance: 0,
      currency: "IDR",
      createdAt: new Date().toISOString(),
    });

    await createSession(userId);
  } catch (e) {
    return {
      error: { form: ["Gagal membuat akun. Silakan coba lagi."] },
    };
  }

  redirect("/dashboard");
}

export async function signIn(formData: any) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (!user || !user.password) {
    return {
      error: { form: ["Email atau password salah"] },
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      error: { form: ["Email atau password salah"] },
    };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signOut() {
  await deleteSession();
  redirect("/login");
}
