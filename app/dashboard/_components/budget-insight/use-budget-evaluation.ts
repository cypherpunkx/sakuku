"use client";

import { useMemo } from "react";

interface BudgetInsightProps {
  totalIncome: number;
  needs: number;
  wants: number;
  savings: number;
}

export function useBudgetEvaluation({ totalIncome, needs, wants, savings }: BudgetInsightProps) {
  return useMemo(() => {
    // Avoid division by zero and handle 0 income
    const income = totalIncome || 0;

    // Hitung persentase aktual
    const needsPerc = income > 0 ? (needs / income) * 100 : 0;
    const wantsPerc = income > 0 ? (wants / income) * 100 : 0;
    const savingsPerc = income > 0 ? (savings / income) * 100 : 0;

    // Evaluasi kondisi
    const isNeedsSafe = needsPerc <= 50;
    const isWantsSafe = wantsPerc <= 30;
    const isSavingsSafe = savingsPerc >= 20;

    type InsightStatus = "safe" | "warning" | "danger";

    // Detailed status for better UX
    const getNeedsStatus = (): InsightStatus => {
      if (needsPerc > 50) return "danger";
      if (needsPerc > 45) return "warning";
      return "safe";
    };

    const getWantsStatus = (): InsightStatus => {
      if (wantsPerc > 30) return "danger";
      if (wantsPerc > 25) return "warning";
      return "safe";
    };

    const getSavingsStatus = (): InsightStatus => {
      if (savingsPerc >= 20) return "safe";
      if (savingsPerc >= 15) return "warning";
      return "danger";
    };

    const insights = [
      {
        label: "Kebutuhan (Needs)",
        target: 50,
        actual: needsPerc,
        amount: needs,
        limitAmount: income * 0.5,
        color: "bg-rose-500",
        isSafe: isNeedsSafe,
        status: getNeedsStatus(),
        description: "Sewa, tagihan, makanan pokok, dan transportasi wajib.",
      },
      {
        label: "Keinginan (Wants)",
        target: 30,
        actual: wantsPerc,
        amount: wants,
        limitAmount: income * 0.3,
        color: "bg-amber-500",
        isSafe: isWantsSafe,
        status: getWantsStatus(),
        description: "Hiburan, belanja hobi, dan makan di luar.",
      },
      {
        label: "Tabungan (Savings)",
        target: 20,
        actual: savingsPerc,
        amount: savings,
        limitAmount: income * 0.2,
        color: "bg-emerald-500",
        isSafe: isSavingsSafe,
        status: getSavingsStatus(),
        description: "Tabungan darurat, investasi, dan cicilan hutang.",
      },
    ];

    return {
      insights,
      isNeedsSafe,
      isWantsSafe,
      isSavingsSafe,
      needsPerc,
      wantsPerc,
      savingsPerc,
      hasIncome: income > 0,
    };
  }, [totalIncome, needs, wants, savings]);
}
