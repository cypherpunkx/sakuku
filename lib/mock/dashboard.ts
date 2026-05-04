// --- Mock Data Dashboard SakuKu ---

export const DATA_PENGELUARAN = [
  { name: "Makanan", value: 3500000, color: "oklch(0.65 0.25 20)", priority: "Penting" },
  { name: "Tagihan", value: 2000000, color: "oklch(0.6 0.2 250)", priority: "Penting" },
  { name: "Transport", value: 1200000, color: "oklch(0.7 0.15 180)", priority: "Penting" },
  { name: "Hiburan", value: 800000, color: "oklch(0.6 0.2 300)", priority: "Sekunder" },
  { name: "Belanja", value: 740000, color: "oklch(0.75 0.15 60)", priority: "Sekunder" },
];

export const TOTAL_INCOME = 15000000;

export const RECENT_EXPENSES = [
  {
    date: "2024-05-29",
    store: "Gofood - Nasi Padang",
    category: "Makanan",
    amount: 45000,
  },
  {
    date: "2024-05-28",
    store: "Pertamina - Pertalite",
    category: "Transport",
    amount: 150000,
  },
  {
    date: "2024-05-27",
    store: "Netflix - Subscription",
    category: "Hiburan",
    amount: 180000,
  },
  {
    date: "2024-05-25",
    store: "Indomaret",
    category: "Belanja",
    amount: 75000,
  },
];

export const BILLS = [
  {
    name: "Internet & TV",
    provider: "Indihome",
    amount: 450000,
    due: "2024-06-01",
    daysLeft: 5,
    urgent: true,
    iconName: "Wifi",
  },
  {
    name: "Tagihan Listrik",
    provider: "PLN Pascaprabayar",
    amount: 850000,
    due: "2024-06-03",
    daysLeft: 7,
    urgent: true,
    iconName: "Zap",
  },
  {
    name: "Tagihan Air",
    provider: "PDAM Kota",
    amount: 120000,
    due: "2024-06-10",
    daysLeft: 14,
    urgent: false,
    iconName: "Zap",
  },
  {
    name: "Premi Asuransi",
    provider: "Prudential",
    amount: 1200000,
    due: "2024-06-15",
    daysLeft: 19,
    urgent: false,
    iconName: "ShieldCheck",
  },
];

export const ARTICLES = [
  {
    title: "Metode Snowball vs Avalanche untuk Melunasi Utang",
    category: "Utang",
    time: "5 mnt baca",
    color: "rose",
  },
  {
    title: "Cara Membangun Dana Darurat dari Nol",
    category: "Tabungan",
    time: "4 mnt baca",
    color: "emerald",
  },
  {
    title: "Investasi Reksadana: Risiko dan Keuntungan",
    category: "Investasi",
    time: "6 mnt baca",
    color: "amber",
  },
  {
    title: "Psikologi Keuangan: Mengapa Kita Impulsif?",
    category: "Psikologi",
    time: "7 mnt baca",
    color: "primary",
  },
];

export const POPULAR_TOPICS = [
  { name: "#InvestasiMuda", count: "450 Artikel" },
  { name: "#BebasUtang", count: "320 Artikel" },
  { name: "#DanaDarurat", count: "210 Artikel" },
  { name: "#Saham101", count: "180 Artikel" },
  { name: "#CryptoTips", count: "150 Artikel" },
  { name: "#PensiunDini", count: "90 Artikel" },
];
