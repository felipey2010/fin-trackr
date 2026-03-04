import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const type = req.nextUrl.searchParams.get("type") || "all"
  const userId = session.user.id
  const rows: string[] = []

  if (type === "income" || type === "all") {
    rows.push("Type,Date,Source/Category,Amount,Notes")
    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    })
    for (const inc of incomes) {
      const date = format(inc.date, "yyyy-MM-dd")
      const notes = (inc.notes || "").replace(/"/g, '""')
      rows.push(
        `Income,${date},"${inc.source}",${Number(inc.amount)},"${notes}"`
      )
    }
  }

  if (type === "expenses" || type === "all") {
    if (type === "all" && rows.length > 0) {
      // Header already added
    } else {
      rows.push("Type,Date,Source/Category,Amount,Notes")
    }
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    })
    for (const exp of expenses) {
      const date = format(exp.date, "yyyy-MM-dd")
      const notes = (exp.notes || "").replace(/"/g, '""')
      rows.push(
        `Expense,${date},"${exp.category}",${Number(exp.amount)},"${notes}"`
      )
    }
  }

  const csv = rows.join("\n")
  const filename = `fintrackr-export-${format(new Date(), "yyyy-MM-dd")}.csv`

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
