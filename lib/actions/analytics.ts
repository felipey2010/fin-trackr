"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const SIZE_LIMIT = 5

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function getDashboardData() {
  const userId = await getUserId()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  )

  const [
    currentIncomes,
    currentExpenses,
    lastMonthIncomes,
    lastMonthExpenses,
    recentIncomes,
    recentExpenses,
    expensesByCategory,
    last6MonthsIncomes,
    last6MonthsExpenses,
  ] = await Promise.all([
    prisma.income.findMany({
      where: { userId, date: { gte: startOfMonth } },
    }),
    prisma.expense.findMany({
      where: { userId, date: { gte: startOfMonth } },
    }),
    prisma.income.findMany({
      where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } },
    }),
    prisma.expense.findMany({
      where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } },
    }),
    prisma.income.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.expense.groupBy({
      by: ["category"],
      where: { userId, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.income.findMany({
      where: {
        userId,
        date: {
          gte: new Date(now.getFullYear(), now.getMonth() - SIZE_LIMIT, 1),
        },
      },
    }),
    prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: new Date(now.getFullYear(), now.getMonth() - SIZE_LIMIT, 1),
        },
      },
    }),
  ])

  const totalIncome = currentIncomes.reduce(
    (sum, i) => sum + Number(i.amount),
    0
  )
  const totalExpenses = currentExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  )
  const lastMonthTotalIncome = lastMonthIncomes.reduce(
    (sum, i) => sum + Number(i.amount),
    0
  )
  const lastMonthTotalExpenses = lastMonthExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  )
  const netBalance = totalIncome - totalExpenses
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  const incomeChange =
    lastMonthTotalIncome > 0
      ? ((totalIncome - lastMonthTotalIncome) / lastMonthTotalIncome) * 100
      : 0
  const expenseChange =
    lastMonthTotalExpenses > 0
      ? ((totalExpenses - lastMonthTotalExpenses) / lastMonthTotalExpenses) *
        100
      : 0

  const categoryBreakdown = expensesByCategory.map((g) => ({
    category: g.category,
    amount: Number(g._sum.amount ?? 0),
  }))

  const monthlyData = []
  for (let i = SIZE_LIMIT; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      0,
      23,
      59,
      59
    )
    const monthName = monthDate.toLocaleDateString("en-US", { month: "short" })

    const monthIncome = last6MonthsIncomes
      .filter((inc) => inc.date >= monthDate && inc.date <= monthEnd)
      .reduce((sum, inc) => sum + Number(inc.amount), 0)
    const monthExpense = last6MonthsExpenses
      .filter((exp) => exp.date >= monthDate && exp.date <= monthEnd)
      .reduce((sum, exp) => sum + Number(exp.amount), 0)

    monthlyData.push({
      month: monthName,
      income: monthIncome,
      expenses: monthExpense,
    })
  }

  const recentTransactions = [
    ...recentIncomes.map((i) => ({
      id: i.id,
      type: "income" as const,
      amount: Number(i.amount),
      label: i.source,
      date: i.date.toISOString(),
      notes: i.notes,
    })),
    ...recentExpenses.map((e) => ({
      id: e.id,
      type: "expense" as const,
      amount: Number(e.amount),
      label: e.category,
      date: e.date.toISOString(),
      notes: e.notes,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate,
    incomeChange,
    expenseChange,
    categoryBreakdown,
    monthlyData,
    recentTransactions,
  }
}

export async function getAnalyticsData() {
  const userId = await getUserId()
  const now = new Date()

  const [allIncomes, allExpenses] = await Promise.all([
    prisma.income.findMany({
      where: {
        userId,
        date: { gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) },
      },
      orderBy: { date: "asc" },
    }),
    prisma.expense.findMany({
      where: {
        userId,
        date: { gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) },
      },
      orderBy: { date: "asc" },
    }),
  ])

  const monthlyTrends = []
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      0,
      23,
      59,
      59
    )
    const monthName = monthDate.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    })

    const monthIncome = allIncomes
      .filter((inc) => inc.date >= monthDate && inc.date <= monthEnd)
      .reduce((sum, inc) => sum + Number(inc.amount), 0)
    const monthExpense = allExpenses
      .filter((exp) => exp.date >= monthDate && exp.date <= monthEnd)
      .reduce((sum, exp) => sum + Number(exp.amount), 0)

    monthlyTrends.push({
      month: monthName,
      income: monthIncome,
      expenses: monthExpense,
      savings: monthIncome - monthExpense,
      savingsRate:
        monthIncome > 0
          ? ((monthIncome - monthExpense) / monthIncome) * 100
          : 0,
    })
  }

  // Category spending for current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthExpenses = allExpenses.filter((e) => e.date >= startOfMonth)
  const categoryMap: Record<string, number> = {}
  currentMonthExpenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount)
  })
  const categorySpending = Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  const currentMonthIncomes = allIncomes.filter((i) => i.date >= startOfMonth)
  const sourceMap: Record<string, number> = {}
  currentMonthIncomes.forEach((i) => {
    sourceMap[i.source] = (sourceMap[i.source] || 0) + Number(i.amount)
  })
  const incomeBySource = Object.entries(sourceMap)
    .map(([source, amount]) => ({ source, amount }))
    .sort((a, b) => b.amount - a.amount)

  const insights = generateInsights(
    monthlyTrends,
    categorySpending,
    incomeBySource
  )

  const healthScore = calculateHealthScore(monthlyTrends, categorySpending)

  return {
    monthlyTrends,
    categorySpending,
    incomeBySource,
    insights,
    healthScore,
  }
}

