import { Metadata } from "next";
import { ShieldCheck, User as UserIcon, Wallet2, Lock } from "lucide-react";
import { getUser, getDashboardData } from "@/lib/actions/dashboard.actions";
import { ProfileForm } from "./_components/profile-form";
import { MembershipCard } from "./_components/membership-card";
import { FinanceSettingsForm } from "./_components/finance-settings-form";
import { CategoryManager } from "./_components/category-manager";
import { SecuritySettings } from "./_components/security-settings";
import { NotificationSettings } from "./_components/notification-settings";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Pengaturan",
  description: "Kelola profil dan konfigurasi keuangan SakuKu Anda.",
};

export default async function SettingsPage() {
  const user = await getUser();
  const { categories } = await getDashboardData();

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pb-32 max-w-6xl mx-auto animate-in fade-in duration-700">
      {/* Info Section */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium">
          Atur identitas, preferensi, dan keamanan akun Anda dalam satu tempat.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-background/40 backdrop-blur-md border border-border/40 p-1 rounded-2xl flex-wrap h-auto">
          <TabsTrigger
            value="profile"
            className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
          >
            <UserIcon className="size-4 mr-2" />
            Profil & Keamanan
          </TabsTrigger>
          <TabsTrigger
            value="finance"
            className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
          >
            <Wallet2 className="size-4 mr-2" />
            Konfigurasi Keuangan
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
          >
            <Lock className="size-4 mr-2" />
            Keamanan & Notifikasi
          </TabsTrigger>
        </TabsList>

        {/* Profile & Security Tab */}
        <TabsContent value="profile" className="space-y-8 mt-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-black italic text-gradient-primary uppercase tracking-tight">
                  Identitas Digital
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pastikan informasi profil Anda selalu terbaru untuk memudahkan
                  pemulihan akun dan sinkronisasi data antar perangkat.
                </p>
              </div>

              <MembershipCard />

              <div className="p-4 rounded-2xl border border-border/40 bg-background/20 backdrop-blur-sm flex items-start gap-3">
                <ShieldCheck className="size-5 text-emerald-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    Keamanan Terjamin
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Data Anda dienkripsi secara end-to-end dan disimpan dengan
                    standar keamanan perbankan.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <ProfileForm user={user} />
            </div>
          </div>
        </TabsContent>

        {/* Finance Configuration Tab */}
        <TabsContent value="finance" className="space-y-8 mt-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-black italic text-gradient-primary uppercase tracking-tight">
                  Sistem Keuangan
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Konfigurasikan mata uang utama dan siklus penagihan Anda untuk
                  laporan yang lebih akurat.
                </p>
              </div>

              <FinanceSettingsForm user={user} />
            </div>

            <div className="lg:col-span-3">
              <CategoryManager categories={categories} />
            </div>
          </div>
        </TabsContent>

        {/* Security & Notifications Tab */}
        <TabsContent value="security" className="space-y-8 mt-0 outline-none pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-black italic text-gradient-primary uppercase tracking-tight">
                  Privasi & Proteksi
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Amankan akses akun Anda dengan otentikasi ganda dan kelola kata sandi secara aman.
                </p>
              </div>
              
              <SecuritySettings user={user} />
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-black italic text-gradient-primary uppercase tracking-tight">
                  Pusat Notifikasi
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Atur bagaimana Anda ingin menerima pembaruan dari SakuKu untuk tetap terinformasi.
                </p>
              </div>

              <NotificationSettings user={user} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="bg-border/40 mt-8" />
      
      {/* Footer Info */}
      <div className="relative z-20 py-12 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
          SakuKu v1.0.0 &bull; Dibuat dengan &hearts; untuk Keuangan Anda
        </p>
      </div>

      {/* Final Spacer to prevent clipping */}
      <div className="h-24 w-full shrink-0" />
    </div>
  );
}
