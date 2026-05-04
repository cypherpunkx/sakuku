import { getStatisticsData } from "@/lib/actions";
import { StatisticsTabContent } from "../_components/tabs/statistics-tab-content";
import { MonthFilter } from "./_components/month-filter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistik Keuangan",
  description: "Analisis mendalam mengenai arus kas dan distribusi pengeluaran Anda.",
};

export default async function StatistikPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const statsData = await getStatisticsData(month);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-gradient-primary">Statistik Keuangan</h1>
          <p className="text-muted-foreground font-medium">
            Pantau kesehatan finansial Anda melalui data visual yang cerdas.
          </p>
        </div>
        
        <MonthFilter currentMonth={statsData.targetMonth} />
      </div>

      <section>
        <StatisticsTabContent 
          dailyStats={statsData.dailyStats} 
          categoryStats={statsData.categoryStats}
          targetMonth={statsData.targetMonth}
          comparison={statsData.comparison}
        />
      </section>
    </div>
  );
}
