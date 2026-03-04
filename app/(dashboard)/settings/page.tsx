"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { toast } from "sonner"
import { Download, LogOut, FileDown } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [exportLoading, setExportLoading] = useState(false)

  async function handleExport(type: string) {
    setExportLoading(true)
    try {
      const res = await fetch(`/api/export?type=${type}`)
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fintrackr-${type}-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Export downloaded successfully")
    } catch {
      toast.error("Failed to export data")
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and export data"
      />
      <div className="flex flex-col gap-6 px-6 py-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="font-medium">{session?.user?.name || "Not set"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="font-medium">{session?.user?.email || "Not set"}</p>
            </div>
            <Separator />
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-fit"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>
              Download your financial data as CSV files for backup or analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => handleExport("all")}
                disabled={exportLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("income")}
                disabled={exportLoading}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Income Only
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("expenses")}
                disabled={exportLoading}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Expenses Only
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
