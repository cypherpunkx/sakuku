import { getLearningData } from "@/lib/actions";
import { LearningTabContent } from "../_components/tabs/learning-tab-content";
import { BookOpen } from "lucide-react";
import { LearningSearch } from "./_components/learning-search";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edukasi Finansial",
  description: "Tingkatkan literasi keuangan Anda dengan artikel dan tips cerdas dari SakuKu.",
};

export default async function EdukasiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const learningData = await getLearningData(q);
  const userName = learningData.user?.name?.split(" ")[0] || "Teman";

  return (
    <div className="max-w-7xl mx-auto w-full space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Premium Hero Section - Enhanced Mesh Gradient (Indigo + Purple) */}
      <section className="relative overflow-hidden rounded-[32px] bg-indigo-600/10 border border-indigo-500/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 size-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <BookOpen className="size-3" />
            Personalized Learning
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Halo <span className="text-gradient-primary">{userName}!</span> <br />
            Siap Jadi Lebih Cerdas Finansial?
          </h1>
          
          <p className="text-muted-foreground text-lg font-medium max-w-xl">
            Pilih topik yang paling relevan dengan kebutuhanmu hari ini dan mulai langkah kecil menuju kebebasan finansial.
          </p>
 
          <Suspense fallback={<div className="w-full h-14 bg-muted animate-pulse rounded-2xl" />}>
            <div className="w-full max-w-md">
              <LearningSearch />
            </div>
          </Suspense>
        </div>
      </section>

      <LearningTabContent 
        initialArticles={learningData.articles} 
        recommended={learningData.recommended}
        topCategory={learningData.topCategory}
        initialTopics={learningData.topics}
        completedCount={learningData.completedCount}
        totalCount={learningData.totalCount}
      />
    </div>
  );
}
