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
import { useGetIncome } from "@/hooks/use-queries"
import { createIncome, deleteIncome, updateIncome } from "@/lib/actions/income"
import { INCOME_SOURCES } from "@/lib/constants"
import { getDateFromString, getSource } from "@/lib/utils"
import { incomeSchema } from "@/lib/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface IncomeItem {
  id: string
  amount: number
  source: string
  date: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function IncomePage() {
  const queryClient = useQueryClient()
  const [sourceFilter, setSourceFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<IncomeItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: incomes = [], isLoading } = useGetIncome(sourceFilter)

  const createMutation = useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setDialogOpen(false)
      toast.success("Income added successfully")
    },
    onError: () => toast.error("Failed to add income"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateIncome(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setEditingItem(null)
      toast.success("Income updated successfully")
    },
    onError: () => toast.error("Failed to update income"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setDeleteId(null)
      toast.success("Income deleted successfully")
    },
    onError: () => toast.error("Failed to delete income"),
  })

  const totalIncome = incomes.reduce(
    (sum: number, i: IncomeItem) => sum + i.amount,
    0
  )

  return (
    <>
      <PageHeader
        title="Income"
        description="Track and manage your income sources"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Income
          </Button>
        }
      />
      <div className="flex flex-col gap-6 px-6 py-4">
        <div className="flex items-center justify-between">
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {INCOME_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Total:{" "}
            <span className="font-semibold text-foreground">
              $
              {totalIncome.toLocaleString("en-US", {
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
                  <TableHead>Source</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TransactionTableSkeleton />
                ) : incomes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No income records yet. Add your first income above.
                    </TableCell>
                  </TableRow>
                ) : (
                  incomes.map((income: IncomeItem) => (
                    <TableRow key={income.id}>
                      <TableCell className="font-medium">
                        {format(new Date(income.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{income.source}</Badge>
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-muted-foreground">
                        {income.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        +$
                        {income.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingItem(income)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(income.id)}
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
            <DialogTitle>Add Income</DialogTitle>
          </DialogHeader>
          <TransactionForm
            schema={incomeSchema}
            options={INCOME_SOURCES}
            optionLabel="Source"
            onSubmit={async (data) => {
              await createMutation.mutateAsync(data)
            }}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <TransactionForm
              schema={incomeSchema}
              options={INCOME_SOURCES}
              optionLabel="Source"
              defaultValues={{
                amount: editingItem.amount,
                source: getSource(editingItem.source),
                date: getDateFromString(editingItem.date),
                notes: editingItem.notes || "",
              }}
              onSubmit={async (data) => {
                await updateMutation.mutateAsync({ id: editingItem.id, data })
              }}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </>
  )
}
