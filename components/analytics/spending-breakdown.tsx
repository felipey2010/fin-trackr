"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface MonthlyTrend {
  month: string
  income: number
  expenses: number
  savings: number
}

export function SpendingBreakdown({ data }: { data: MonthlyTrend[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly Income vs Expenses</CardTitle>
        <CardDescription>12-month comparison of income and spending</CardDescription>
      </CardHeader>
      <CardContent>
        {data.every((d) => d.income === 0 && d.expenses === 0) ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Not enough data to show spending breakdown.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "var(--radius)",
                  color: "var(--color-card-foreground)",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="var(--color-chart-2)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
