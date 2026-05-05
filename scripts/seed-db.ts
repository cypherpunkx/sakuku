import { db } from '../lib/db';
import * as schema from '../lib/db/schema';
import bcrypt from 'bcryptjs';

// --- Data dari Mock Dashboard ---
// --- Data dari Mock Dashboard ---
const DATA_PENGELUARAN = [
  { name: "Makanan", value: 3500000, color: "#f43f5e", priority: "Kebutuhan" },
  { name: "Tagihan", value: 2000000, color: "#f59e0b", priority: "Kebutuhan" },
  { name: "Transport", value: 1200000, color: "#10b981", priority: "Kebutuhan" },
  { name: "Hiburan", value: 800000, color: "#6366f1", priority: "Keinginan" },
  { name: "Belanja", value: 740000, color: "#ec4899", priority: "Keinginan" },
];

const TOTAL_INCOME = 15000000;

// Menghasilkan transaksi acak untuk mensimulasikan penggunaan nyata
const generateRandomTransactions = (month: string, categoryMap: Map<string, number>, userId: string) => {
  const transactions = [];
  const days = new Date().getDate(); // Sampai hari ini
  
  const stores: Record<string, string[]> = {
    "Makanan": ["Gofood", "Grabfood", "Nasi Padang", "Warung Bu Tedjo", "Starbucks", "Kopi Kenangan"],
    "Tagihan": ["PLN", "PDAM", "Indihome", "BPJS"],
    "Transport": ["Pertamina", "Gojek", "Grab", "Bengkel AHASS"],
    "Hiburan": ["Netflix", "Spotify", "Cinema XXI", "Steam"],
    "Belanja": ["Indomaret", "Alfamart", "Shopee", "Tokopedia", "Uniqlo"],
    "Pendidikan": ["Gramedia", "Udemy"],
    "Kesehatan": ["Apotek K-24", "Halodoc"],
  };

  const categories = Array.from(categoryMap.keys()).filter(name => name !== "Gaji" && name !== "Bonus");

  for (let i = 1; i <= days; i++) {
    const dayStr = i.toString().padStart(2, '0');
    const date = `${month}-${dayStr}`;
    
    // 1-3 transaksi per hari
    const dailyCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < dailyCount; j++) {
      const catName = categories[Math.floor(Math.random() * categories.length)];
      const catStores = stores[catName] || ["Toko Umum"];
      const store = catStores[Math.floor(Math.random() * catStores.length)];
      
      transactions.push({
        amount: Math.floor(Math.random() * 200000) + 15000,
        categoryId: categoryMap.get(catName),
        type: 'expense' as const,
        description: `Beli ${catName} di ${store}`,
        store: store,
        date: date,
        userId: userId,
      });
    }
  }
  return transactions;
};

const BILLS = [
  { name: "Internet & TV", provider: "Indihome", amount: 450000, due: "01", urgent: true, iconName: "Wifi" },
  { name: "Tagihan Listrik", provider: "PLN Pascaprabayar", amount: 850000, due: "05", urgent: true, iconName: "Zap" },
  { name: "Tagihan Air", provider: "PDAM Kota", amount: 120000, due: "10", urgent: false, iconName: "Droplets" },
  { name: "Premi Asuransi", provider: "Prudential", amount: 1200000, due: "15", urgent: false, iconName: "ShieldCheck" },
];

