"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

function getScoreLabel(score: number) {
  if (score >= 80) return { label: "Excellent", color: "text-success" }
  if (score >= 60) return { label: "Good", color: "text-chart-2" }
  if (score >= 40) return { label: "Fair", color: "text-warning" }
  return { label: "Needs Work", color: "text-destructive" }
}

function getStrokeColor(score: number) {
  if (score >= 80) return "var(--color-success)"
  if (score >= 60) return "var(--color-chart-2)"
  if (score >= 40) return "var(--color-warning)"
  return "var(--color-destructive)"
}

export function HealthScore({ score }: { score: number }) {
  const { label, color } = getScoreLabel(score)
  const circumference = 2 * Math.PI * 56
  const offset = circumference - (score / 100) * circumference

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Financial Health Score</CardTitle>
        <CardDescription>Based on savings rate, spending trends, and diversification</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pt-2">
        <div className="relative h-40 w-40">
          <svg className="h-40 w-40 -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke={getStrokeColor(score)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${color}`}>{score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <p className={`text-lg font-semibold ${color}`}>{label}</p>
      </CardContent>
    </Card>
  )
}
