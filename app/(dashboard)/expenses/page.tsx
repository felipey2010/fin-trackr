"use client"

import { PageHeader } from "@/components/shared/page-header"
import { DeleteDialog } from "@/components/transactions/delete-dialog"
import { TransactionForm } from "@/components/transactions/transaction-form"
import TransactionTableSkeleton from "@/components/transactions/transaction-table-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  deleteExpenseData,
  saveExpense,
  updateExpense,
} from "@/hooks/use-mutations"
import { useGetExpenses } from "@/hooks/use-queries"
import { CATEGORY_COLORS, EXPENSE_CATEGORIES } from "@/lib/constants"
import { getCategory, getDateFromString } from "@/lib/utils"
import { ExpenseFormData, expenseSchema } from "@/lib/validators"
import { format } from "date-fns"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ExpenseItem {
  id: string
  amount: number
  category: string
  date: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function ExpensesPage() {
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: expenses = [], isLoading } = useGetExpenses(categoryFilter)
  const { mutateAsync: saveExpenses, isPending: isCreating } = saveExpense()
  const { mutateAsync: updateExpenseMutation, isPending: isUpdating } =
    updateExpense()
  const { mutateAsync: deleteMutation } = deleteExpenseData()

  const createNewExpenses = async (data: ExpenseFormData) => {
    await saveExpenses(data, {
      onSuccess: () => {
        setDialogOpen(false)
        toast.success("Expense added successfully")
      },
      onError: () => toast.error("Failed to add expense"),
    })
  }

  async function updateExpenseData(data: ExpenseFormData) {
    if (!editingItem?.id) {
      toast.error("Failed to edit expense")
      return
    }

    await updateExpenseMutation(
      { id: editingItem.id, data },
      {
        onSuccess: () => {
          setEditingItem(null)
          toast.success("Expense updated successfully")
        },
        onError: () => toast.error("Failed to update expense"),
      }
    )
  }

  async function deleteExpense() {
    if (!deleteId) {
      toast.error("Failed to delete expense")
      return
    }

    await deleteMutation(deleteId, {
      onSuccess: () => {
        setDeleteId(null)
        toast.success("Expense deleted successfully")
      },
      onError: () => toast.error("Failed to delete expense"),
    })
  }

  const totalExpenses = expenses.reduce(
    (sum: number, e: ExpenseItem) => sum + e.amount,
    0
  )

  return (
    <>
      <PageHeader
        title="Expenses"
        description="Track and categorize your spending"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        }
      />
      <div className="flex flex-col gap-6 px-6 py-4">
        <div className="flex items-center justify-between">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Total:{" "}
            <span className="font-semibold text-foreground">
              $
              {totalExpenses.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>

        <Card>
          <CardContent className="p-0 px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TransactionTableSkeleton />
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No expense records yet. Add your first expense above.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense: ExpenseItem) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor:
                              CATEGORY_COLORS[expense.category] || "#888",
                            color: CATEGORY_COLORS[expense.category] || "#888",
                          }}
                        >
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-muted-foreground">
                        {expense.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        -$
                        {expense.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingItem(expense)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(expense.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <TransactionForm
            schema={expenseSchema}
            options={EXPENSE_CATEGORIES}
            optionLabel="Category"
            onSubmit={createNewExpenses}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <TransactionForm
              schema={expenseSchema}
              options={EXPENSE_CATEGORIES}
              optionLabel="Category"
              defaultValues={{
                amount: editingItem.amount,
                category: getCategory(editingItem.category),
                date: getDateFromString(editingItem.date),
                notes: editingItem.notes || "",
              }}
              onSubmit={updateExpenseData}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={deleteExpense}
      />
    </>
  )
}
