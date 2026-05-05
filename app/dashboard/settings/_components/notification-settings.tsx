"use client";

import { useState } from "react";
import { Bell, Mail, Send, PieChart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { updateNotificationSettings } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";

interface NotificationSettingsProps {
  user: any;
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    pushNotifications: user?.pushNotifications ?? true,
    weeklyReport: user?.weeklyReport ?? true,
  });

  const handleToggle = async (key: keyof typeof settings, checked: boolean) => {
    setLoading(key);
    try {
      const result = await updateNotificationSettings({ [key]: checked });
      if (result.success) {
        setSettings(prev => ({ ...prev, [key]: checked }));
        toast.success("Preferensi diperbarui", {
          description: `Notifikasi ${key === 'emailNotifications' ? 'Email' : key === 'pushNotifications' ? 'Push' : 'Laporan Mingguan'} berhasil ${checked ? 'diaktifkan' : 'dinonaktifkan'}.`,
        });
      } else {
        toast.error("Gagal memperbarui pengaturan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(null);
    }
  };

  const notificationTypes = [
    {
      id: "emailNotifications",
      title: "Notifikasi Email",
      description: "Terima update transaksi dan peringatan keamanan via email.",
      icon: Mail,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "pushNotifications",
      title: "Notifikasi Push",
      description: "Dapatkan peringatan instan langsung di perangkat Anda.",
      icon: Send,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "weeklyReport",
      title: "Laporan Mingguan",
      description: "Ringkasan pengeluaran dan tips menabung setiap Senin pagi.",
      icon: PieChart,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <Card className="border-border/40 bg-background/40 backdrop-blur-xl h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Bell className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Preferensi Notifikasi</CardTitle>
            <CardDescription>Pilih bagaimana SakuKu berkomunikasi dengan Anda.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationTypes.map((type) => (
          <div 
            key={type.id}
            className="group flex items-center justify-between p-4 rounded-2xl bg-background/20 border border-border/40 hover:bg-background/40 transition-all hover:border-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className={cn("size-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", type.bgColor, type.color)}>
                <type.icon className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-foreground text-sm">{type.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] sm:max-w-xs">
                  {type.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {loading === type.id && <Loader2 className="size-4 animate-spin text-primary" />}
              <Switch 
                checked={settings[type.id as keyof typeof settings]} 
                onCheckedChange={(checked) => handleToggle(type.id as keyof typeof settings, checked)}
                disabled={loading !== null}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        ))}

        <div className="pt-4 mt-4 border-t border-border/40">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Tip: Aktifkan laporan mingguan untuk wawasan finansial yang lebih baik.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
