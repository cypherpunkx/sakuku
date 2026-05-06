"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useBudgetEvaluation } from "./use-budget-evaluation";
import { InsightCard } from "./insight-card";
import { BudgetSummary } from "./budget-summary";

interface BudgetInsightProps {
  totalIncome: number;
  needs: number;
  wants: number;
  savings: number;
  overBudgetCategories?: string[];
  currency?: string;
}

export function BudgetInsight503020(props: BudgetInsightProps) {
  const { 
    insights, 
    isNeedsSafe, 
    isWantsSafe, 
    isSavingsSafe, 
    wantsPerc,
    hasIncome 
  } = useBudgetEvaluation(props);

  return (
    <Card className="border-primary/20 bg-primary/5 backdrop-blur-md rounded-3xl relative overflow-hidden">
      <div className="absolute -right-8 -top-8 size-32 bg-primary/10 rounded-full blur-3xl" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Insight Prinsip 50/30/20
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Evaluasi alokasi keuangan berdasarkan standar finansial sehat.
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary font-bold px-3 py-1">
            {new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date())}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          {insights.map((item) => (
            <InsightCard key={item.label} {...item} hasIncome={hasIncome} currency={props.currency} />
          ))}
        </div>

        <BudgetSummary 
          isNeedsSafe={isNeedsSafe}
          isWantsSafe={isWantsSafe}
          isSavingsSafe={isSavingsSafe}
          wantsPerc={wantsPerc}
          overBudgetCategories={props.overBudgetCategories}
        />
      </CardContent>
    </Card>
  );
}
