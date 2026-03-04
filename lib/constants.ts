export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Rent & Housing",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Education",
  "Shopping",
  "Insurance",
  "Savings & Investments",
  "Other",
] as const

export const INCOME_SOURCES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Rental",
  "Gift",
  "Other",
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeSource = (typeof INCOME_SOURCES)[number]

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "hsl(25, 95%, 53%)",
  "Rent & Housing": "hsl(220, 70%, 50%)",
  "Transportation": "hsl(280, 65%, 60%)",
  "Utilities": "hsl(45, 93%, 47%)",
  "Entertainment": "hsl(340, 75%, 55%)",
  "Healthcare": "hsl(160, 60%, 45%)",
  "Education": "hsl(200, 70%, 50%)",
  "Shopping": "hsl(310, 60%, 50%)",
  "Insurance": "hsl(180, 55%, 45%)",
  "Savings & Investments": "hsl(140, 70%, 40%)",
  "Other": "hsl(0, 0%, 60%)",
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const
