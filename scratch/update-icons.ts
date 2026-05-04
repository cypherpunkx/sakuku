
import { db } from "../lib/db/index";
import { categories } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function updateIcons() {
  const iconUpdates = [
    { name: "Makanan", icon: "Utensils" },
    { name: "Transport", icon: "Car" },
    { name: "Tagihan", icon: "Receipt" },
    { name: "Hiburan", icon: "Film" },
    { name: "Belanja", icon: "ShoppingBag" },
    { name: "Kesehatan", icon: "Heart" },
    { name: "Pulsa", icon: "Smartphone" },
    { name: "Rumah", icon: "Home" },
  ];

  for (const update of iconUpdates) {
    await db.update(categories)
      .set({ icon: update.icon })
      .where(eq(categories.name, update.name));
    console.log(`Updated ${update.name} to use ${update.icon} icon`);
  }
}

updateIcons().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
