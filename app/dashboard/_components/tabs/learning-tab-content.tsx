"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Award,
  Bookmark,
  FileText,
  PlayCircle,
  Inbox,
  CheckCircle2,
  Zap,
  BookOpen,
  Lightbulb,
  Clock,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "../empty-state";
import { toggleArticleProgress, toggleBookmark } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useTransition, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Image from "next/image";

interface LearningTabContentProps {
  initialArticles?: any[];
  initialTopics?: any[];
  recommended?: any;
  topCategory?: string;
  completedCount?: number;
  totalCount?: number;
}

export function LearningTabContent({
  initialArticles = [],
  initialTopics = [],
  recommended,
  topCategory = "Umum",
  completedCount = 0,
  totalCount = 0,
}: LearningTabContentProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const isFinancialCategory = (category: string) => {
    const financialKeywords = ["keuangan", "investasi", "tabungan", "berita", "budgeting", "hutang", "pajak", "perencanaan", "ekonomi", "aset"];
    return financialKeywords.some(key => category.toLowerCase().includes(key));
  };

  const categories = ["Semua", ...Array.from(new Set(initialArticles.map(a => a.category)))].filter(cat => {
    if (cat === "Semua") return true;
    return isFinancialCategory(cat);
  });

  const filteredArticles =
    selectedCategory === "Semua"
      ? initialArticles
      : initialArticles.filter((a) => a.category === selectedCategory);

  const handleToggleProgress = (articleId: number) => {
    startTransition(async () => {
      await toggleArticleProgress(articleId);
    });
  };

  const handleToggleBookmark = (articleId: number) => {
    startTransition(async () => {
      await toggleBookmark(articleId);
    });
  };

  const handleCardClick = (article: any) => {
    if (article.isExternal && article.url) {
      window.open(article.url, "_blank");
    } else {
      setSelectedArticle(article);
    }
  };

  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const level =
    progressPercentage < 30
      ? "Pemula"
      : progressPercentage < 70
        ? "Menengah"
        : "Ahli";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Smart Recommendation / Featured */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="size-5 text-primary animate-pulse" />
              Rekomendasi Untuk Kamu
            </h3>
            <Badge
              variant="outline"
              className="text-[10px] font-black uppercase tracking-tighter border-primary/30 text-primary"
            >
              Berdasarkan Pengeluaran {topCategory}
            </Badge>
          </div>
          {recommended ? (
            <Card
              className="group relative overflow-hidden border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-500 cursor-pointer shadow-xl shadow-primary/5 rounded-[32px]"
              onClick={() => handleCardClick(recommended)}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Lightbulb className="size-32 text-primary -rotate-12 translate-x-8 -translate-y-8" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8 md:p-10">
                <div className="w-full md:w-48 h-48 rounded-[24px] overflow-hidden bg-primary/20 shrink-0 relative shadow-2xl shadow-primary/20">
                  {recommended.imageUrl ? (
                    <Image
                      src={recommended.imageUrl}
                      alt={recommended.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/30 to-indigo-500/30">
                      <BookOpen className="size-12 text-white/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left flex flex-col">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1">
                      {recommended.category}
                    </Badge>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                      {recommended.readTime || "5 mnt baca"}
                    </span>
                  </div>
                  <h4
                    className={`font-black text-2xl md:text-3xl leading-tight transition-colors ${recommended.isCompleted ? "line-through text-muted-foreground" : "group-hover:text-primary"}`}
                  >
                    {recommended.title}
                  </h4>
                  <p className="text-base text-muted-foreground font-medium line-clamp-2 max-w-xl">
                    Pelajari strategi terbaik untuk mengoptimalkan pengeluaran{" "}
                    {topCategory} Anda dan tingkatkan kesehatan finansial hari
                    ini.
                  </p>
                  <div className="flex items-center gap-3 justify-center md:justify-start mt-auto pt-4">
                    <Button className="h-12 px-8 rounded-2xl bg-linear-to-r from-primary to-indigo-600 hover:opacity-90 text-white font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                      Baca Sekarang
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`size-12 rounded-2xl transition-all duration-300 border-primary/20 shadow-sm ${
                          recommended.isCompleted
                            ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40 shadow-lg shadow-emerald-500/10 scale-105"
                            : "bg-background/40 backdrop-blur-md hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleProgress(recommended.id);
                        }}
                        disabled={isPending}
                      >
                        <CheckCircle2
                          className={`size-6 transition-transform duration-500 ${recommended.isCompleted ? "scale-110" : ""}`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`size-12 rounded-2xl transition-all duration-300 border-primary/20 shadow-sm ${
                          recommended.isBookmarked
                            ? "bg-primary/20 text-primary border-primary/40 shadow-lg shadow-primary/10 scale-105"
                            : "bg-background/40 backdrop-blur-md hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(recommended.id);
                        }}
                        disabled={isPending}
                      >
                        <Bookmark
                          className={`size-6 transition-all duration-500 ${recommended.isBookmarked ? "fill-primary scale-110" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <EmptyState icon={Inbox} title="Belum ada rekomendasi" />
          )}
        </section>

        {/* Article Grid */}
        <section id="articles-list" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-2 shrink-0 md:min-w-[240px]">
              <FileText className="size-5 text-primary" />
              <h3 className="text-lg font-bold whitespace-nowrap">
                Materi Edukasi
              </h3>
            </div>
            
            {/* Category Pills - Safe Scrollable */}
            <div className="flex-1 min-w-0 overflow-hidden flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 md:mx-0 md:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                    selectedCategory === cat
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                      : "bg-muted/10 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, i) => (
                <Card
                  key={article.id}
                  className={`group relative overflow-hidden border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 cursor-pointer flex flex-col min-h-[280px] ${article.isCompleted ? "opacity-75 bg-muted/20" : ""}`}
                  onClick={() => handleCardClick(article)}
                >
                  {/* Card Header Media */}
                  {article.isExternal && article.imageUrl ? (
                    <div className="relative w-full h-32 overflow-hidden border-b border-border/40">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative w-full h-32 overflow-hidden border-b border-border/40 bg-primary/5 flex items-center justify-center">
                      {/* Premium Pattern for Internal Articles */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary via-transparent to-transparent animate-pulse" />
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,var(--tw-gradient-stops))] from-primary via-transparent to-primary" />
                      <FileText className="size-10 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}

                  <CardHeader className="p-4 space-y-3 grow">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="w-fit border-border/40 bg-background/50 font-bold text-[10px] px-2 py-0.5"
                          >
                            {article.category}
                          </Badge>
                          {article.isExternal ? (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black uppercase tracking-tighter px-2 py-0.5">
                              Live Feed
                            </Badge>
                          ) : (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-tighter px-2 py-0.5">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <CardTitle
                          className={`text-base font-black transition-colors line-clamp-2 leading-tight tracking-tight ${article.isCompleted ? "line-through text-muted-foreground" : "group-hover:text-primary"}`}
                        >
                          {article.title}
                        </CardTitle>
                        {article.source && (
                          <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">
                            {article.source}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons - Large & Premium */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className={`size-12 rounded-2xl transition-all duration-300 border-border/40 shadow-sm ${
                            article.isCompleted
                              ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40 shadow-lg shadow-emerald-500/10 scale-105"
                              : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleProgress(article.id);
                          }}
                          disabled={isPending}
                        >
                          <CheckCircle2
                            className={`size-6 transition-transform duration-500 ${article.isCompleted ? "scale-110" : ""}`}
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className={`size-12 rounded-2xl transition-all duration-300 border-border/40 shadow-sm ${
                            article.isBookmarked
                              ? "bg-primary/20 text-primary border-primary/40 shadow-lg shadow-primary/10 scale-105"
                              : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(article.id);
                          }}
                          disabled={isPending}
                        >
                          <Bookmark
                            className={`size-6 transition-all duration-500 ${article.isBookmarked ? "fill-primary scale-110" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-auto pt-4 border-t border-border/10">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 font-bold bg-background/60 px-2 py-1 rounded-lg border border-border/40 text-primary">
                          <FileText className="size-3.5" /> {article.readTime}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12">
                <EmptyState
                  icon={FileText}
                  title="Belum ada artikel"
                  description="Terus pantau halaman ini untuk mendapatkan tips finansial terbaru."
                />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Sidebar: Learning Progress & Recommendations */}
      <div className="w-full lg:w-80 space-y-6 lg:sticky lg:top-24 h-fit self-start">
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Award className="size-4" />
              Progres Belajar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-muted-foreground">Level: {level}</span>
                  <span className="text-primary">{progressPercentage}%</span>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-2 bg-primary/10"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Anda telah menyelesaikan{" "}
                <span className="text-white font-bold">{completedCount}</span>{" "}
                dari <span className="text-white font-bold">{totalCount}</span>{" "}
                artikel. Terus tingkatkan!
              </p>
              <Button
                className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20"
                onClick={() => {
                  const el = document.getElementById("articles-list");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Lanjutkan Belajar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Topik Populer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64 px-6 pb-6">
              <div className="space-y-4">
                {initialTopics.length > 0 ? (
                  initialTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between group cursor-pointer"
                    >
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {topic.name}
                      </span>
                      <Badge
                        variant="ghost"
                        className="text-[10px] text-muted-foreground"
                      >
                        {topic.count}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <EmptyState title="Topik Kosong" className="py-10" />
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-dashed border-border/60 bg-transparent">
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm font-bold">SakuKu Community</p>
            <p className="text-xs text-muted-foreground">
              Gabung dengan ribuan orang lainnya yang sedang belajar finansial.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-xl border-primary/30"
            >
              Gabung Komunitas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Article Detail Sheet */}
      <Sheet
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl bg-[#0a0a0b] border-l border-border/40 flex flex-col p-0 gap-0 shadow-2xl shadow-primary/20 focus:outline-none"
        >
          {selectedArticle &&
            (() => {
              const currentArticle =
                initialArticles.find((a) => a.id === selectedArticle.id) ||
                (recommended?.id === selectedArticle.id ? recommended : null) ||
                selectedArticle;
              return (
                <>
                  {currentArticle.imageUrl && (
                    <div className="w-full h-72 overflow-hidden relative">
                      <Image
                        src={currentArticle.imageUrl}
                        alt={currentArticle.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0b] via-[#0a0a0b]/20 to-transparent" />
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-10 pt-12 space-y-8">
                      <SheetHeader className="space-y-6 text-left">
                        <SheetDescription className="sr-only">
                          Detail materi edukasi mengenai {currentArticle?.title}
                        </SheetDescription>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            {currentArticle.category}
                          </Badge>
                          {!currentArticle.isExternal && (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                            >
                              Verified Curriculum
                            </Badge>
                          )}
                        </div>

                        <SheetTitle className="text-4xl font-black tracking-tight leading-[1.1] bg-linear-to-br from-white to-white/60 bg-clip-text text-transparent">
                          {currentArticle.title}
                        </SheetTitle>

                        <div className="space-y-4 border-y border-border/10 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                Kategori
                              </Label>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="border-primary/30 bg-primary/5 text-primary text-[10px] font-bold px-3"
                                >
                                  {currentArticle.category}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                Waktu Baca
                              </Label>
                              <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                                <Clock className="size-3.5 text-primary/60" />
                                {currentArticle.readTime}
                              </div>
                            </div>
                          </div>

                          {currentArticle.source && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                Sumber Informasi
                              </Label>
                              <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                                <Award className="size-3.5 text-amber-500" />
                                {currentArticle.source}
                              </div>
                            </div>
                          )}
                        </div>
                      </SheetHeader>
                      <Separator className="bg-white/5" />

                      {currentArticle.videoUrl && (
                        <div className="aspect-video w-full rounded-[24px] overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                          <iframe
                            src={currentArticle.videoUrl.replace(
                              "watch?v=",
                              "embed/",
                            )}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}

                      <div className="prose prose-invert max-w-none">
                        {currentArticle.content?.includes(
                          "📊 ANALISIS PERSONAL",
                        ) ? (
                          <div className="mb-10">
                            <div className="p-6 rounded-[24px] bg-linear-to-br from-indigo-500/20 via-indigo-500/5 to-transparent border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Zap className="size-12 text-indigo-400 rotate-12" />
                              </div>
                              <div className="relative z-10">
                                <div className="text-lg leading-relaxed text-indigo-100/90 whitespace-pre-wrap font-bold italic">
                                  {currentArticle.content.split("---")[0]}
                                </div>
                              </div>
                            </div>
                            <div className="mt-10 text-lg leading-relaxed text-muted-foreground/90 whitespace-pre-wrap font-medium">
                              {currentArticle.content.split("---")[1]}
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg leading-relaxed text-muted-foreground/90 whitespace-pre-wrap font-medium">
                            {currentArticle.content ||
                              "Materi ini sedang dalam tahap penyusunan oleh tim ahli finansial SakuKu. Nantikan update materi selengkapnya segera!"}
                          </div>
                        )}

                        <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                          <h4 className="font-bold text-white flex items-center gap-2">
                            <CheckCircle2 className="size-5 text-emerald-500" />
                            Kesimpulan Materi
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Materi ini dirancang khusus untuk membantu Anda
                            memahami konsep{" "}
                            {currentArticle.category.toLowerCase()} secara
                            mendalam. Terus konsisten dalam belajar dan terapkan
                            poin-poin penting di atas dalam pengelolaan keuangan
                            harian Anda untuk mencapai kebebasan finansial.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Footer Actions */}
                  <div className="p-6 px-10 bg-[#0d0d0e] border-t border-white/5 flex items-center gap-4">
                    <Button
                      className={`flex-1 h-14 rounded-2xl font-black text-base transition-all duration-300 ${
                        currentArticle.isCompleted
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10"
                          : "bg-linear-to-r from-primary to-indigo-600 hover:opacity-90 text-white shadow-xl shadow-primary/20"
                      }`}
                      onClick={() => {
                        handleToggleProgress(currentArticle.id);
                      }}
                      disabled={isPending}
                    >
                      {currentArticle.isCompleted ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="size-5" /> Materi Selesai
                        </span>
                      ) : (
                        "Selesaikan Materi"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className={`size-14 rounded-2xl transition-all duration-300 border-white/5 ${
                        currentArticle.isBookmarked
                          ? "bg-primary/10 text-primary border-primary/30 shadow-lg"
                          : "hover:bg-white/5 hover:border-white/10"
                      }`}
                      onClick={() => {
                        handleToggleBookmark(currentArticle.id);
                      }}
                      disabled={isPending}
                    >
                      <Bookmark
                        className={`size-6 transition-transform duration-300 ${currentArticle.isBookmarked ? "fill-primary scale-110" : "group-hover:scale-110"}`}
                      />
                    </Button>
                  </div>
                </>
              );
            })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
