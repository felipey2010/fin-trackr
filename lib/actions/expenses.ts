"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { ExpenseFormData, expenseSchema } from "@/lib/validators"
import { revalidateTag } from "next/cache"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function getExpenses(params?: {
  category?: string
  startDate?: string
  endDate?: string
}) {
  const userId = await getUserId()

  const where: Record<string, unknown> = { userId }

  if (params?.category && params.category !== "all") {
    where.category = params.category
  }
  if (params?.startDate || params?.endDate) {
    where.date = {
      ...(params?.startDate && { gte: new Date(params.startDate) }),
      ...(params?.endDate && { lte: new Date(params.endDate) }),
    }
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
  })

  return expenses.map((e) => ({
    ...e,
    amount: Number(e.amount),
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }))
}

export async function createExpense(data: ExpenseFormData) {
  const userId = await getUserId()
  const validated = expenseSchema.parse(data)

  const expense = await prisma.expense.create({
    data: {
      userId,
      amount: validated.amount,
      category: validated.category,
      date: validated.date,
      notes: validated.notes || null,
    },
  })

  revalidateTag("expenses", "max")
  revalidateTag("dashboard", "max")

  return {
    ...expense,
    amount: Number(expense.amount),
    date: expense.date.toISOString(),
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  }
}

export async function updateExpense(id: string, data: ExpenseFormData) {
  const userId = await getUserId()
  const validated = expenseSchema.parse(data)

  const existing = await prisma.expense.findUnique({ where: { id } })
  if (!existing || existing.userId !== userId) throw new Error("Not found")

  const expense = await prisma.expense.update({
    where: { id },
    data: {
      amount: validated.amount,
      category: validated.category,
      date: validated.date,
      notes: validated.notes || null,
    },
  })

  revalidateTag("expenses", "max")
  revalidateTag("dashboard", "max")

  return {
    ...expense,
    amount: Number(expense.amount),
    date: expense.date.toISOString(),
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  }
}

export async function deleteExpense(id: string) {
  const userId = await getUserId()

  const existing = await prisma.expense.findUnique({ where: { id } })
  if (!existing || existing.userId !== userId) throw new Error("Not found")

  await prisma.expense.delete({ where: { id } })

  revalidateTag("expenses", "max")
  revalidateTag("dashboard", "max")
}
