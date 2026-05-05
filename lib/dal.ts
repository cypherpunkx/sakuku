import "server-only";
import { experimental_taintObjectReference } from "react";

import { cache } from "react";
import { db } from "./db";
import * as schema from "./db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "./session";

export const verifySession = cache(async () => {
  const session = await getSession();
  const userId = session?.userId as string | undefined;

  if (!userId) {
    return { isAuth: false, userId: null };
  }

  return { isAuth: true, userId };
});

/**
 * Mengambil data user yang saat ini login.
 * Menggunakan cache() agar tidak terjadi query berulang dalam satu request.
 */
export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.userId),
  });

  if (!user) return null;

  if (!user) return null;

  // Proteksi data sensitif (Tainting)
  // Menandai objek user agar tidak bisa dikirim langsung ke Client Component.
  experimental_taintObjectReference(
    "Jangan kirim seluruh objek user ke client. Gunakan hanya field yang diperlukan untuk keamanan data.",
    user,
  );

  return user;
});
