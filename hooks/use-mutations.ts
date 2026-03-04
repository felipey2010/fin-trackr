import {
  createExpense,
  deleteExpense,
  updateExpense as saveUpdatedExpense,
} from "@/lib/actions/expenses"
import { ExpenseFormData } from "@/lib/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function saveExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ExpenseFormData) => await createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function updateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExpenseFormData }) =>
      saveUpdatedExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function deleteExpenseData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => await deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
