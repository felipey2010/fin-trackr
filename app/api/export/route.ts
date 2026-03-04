import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

const DELIMITER = ";"

function escapeCSV(value: string | number | null | undefined) {
  const str = String(value ?? "")
  return `"${str.replace(/"/g, '""')}"`
}

function formatAmount(value: any) {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const type = req.nextUrl.searchParams.get("type") || "all"
  const userId = session.user.id

  const rows: string[] = []
  rows.push(
    ["Type", "Date", "Source/Category", "Amount", "Notes"].join(DELIMITER)
  )

  if (type === "income" || type === "all") {
    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    })

    for (const inc of incomes) {
      rows.push(
        [
          "Income",
          format(inc.date, "dd/MM/yyyy"),
          escapeCSV(inc.source),
          formatAmount(inc.amount),
          escapeCSV(inc.notes),
        ].join(DELIMITER)
      )
    }
  }

  if (type === "expenses" || type === "all") {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    })

    for (const exp of expenses) {
      rows.push(
        [
          "Expense",
          format(exp.date, "dd/MM/yyyy"),
          escapeCSV(exp.category),
          formatAmount(exp.amount),
          escapeCSV(exp.notes),
        ].join(DELIMITER)
      )
    }
  }

  const csv = rows.join("\n")
  const filename = `fintrackr-export-${format(new Date(), "dd-MM-yyyy")}.csv`

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
