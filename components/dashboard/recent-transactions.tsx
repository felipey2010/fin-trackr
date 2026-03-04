"use client"

import { format } from "date-fns"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  label: string
  date: string
  notes: string | null
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No transactions yet. Start by adding income or expenses.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    tx.type === "income"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {tx.type === "income" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(tx.date), "MMM d, yyyy")}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "income" ? "text-success" : "text-destructive"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}$
                  {tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
