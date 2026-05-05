import { db } from "./lib/db";
import * as schema from "./lib/db/schema";
import { eq } from "drizzle-orm";

async function checkData() {
  const users = await db.select().from(schema.users);
  const transactions = await db.select().from(schema.transactions);
  
  console.log("USERS:", JSON.stringify(users, null, 2));
  console.log("TRANSACTIONS:", JSON.stringify(transactions, null, 2));
}

checkData().catch(console.error);
