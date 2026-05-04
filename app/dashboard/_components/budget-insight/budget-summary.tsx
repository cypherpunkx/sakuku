"use client";

import { Info } from "lucide-react";

interface BudgetSummaryProps {
  isNeedsSafe: boolean;
  isWantsSafe: boolean;
  isSavingsSafe: boolean;
  wantsPerc: number;
  overBudgetCategories?: string[];
}

export function BudgetSummary({
  isNeedsSafe,
  isWantsSafe,
  isSavingsSafe,
  wantsPerc,
  overBudgetCategories = [],
}: BudgetSummaryProps) {
  const overCount = overBudgetCategories.length;
  const isAllSafe = isNeedsSafe && isWantsSafe && isSavingsSafe && overCount === 0;

  // Format list of categories: "Makan, Transportasi, dan Hiburan"
  const formattedCategories = new Intl.ListFormat("id-ID", {
    style: "long",
    type: "conjunction",
  }).format(overBudgetCategories);

  return (
    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex gap-4 items-center">
      <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
        <Info className="size-5 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold">Kesimpulan Bulan Ini</p>
        <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
          {overCount > 0 && isNeedsSafe && isWantsSafe && isSavingsSafe ? (
            <p>
              Secara umum alokasi Anda <span className="text-emerald-500 font-bold">sehat</span>, namun anggaran untuk <span className="text-rose-500 font-bold">{formattedCategories}</span> sudah terlampaui. Cek detailnya di tab Anggaran.
            </p>
          ) : !isAllSafe ? (
            <>
              {!isNeedsSafe && (
                <p>
                  Alokasi <span className="text-rose-500 font-bold">Kebutuhan</span> melampaui batas 50%. Pertimbangkan untuk meninjau kembali tagihan tetap.
                </p>
              )}
              {!isWantsSafe && (
                <p>
                  Alokasi <span className="text-amber-500 font-bold">Keinginan</span> melebihi target ({wantsPerc.toFixed(1)}%). Pertimbangkan untuk membatasi belanja tersier.
                </p>
              )}
              {!isSavingsSafe && (
                <p>
                  Alokasi <span className="text-emerald-500 font-bold">Tabungan</span> di bawah 20%. Cobalah menekan pengeluaran sekunder untuk meningkatkan cadangan kas.
                </p>
              )}
              {overCount > 0 && (
                <p>
                  Selain itu, anggaran <span className="text-rose-500 font-bold">{formattedCategories}</span> telah melebihi limit.
                </p>
              )}
            </>
          ) : (
            <p>
              Luar biasa! Pengelolaan keuangan Anda sangat <span className="text-emerald-500 font-bold">sehat</span>. Semua alokasi berada dalam zona ideal prinsip 50/30/20.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
