import { getAnalyticsData, getDashboardData } from "@/lib/actions/analytics"
import { getExpenses } from "@/lib/actions/expenses"
import { getIncomes } from "@/lib/actions/income"
import { useQuery } from "@tanstack/react-query"

export function useGetAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsData,
    refetchInterval: false,
  })
}

export function useGetExpenses(categoryFilter: string) {
  return useQuery({
    queryKey: ["expenses", categoryFilter],
    queryFn: () => getExpenses({ category: categoryFilter }),
    enabled: !!categoryFilter,
    refetchInterval: false,
  })
}

export function useGetIncome(sourceFilter: string) {
  return useQuery({
    queryKey: ["incomes", sourceFilter],
    queryFn: () => getIncomes({ source: sourceFilter }),
    enabled: !!sourceFilter,
    refetchInterval: false,
  })
}

export function useGetDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    refetchInterval: false,
  })
}