interface MonthlyTrend {
  month: string
  income: number
  expenses: number
  savings: number
  savingsRate: number
}

interface CategoryAmount {
  category: string
  amount: number
}

interface SourceAmount {
  source: string
  amount: number
}

function generateInsights(
  trends: MonthlyTrend[],
  categories: CategoryAmount[],
  sources: SourceAmount[]
) {
  const insights: Array<{
    type: "positive" | "warning" | "info"
    title: string
    description: string
  }> = []

  const current = trends[trends.length - 1]
  const previous = trends[trends.length - 2]

  if (current && previous) {
    if (current.savingsRate >= 25) {
      insights.push({
        type: "positive",
        title: "Great Savings Rate",
        description: `You're saving ${current.savingsRate.toFixed(1)}% of your income this month - above the recommended 25% target.`,
      })
    } else if (current.savingsRate > 0 && current.savingsRate < 15) {
      insights.push({
        type: "warning",
        title: "Low Savings Rate",
        description: `Your savings rate is ${current.savingsRate.toFixed(1)}%. Try to aim for at least 20-25% by reducing discretionary spending.`,
      })
    } else if (current.savingsRate < 0) {
      insights.push({
        type: "warning",
        title: "Spending Exceeds Income",
        description: `You're spending more than you earn this month. Review your expenses to find areas to cut back.`,
      })
    }

    if (current.expenses > previous.expenses * 1.2 && previous.expenses > 0) {
      const increase = (
        ((current.expenses - previous.expenses) / previous.expenses) *
        100
      ).toFixed(0)
      insights.push({
        type: "warning",
        title: "Spending Increase Detected",
        description: `Your spending increased by ${increase}% compared to last month. Check your category breakdown for details.`,
      })
    } else if (
      current.expenses < previous.expenses * 0.9 &&
      previous.expenses > 0
    ) {
      const decrease = (
        ((previous.expenses - current.expenses) / previous.expenses) *
        100
      ).toFixed(0)
      insights.push({
        type: "positive",
        title: "Spending Reduced",
        description: `Great job! You've reduced spending by ${decrease}% compared to last month.`,
      })
    }
  }

  const totalExpenses = categories.reduce((sum, c) => sum + c.amount, 0)
  if (totalExpenses > 0) {
    const topCategory = categories[0]
    if (topCategory && topCategory.amount / totalExpenses > 0.4) {
      insights.push({
        type: "info",
        title: `High Spending on ${topCategory.category}`,
        description: `${topCategory.category} accounts for ${((topCategory.amount / totalExpenses) * 100).toFixed(0)}% of your total spending. Consider if you can optimize here.`,
      })
    }
  }

  if (sources.length === 1) {
    insights.push({
      type: "info",
      title: "Single Income Source",
      description:
        "All your income comes from one source. Diversifying income streams can provide more financial stability.",
    })
  } else if (sources.length >= 3) {
    insights.push({
      type: "positive",
      title: "Diversified Income",
      description: `You have ${sources.length} income sources. Great financial diversification!`,
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "Keep Tracking",
      description:
        "Add more transactions to get personalized financial insights and recommendations.",
    })
  }

  return insights
}

function calculateHealthScore(
  trends: MonthlyTrend[],
  categories: CategoryAmount[]
) {
  let score = 50
  const recent = trends.slice(-3)

  // Savings rate component (up to 30 points)
  const avgSavingsRate =
    recent.length > 0
      ? recent.reduce((sum, t) => sum + t.savingsRate, 0) / recent.length
      : 0
  if (avgSavingsRate >= 25) score += 30
  else if (avgSavingsRate >= 15) score += 20
  else if (avgSavingsRate >= 5) score += 10
  else if (avgSavingsRate < 0) score -= 10

  // Spending trend (up to 10 points)
  if (recent.length >= 2) {
    const expenseTrend = recent[recent.length - 1].expenses - recent[0].expenses
    if (expenseTrend < 0) score += 10
    else if (expenseTrend === 0) score += 5
  }

  // Category diversification (up to 10 points)
  const totalExpenses = categories.reduce((sum, c) => sum + c.amount, 0)
  if (totalExpenses > 0 && categories.length >= 3) {
    const topCategoryRatio = categories[0].amount / totalExpenses
    if (topCategoryRatio < 0.35) score += 10
    else if (topCategoryRatio < 0.5) score += 5
  }

  return Math.max(0, Math.min(100, score))
}
