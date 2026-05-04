import { db } from './index';
import * as schema from './schema';
import { DATA_PENGELUARAN, RECENT_EXPENSES, BILLS, ARTICLES, TOTAL_INCOME } from '../mock/dashboard';

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await db.delete(schema.savingsGoals);
  await db.delete(schema.bills);
  await db.delete(schema.userLearningProgress);
  await db.delete(schema.userBookmarks);
  await db.delete(schema.transactions);
  await db.delete(schema.budgets);
  await db.delete(schema.categories);
  await db.delete(schema.users);

  console.log('Database cleared');

  // Use dynamic current date for seeding
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const currentMonth = currentDay.slice(0, 7); // YYYY-MM

  // 1. Create Default User
  const [defaultUser] = await db.insert(schema.users).values({
    id: 'user_1',
    name: 'Admin SakuKu',
    email: 'admin@sakuku.com',
    balance: TOTAL_INCOME,
  }).returning();

  console.log('User created');

  // ... (categories part remains same)
  // [CATEGORIES SECTION]
  const categoryMap = new Map();
  for (const cat of DATA_PENGELUARAN) {
    const [newCat] = await db.insert(schema.categories).values({
      name: cat.name,
      type: 'expense',
      color: cat.color,
      priority: cat.priority as 'Penting' | 'Sekunder',
      icon: 'Tag',
    }).returning();
    categoryMap.set(cat.name, newCat.id);
  }

  const otherExpenseCats = [
    { name: "Kesehatan", color: "oklch(0.6 0.2 20)" },
    { name: "Pulsa", color: "oklch(0.6 0.2 250)" },
    { name: "Rumah", color: "oklch(0.6 0.1 200)" },
    { name: "Pendidikan", color: "oklch(0.6 0.2 300)" },
    { name: "Kerja", color: "oklch(0.6 0.2 180)" },
    { name: "Tabungan", color: "#10b981" },
  ];

  for (const cat of otherExpenseCats) {
    const [newCat] = await db.insert(schema.categories).values({
      name: cat.name,
      type: 'expense',
      color: cat.color,
      priority: 'Sekunder',
      icon: 'Tag',
    }).returning();
    categoryMap.set(cat.name, newCat.id);
  }

  const incomeCats = [
    { name: "Gaji", color: "oklch(0.7 0.2 140)" },
    { name: "Bonus", color: "oklch(0.8 0.2 80)" },
    { name: "Investasi", color: "oklch(0.6 0.2 250)" },
    { name: "Lainnya", color: "oklch(0.7 0.1 200)" },
  ];

  for (const cat of incomeCats) {
    const [newCat] = await db.insert(schema.categories).values({
      name: cat.name,
      type: 'income',
      color: cat.color,
      priority: 'Penting',
      icon: 'Wallet',
    }).returning();
    categoryMap.set(cat.name, newCat.id);
  }

  console.log('Categories created');

  // 3. Create Initial Income Transaction (to make balance positive)
  await db.insert(schema.transactions).values({
    amount: TOTAL_INCOME,
    categoryId: categoryMap.get("Gaji"),
    type: 'income',
    description: 'Gaji Bulanan',
    store: 'SakuKu Corp',
    date: currentDay,
    userId: defaultUser.id,
  });

  // 4. Create Transactions from RECENT_EXPENSES (using current month)
  for (const exp of RECENT_EXPENSES) {
    // Replace 2024-05 with currentMonth
    const date = exp.date.replace("2024-05", currentMonth);

    await db.insert(schema.transactions).values({
      amount: exp.amount,
      categoryId: categoryMap.get(exp.category),
      type: 'expense',
      description: exp.store,
      store: exp.store,
      date: date,
      userId: defaultUser.id,
    });
  }

  console.log('Transactions created');

  // 5. Create Bills (using current/next month)
  for (const bill of BILLS) {
    const dueDate = bill.due.replace("2024-06", currentMonth); // Move to current month for visibility
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

  console.log('Bills created');

  // 6. Create Savings Goals
  const SAVINGS_GOALS = [
    { name: 'Dana Darurat', targetAmount: 20000000, currentAmount: 5000000, iconName: 'ShieldCheck', color: '#10b981' },
    { name: 'Liburan Jepang', targetAmount: 15000000, currentAmount: 2500000, iconName: 'Plane', color: '#3b82f6' },
    { name: 'Laptop Baru', targetAmount: 25000000, currentAmount: 12000000, iconName: 'Laptop', color: '#8b5cf6' },
  ];

  for (const goal of SAVINGS_GOALS) {
    await db.insert(schema.savingsGoals).values({
      ...goal,
      userId: defaultUser.id,
    });
  }

  console.log('Savings Goals created');

  // 7. Create Budgets
  for (const cat of DATA_PENGELUARAN) {
    await db.insert(schema.budgets).values({
      categoryId: categoryMap.get(cat.name),
      amountLimit: cat.value + 500000,
      period: currentMonth,
      userId: defaultUser.id,
    });
  }

  console.log('Budgets created');

  // 8. Create Articles with real content
  const INITIAL_ARTICLES = [
    { 
      title: "Metode Snowball vs Avalanche untuk Melunasi Utang", 
      category: "Umum", 
      readTime: "5 mnt baca", 
      color: "rose", 
      featured: true,
      content: `Melunasi utang bisa terasa sangat membebani, tetapi dengan strategi yang tepat, Anda bisa menyelesaikannya lebih cepat. Ada dua metode populer:

1. Metode Snowball: Anda fokus melunasi utang dengan nominal terkecil terlebih dahulu sambil membayar cicilan minimum untuk utang lainnya. Secara psikologis, ini memberikan rasa pencapaian saat satu per satu utang lunas.

2. Metode Avalanche: Anda fokus melunasi utang dengan bunga tertinggi terlebih dahulu. Secara matematis, ini akan menghemat lebih banyak uang dalam jangka panjang karena total bunga yang dibayar lebih sedikit.

Pilih metode yang paling cocok dengan kepribadian Anda. Kuncinya adalah konsistensi.`
    },
    { 
      title: "Cara Membangun Dana Darurat dari Nol", 
      category: "Tabungan", 
      readTime: "4 mnt baca", 
      color: "emerald", 
      featured: true,
      content: `Dana darurat adalah fondasi terpenting dalam perencanaan keuangan. Dana ini berfungsi sebagai bantalan saat terjadi hal-hal tak terduga seperti sakit, kehilangan pekerjaan, atau kerusakan mendadak.

Langkah membangun dana darurat:
- Targetkan setidaknya 3-6 kali pengeluaran bulanan.
- Mulai dari nominal kecil yang konsisten setiap bulan.
- Simpan di instrumen yang likuid seperti tabungan biasa atau reksadana pasar uang.
- Gunakan HANYA untuk keadaan darurat yang sesungguhnya.`
    },
    { 
      title: "5 Tips Menghemat Pengeluaran Makan di Luar", 
      category: "Makanan", 
      readTime: "3 mnt baca", 
      color: "orange",
      content: `Pengeluaran makan seringkali menjadi "kebocoran halus" dalam anggaran. Berikut cara menghematnya:
- Masak sendiri di rumah lebih sering.
- Bawa bekal ke kantor atau sekolah.
- Manfaatkan promo atau cashback saat harus makan di luar.
- Hindari memesan minuman manis atau tambahan yang mahal; air putih seringkali cukup.
- Rencanakan menu mingguan (meal prep) untuk menghindari belanja bahan makanan yang tidak perlu.`
    },
    { 
      title: "Strategi Transportasi Hemat untuk Pekerja Kota", 
      category: "Transport", 
      readTime: "4 mnt baca", 
      color: "blue",
      content: `Transportasi bisa memakan porsi besar dalam anggaran bulanan. Cobalah strategi ini:
- Gunakan transportasi umum seperti MRT, LRT, atau TransJakarta.
- Pertimbangkan sistem ride-sharing jika harus menggunakan transportasi online.
- Carpooling dengan rekan kantor yang searah.
- Jika jarak memungkinkan, berjalan kaki atau bersepeda selain hemat juga menyehatkan.`
    },
    { 
      title: "Mengelola Budget Hiburan Tanpa Merasa Kurang", 
      category: "Hiburan", 
      readTime: "5 mnt baca", 
      color: "purple",
      content: `Hiburan penting untuk kesehatan mental, tapi jangan sampai menguras kantong.
- Alokasikan maksimal 10% dari pendapatan untuk hiburan.
- Cari alternatif hiburan gratis seperti piknik di taman kota atau menonton film di rumah.
- Manfaatkan langganan keluarga (family plan) untuk layanan streaming.
- Belanjakan uang untuk "pengalaman" daripada sekadar barang.`
    },
    { 
      title: "Investasi Reksadana untuk Pemula", 
      category: "Investasi", 
      readTime: "7 mnt baca", 
      color: "indigo",
      content: `Reksadana adalah instrumen investasi yang sangat cocok bagi pemula karena dikelola oleh Manajer Investasi profesional.

Jenis-jenis Reksadana:
1. Reksadana Pasar Uang: Risiko paling rendah, cocok untuk jangka pendek (< 1 tahun).
2. Reksadana Pendapatan Tetap: Mayoritas di obligasi, cocok untuk jangka menengah (1-3 tahun).
3. Reksadana Saham: Potensi imbal hasil tinggi dengan risiko tinggi, cocok untuk jangka panjang (> 5 tahun).

Mulailah dengan nominal kecil melalui aplikasi agen penjual reksadana terpercaya.`
    },
  ];

  for (const article of INITIAL_ARTICLES) {
    await db.insert(schema.articles).values(article);
  }

  console.log('Articles created');

  console.log('Seeding finished!');
}

main().catch((err) => {
  console.error('Seeding failed:');
  console.error(err);
  process.exit(1);
});
