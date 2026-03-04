"use client"

import AnalyticsSkeleton from "@/components/analytics/analytics-skeleton"
import { HealthScore } from "@/components/analytics/health-score"
import { SavingsTrendChart } from "@/components/analytics/savings-trend-chart"
import { SmartInsights } from "@/components/analytics/smart-insights"
import { SpendingBreakdown } from "@/components/analytics/spending-breakdown"
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart"
import { PageHeader } from "@/components/shared/page-header"
import { useGetAnalytics } from "@/hooks/use-queries"

export default function AnalyticsPage() {
  const { data, isLoading } = useGetAnalytics()

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Deep dive into your financial patterns and insights"
      />
      {isLoading || !data ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="flex flex-col gap-6 px-6 py-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SavingsTrendChart data={data.monthlyTrends} />
            </div>
            <HealthScore score={data.healthScore} />
          </div>
          <SmartInsights insights={data.insights} />
          <div className="grid gap-6 lg:grid-cols-2">
            <SpendingBreakdown data={data.monthlyTrends} />
            <CategoryPieChart data={data.categorySpending} />
          </div>
        </div>
      )}
    </>
  )
}
