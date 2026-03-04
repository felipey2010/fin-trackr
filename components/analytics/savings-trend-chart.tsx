"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface TrendData {
  month: string
  savings: number
  savingsRate: number
}

export function SavingsTrendChart({ data }: { data: TrendData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Savings Trend</CardTitle>
        <CardDescription>Monthly savings over the past 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        {data.every((d) => d.savings === 0) ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Not enough data to show savings trend.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "var(--color-muted-foreground)" }}
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
                formatter={(value: number, name: string) => {
                  if (name === "savings") return [`$${value.toLocaleString()}`, "Savings"]
                  return [value, name]
                }}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="var(--color-chart-2)"
                fill="url(#savingsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