async function main() {
  console.log('🌱 Memulai proses seeding database...');

  // Hapus data lama
  await db.delete(schema.savingsGoals);
  await db.delete(schema.bills);
  await db.delete(schema.userLearningProgress);
  await db.delete(schema.userBookmarks);
  await db.delete(schema.transactions);
  await db.delete(schema.budgets);
  await db.delete(schema.categories);
  await db.delete(schema.users);

  console.log('✅ Database dikosongkan');

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-CA");
  const currentMonth = currentDay.slice(0, 7);

  // 1. Buat User Default
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const [defaultUser] = await db.insert(schema.users).values({
    id: 'user_1',
    name: 'Admin SakuKu',
    email: 'admin@sakuku.com',
    password: hashedPassword,
    balance: TOTAL_INCOME,
    hasOnboarding: true,
    createdAt: new Date().toISOString(),
  }).returning();

  console.log('👤 User berhasil dibuat');

  // 2. Buat Kategori
  const categoryMap = new Map();
  
  const allCats = [
    ...DATA_PENGELUARAN,
    { name: "Kesehatan", color: "#ef4444", priority: "Kebutuhan" },
    { name: "Pulsa", color: "#06b6d4", priority: "Keinginan" },
    { name: "Rumah", color: "#64748b", priority: "Kebutuhan" },
    { name: "Pendidikan", color: "#8b5cf6", priority: "Kebutuhan" },
    { name: "Kerja", color: "#0ea5e9", priority: "Keinginan" },
    { name: "Tabungan", color: "#10b981", priority: "Tabungan" },
    { name: "Gaji", color: "#10b981", priority: "Lainnya", type: "income" },
    { name: "Bonus", color: "#8b5cf6", priority: "Lainnya", type: "income" },
  ];

  for (const cat of allCats) {
    const catType = (cat as any).type || 'expense';
    const [newCat] = await db.insert(schema.categories).values({
      name: cat.name,
      type: catType,
      color: cat.color,
      priority: (cat as any).priority || 'Lainnya',
      icon: catType === 'income' ? 'Wallet' : 'Tag',
    }).returning();
    categoryMap.set(cat.name, newCat.id);
  }

  console.log('🏷️ Kategori berhasil dibuat');

  // 3. Transaksi Pemasukan Awal (Saldo Awal + Gaji)
  await db.insert(schema.transactions).values([
    {
      amount: 25000000, // Tabungan Awal untuk Dana Darurat
      categoryId: categoryMap.get("Bonus"),
      type: 'income',
      description: 'Saldo Awal (Tabungan)',
      date: `${currentMonth}-01`,
      userId: defaultUser.id,
    },
    {
      amount: TOTAL_INCOME,
      categoryId: categoryMap.get("Gaji"),
      type: 'income',
      description: 'Gaji Bulanan',
      date: `${currentMonth}-01`,
      userId: defaultUser.id,
    }
  ]);

  // 4. Transaksi Pengeluaran Beragam
  const randomTransactions = generateRandomTransactions(currentMonth, categoryMap, defaultUser.id);
  await db.insert(schema.transactions).values(randomTransactions);

  console.log('💸 Transaksi berhasil dibuat');

  // 5. Tagihan
  for (const bill of BILLS) {
    const dueDate = `${currentMonth}-${bill.due}`;
    await db.insert(schema.bills).values({
      name: bill.name,
      provider: bill.provider,
      amount: bill.amount,
      dueDate: dueDate,
      urgent: bill.urgent,
      iconName: bill.iconName,
      userId: defaultUser.id,
      isPaid: false,
    });
  }

  // 6. Savings Goals
  const SAVINGS_GOALS = [
    { name: 'Dana Darurat', targetAmount: 50000000, currentAmount: 25000000, iconName: 'ShieldCheck', color: '#10b981', dueDate: '2026-12-31' },
    { name: 'Liburan Jepang', targetAmount: 15000000, currentAmount: 2500000, iconName: 'Plane', color: '#3b82f6', dueDate: '2026-06-15' },
    { name: 'Laptop Baru', targetAmount: 25000000, currentAmount: 12000000, iconName: 'Laptop', color: '#8b5cf6', dueDate: '2026-09-01' },
  ];

  for (const goal of SAVINGS_GOALS) {
    await db.insert(schema.savingsGoals).values({
      ...goal,
      userId: defaultUser.id,
    });
  }

  // 7. Budgets (Sesuai 50/30/20 ideal)
  const budgetList = [
    { name: "Makanan", limit: 3000000 },
    { name: "Tagihan", limit: 2000000 },
    { name: "Transport", limit: 1000000 },
    { name: "Hiburan", limit: 1000000 },
    { name: "Belanja", limit: 1000000 },
    { name: "Kesehatan", limit: 500000 },
  ];

  for (const b of budgetList) {
    await db.insert(schema.budgets).values({
      categoryId: categoryMap.get(b.name),
      amountLimit: b.limit,
      period: currentMonth,
      userId: defaultUser.id,
    });
  }

  // 8. Artikel Edukasi
  const INITIAL_ARTICLES = [
    { 
      title: "Metode Snowball vs Avalanche untuk Melunasi Utang", 
      category: "Umum", 
      readTime: "5 mnt baca", 
      color: "rose", 
      featured: true,
      content: `Melunasi utang bisa terasa sangat membebani...` 
    },
    { 
      title: "Cara Membangun Dana Darurat dari Nol", 
      category: "Tabungan", 
      readTime: "4 mnt baca", 
      color: "emerald", 
      featured: true,
      content: `Dana darurat adalah fondasi terpenting dalam perencanaan keuangan...`
    }
  ];

  for (const article of INITIAL_ARTICLES) {
    await db.insert(schema.articles).values(article);
  }

  console.log('✨ Seeding selesai dengan sukses!');
}

main().catch((err) => {
  console.error('❌ Seeding gagal:');
  console.error(err);
  process.exit(1);
});
