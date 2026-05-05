import {
  Utensils,
  Car,
  Receipt,
  Home,
  Heart,
  GraduationCap,
  ShoppingBag,
  Zap,
  Smartphone,
  Briefcase,
  Wallet,
  TrendingDown,
  Plus,
  Coffee,
  Bus,
  Film,
  Music,
  Wrench,
  Activity,
  Tag,
} from "lucide-react";

// Financial Priority Types (50/30/20 Rule)
export const PRIORITY_OPTIONS = [
  "Kebutuhan",
  "Keinginan",
] as const;

export type PriorityType = (typeof PRIORITY_OPTIONS)[number];

export const EXPENSE_CATEGORIES = [
  // Needs (50%)
  {
    name: "Makanan",
    icon: Utensils,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    priority: "Kebutuhan",
  },
  {
    name: "Transport",
    icon: Car,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    priority: "Kebutuhan",
  },
  {
    name: "Tagihan",
    icon: Receipt,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    priority: "Kebutuhan",
  },
  {
    name: "Rumah",
    icon: Home,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    priority: "Kebutuhan",
  },
  {
    name: "Kesehatan",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-500/10",
    priority: "Kebutuhan",
  },
  {
    name: "Pendidikan",
    icon: GraduationCap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    priority: "Kebutuhan",
  },
  // Wants (30%)
  {
    name: "Belanja",
    icon: ShoppingBag,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    priority: "Keinginan",
  },
  {
    name: "Hiburan",
    icon: Zap,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    priority: "Keinginan",
  },
  {
    name: "Pulsa",
    icon: Smartphone,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    priority: "Keinginan",
  },
  {
    name: "Kerja",
    icon: Briefcase,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    priority: "Keinginan",
  },
];

export const INCOME_CATEGORIES = [
  {
    name: "Gaji",
    icon: Wallet,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  { name: "Bonus", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  {
    name: "Investasi",
    icon: TrendingDown,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    name: "Lainnya",
    icon: Plus,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
];

export const ICON_MAP: Record<string, any> = {
  Utensils,
  Coffee,
  Car,
  Bus,
  ShoppingBag,
  Zap,
  Receipt,
  Heart,
  Activity,
  Smartphone,
  Home,
  GraduationCap,
  Briefcase,
  Wallet,
  TrendingDown,
  Plus,
  Film,
  Music,
  Wrench,
  Tag,
};

export const AVAILABLE_ICONS = [
  { id: "Coffee", icon: Coffee },
  { id: "Utensils", icon: Utensils },
  { id: "Car", icon: Car },
  { id: "Bus", icon: Bus },
  { id: "ShoppingBag", icon: ShoppingBag },
  { id: "Zap", icon: Zap },
  { id: "Receipt", icon: Receipt },
  { id: "Heart", icon: Heart },
  { id: "Activity", icon: Activity },
  { id: "Smartphone", icon: Smartphone },
  { id: "Home", icon: Home },
  { id: "GraduationCap", icon: GraduationCap },
  { id: "Briefcase", icon: Briefcase },
  { id: "Film", icon: Film },
  { id: "Music", icon: Music },
  { id: "Wrench", icon: Wrench },
  { id: "Wallet", icon: Wallet },
  { id: "TrendingDown", icon: TrendingDown },
  { id: "Tag", icon: Tag },
  { id: "Plus", icon: Plus },
];
