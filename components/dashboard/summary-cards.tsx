"use client"

import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  savingsRate: number
  incomeChange: number
  expenseChange: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function TrendBadge({ value, invert = false }: { value: number; invert?: boolean }) {
  const isPositive = invert ? value < 0 : value > 0
  const color = isPositive ? "text-success" : value === 0 ? "text-muted-foreground" : "text-destructive"

  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${color}`}>
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}%
      <span className="text-muted-foreground">vs last month</span>
    </span>
  )
}

export function SummaryCards({
  totalIncome,
  totalExpenses,
  netBalance,
  savingsRate,
  incomeChange,
  expenseChange,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      change: <TrendBadge value={incomeChange} />,
      icon: TrendingUp,
      iconColor: "text-success bg-success/10",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      change: <TrendBadge value={expenseChange} invert />,
      icon: TrendingDown,
      iconColor: "text-destructive bg-destructive/10",
    },
    {
      title: "Net Balance",
      value: formatCurrency(netBalance),
      change: (
        <span className={`text-xs font-medium ${netBalance >= 0 ? "text-success" : "text-destructive"}`}>
          {netBalance >= 0 ? "Surplus" : "Deficit"} this month
        </span>
      ),
      icon: DollarSign,
      iconColor: netBalance >= 0
        ? "text-success bg-success/10"
        : "text-destructive bg-destructive/10",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      change: (
        <span className={`text-xs font-medium ${savingsRate >= 20 ? "text-success" : savingsRate >= 0 ? "text-warning" : "text-destructive"}`}>
          {savingsRate >= 25 ? "Excellent" : savingsRate >= 15 ? "Good" : savingsRate >= 0 ? "Below target" : "Negative"}
        </span>
      ),
      icon: PiggyBank,
      iconColor: savingsRate >= 20
        ? "text-success bg-success/10"
        : "text-warning bg-warning/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconColor}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
            <div className="mt-1">{card.change}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
