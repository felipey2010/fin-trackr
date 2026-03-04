"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface TransactionFormProps<T extends z.ZodType> {
  schema: T
  options: readonly string[]
  optionLabel: string
  defaultValues?: Partial<z.infer<T>>
  onSubmit: (data: z.infer<T>) => Promise<void>
  isLoading?: boolean
}

export function TransactionForm<T extends z.ZodType>({
  schema,
  options,
  optionLabel,
  defaultValues,
  onSubmit,
  isLoading,
}: TransactionFormProps<T>) {
  const optionField = optionLabel === "Source" ? "source" : "category"

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: defaultValues?.amount ?? "",
      [optionField]:
        (defaultValues as Record<string, unknown>)?.[optionField] || "",
      date: defaultValues?.date
        ? new Date(defaultValues.date as string)
        : new Date(),
      notes: (defaultValues?.notes as string) || "",
    } as Record<string, unknown>,
  })

  const dateValue = watch("date") as Date | undefined

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="pl-7"
            {...register("amount")}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-destructive">
            {(errors.amount as { message?: string }).message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>{optionLabel}</Label>
        <Select
          value={(watch(optionField) as string) || ""}
          onValueChange={(val) =>
            setValue(optionField, val, { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${optionLabel.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors[optionField] && (
          <p className="text-sm text-destructive">
            {(errors[optionField] as { message?: string }).message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateValue && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateValue ? format(dateValue, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(d) =>
                d && setValue("date", d, { shouldValidate: true })
              }
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-destructive">
            {(errors.date as { message?: string }).message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add a note..."
          rows={3}
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">
            {(errors.notes as { message?: string }).message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
    </form>
  )
}
