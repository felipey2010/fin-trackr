"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { incomeSchema } from "@/lib/validators"
import { revalidateTag } from "next/cache"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function getIncomes(params?: {
  source?: string
  startDate?: string
  endDate?: string
}) {
  const userId = await getUserId()

  const where: Record<string, unknown> = { userId }

  if (params?.source && params.source !== "all") {
    where.source = params.source
  }
  if (params?.startDate || params?.endDate) {
    where.date = {
      ...(params?.startDate && { gte: new Date(params.startDate) }),
      ...(params?.endDate && { lte: new Date(params.endDate) }),
    }
  }

  const incomes = await prisma.income.findMany({
    where,
    orderBy: { date: "desc" },
  })

  return incomes.map((i) => ({
    ...i,
    amount: Number(i.amount),
    date: i.date.toISOString(),
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }))
}

export async function createIncome(data: unknown) {
  const userId = await getUserId()
  const validated = incomeSchema.parse(data)

  const income = await prisma.income.create({
    data: {
      userId,
      amount: validated.amount,
      source: validated.source,
      date: validated.date,
      notes: validated.notes || null,
    },
  })

  revalidateTag("incomes", "max")
  revalidateTag("dashboard", "max")

  return {
    ...income,
    amount: Number(income.amount),
    date: income.date.toISOString(),
    createdAt: income.createdAt.toISOString(),
    updatedAt: income.updatedAt.toISOString(),
  }
}

export async function updateIncome(id: string, data: unknown) {
  const userId = await getUserId()
  const validated = incomeSchema.parse(data)

  const existing = await prisma.income.findUnique({ where: { id } })
  if (!existing || existing.userId !== userId) throw new Error("Not found")

  const income = await prisma.income.update({
    where: { id },
    data: {
      amount: validated.amount,
      source: validated.source,
      date: validated.date,
      notes: validated.notes || null,
    },
  })

  revalidateTag("incomes", "max")
  revalidateTag("dashboard", "max")

  return {
    ...income,
    amount: Number(income.amount),
    date: income.date.toISOString(),
    createdAt: income.createdAt.toISOString(),
    updatedAt: income.updatedAt.toISOString(),
  }
}

export async function deleteIncome(id: string) {
  const userId = await getUserId()

  const existing = await prisma.income.findUnique({ where: { id } })
  if (!existing || existing.userId !== userId) throw new Error("Not found")

  await prisma.income.delete({ where: { id } })

  revalidateTag("incomes", "max")
  revalidateTag("dashboard", "max")
}
