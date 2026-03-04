import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from "./constants"

type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
type IncomeSource = (typeof INCOME_SOURCES)[number]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateFromString(date: string) {
  return new Date(date)
}

export function getCategory(category: string): ExpenseCategory {
  const normalized = category.trim()

  if ((EXPENSE_CATEGORIES as readonly string[]).includes(normalized)) {
    return normalized as ExpenseCategory
  }

  return "Other"
}

export function getSource(source: string): IncomeSource {
  const normalized = source.trim()

  if ((INCOME_SOURCES as readonly string[]).includes(normalized)) {
    return normalized as IncomeSource
  }

  return "Other"
}
