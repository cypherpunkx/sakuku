"use client";

import { useState } from "react";
import { Shield, Key, Smartphone, AlertCircle, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateSecuritySettings } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";

interface SecuritySettingsProps {
  user: any;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [loading, setLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactorEnabled || false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handle2FAToggle = async (checked: boolean) => {
    setLoading(true);
    try {
      const result = await updateSecuritySettings({ twoFactorEnabled: checked });
      if (result.success) {
        setIs2FAEnabled(checked);
        toast.success(checked ? "2FA Berhasil diaktifkan!" : "2FA Dinonaktifkan", {
          description: checked 
            ? "Akun Anda sekarang lebih aman dengan verifikasi dua langkah." 
            : "Kami menyarankan tetap mengaktifkan 2FA untuk keamanan maksimal.",
        });
      } else {
        toast.error("Gagal memperbarui 2FA");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }
    
    // Simulate password change
    toast.info("Simulasi Ganti Password", {
      description: "Dalam versi demo ini, perubahan password hanya bersifat simulasi UI.",
    });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication Card */}
      <Card className="border-border/40 bg-background/40 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Shield className="size-24" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Smartphone className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Verifikasi 2 Langkah</CardTitle>
              <CardDescription>Lapisan keamanan ekstra untuk akun Anda.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="space-y-1">
              <p className="font-bold text-foreground">Aktifkan Autentikasi 2FA</p>
              <p className="text-xs text-muted-foreground">
                Gunakan aplikasi autentikator untuk mengamankan setiap login.
              </p>
            </div>
            <Switch 
              checked={is2FAEnabled} 
              onCheckedChange={handle2FAToggle}
              disabled={loading}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <AlertCircle className="size-5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-500/80 leading-relaxed">
              <strong>Catatan:</strong> Saat diaktifkan, Anda akan diminta kode dari aplikasi autentikator setiap kali melakukan login di perangkat baru.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card className="border-border/40 bg-background/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Key className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Ganti Password</CardTitle>
              <CardDescription>Perbarui kata sandi Anda secara berkala.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                  className="h-12 bg-background/50 border-border/40 rounded-xl"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                    className="h-12 bg-background/50 border-border/40 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="h-12 bg-background/50 border-border/40 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                className="px-8 h-12 bg-gradient-premium text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                Perbarui Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
