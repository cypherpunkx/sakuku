"use client";

import { useState, useEffect } from "react";
import { User, Mail, Link as LinkIcon, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/lib/actions/user.actions";

interface ProfileFormProps {
  user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
  });

  // Load draft
  useEffect(() => {
    const saved = sessionStorage.getItem("sakuku_profile_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((p) => ({ ...p, ...parsed }));
      } catch (e) {}
    }
  }, []);

  // Save draft
  useEffect(() => {
    if (formData.name !== (user?.name || "") || formData.email !== (user?.email || "")) {
      sessionStorage.setItem("sakuku_profile_draft", JSON.stringify(formData));
    }
  }, [formData, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        toast.success("Profil berhasil diperbarui!", {
          description: "Data Anda telah tersimpan dengan aman.",
        });
        sessionStorage.removeItem("sakuku_profile_draft");
      } else {
        toast.error("Gagal memperbarui profil", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem", {
        description: "Silakan coba beberapa saat lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="border-border/40 bg-background/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Informasi Profil</CardTitle>
        <CardDescription>
          Kelola informasi identitas Anda yang akan ditampilkan di seluruh aplikasi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Preview Section */}
          <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-border/40">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-xl transition-all duration-300 group-hover:border-primary/50">
                <AvatarImage src={formData.image || "https://github.com/shadcn.png"} />
                <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                  {formData.name?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <LinkIcon className="size-5 text-white" />
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-foreground">Foto Profil</h3>
              <p className="text-sm text-muted-foreground">
                Gunakan URL gambar untuk mengubah foto profil Anda.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-bold ml-1">Nama Lengkap</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-background/50 border-border/40 focus:border-primary/50 transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-bold ml-1">Alamat Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-background/50 border-border/40 focus:border-primary/50 transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image" className="text-sm font-bold ml-1">URL Avatar (Opsional)</Label>
              <div className="relative group">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="image"
                  name="image"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-background/50 border-border/40 focus:border-primary/50 transition-all rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="px-8 h-12 bg-gradient-premium text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
