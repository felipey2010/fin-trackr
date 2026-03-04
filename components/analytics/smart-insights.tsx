"use client"

import { AlertCircle, CheckCircle2, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Insight {
  type: "positive" | "warning" | "info"
  title: string
  description: string
}

const iconMap = {
  positive: CheckCircle2,
  warning: AlertCircle,
  info: Info,
}

const styleMap = {
  positive: "border-success/30 bg-success/5 text-success",
  warning: "border-warning/30 bg-warning/5 text-warning",
  info: "border-primary/30 bg-primary/5 text-primary",
}

export function SmartInsights({ insights }: { insights: Insight[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Smart Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {insights.map((insight, i) => {
            const Icon = iconMap[insight.type]
            return (
              <div
                key={i}
                className={`flex gap-3 rounded-lg border p-3 ${styleMap[insight.type]}`}
              >
                <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
