import { z } from "zod"
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from "./constants"

export const incomeSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(999999999, "Amount is too large"),
  source: z.enum(INCOME_SOURCES, {
    errorMap: () => ({ message: "Please select a valid source" }),
  }),
  date: z.coerce.date({ errorMap: () => ({ message: "Please select a valid date" }) }),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional().or(z.literal("")),
})

export const expenseSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(999999999, "Amount is too large"),
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  date: z.coerce.date({ errorMap: () => ({ message: "Please select a valid date" }) }),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional().or(z.literal("")),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const signInSchema = z.object({
  email: z.string(),
  password: z.string({ message: 'A senha é obrigatória' }),
})

export type IncomeFormData = z.infer<typeof incomeSchema>
export type ExpenseFormData = z.infer<typeof expenseSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
