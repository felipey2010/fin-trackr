"use client"

import { CategoryPieChart } from "@/components/dashboard/category-pie-chart"
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton"
import { IncomeVsExpensesChart } from "@/components/dashboard/income-vs-expenses-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { PageHeader } from "@/components/shared/page-header"
import { useGetDashboardData } from "@/hooks/use-queries"

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardData()

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your financial health this month"
      />
      {isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex flex-col gap-6 px-6 py-4">
          <SummaryCards
            totalIncome={data.totalIncome}
            totalExpenses={data.totalExpenses}
            netBalance={data.netBalance}
            savingsRate={data.savingsRate}
            incomeChange={data.incomeChange}
            expenseChange={data.expenseChange}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <IncomeVsExpensesChart data={data.monthlyData} />
            <CategoryPieChart data={data.categoryBreakdown} />
          </div>
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
      )}
    </>
  )
}
