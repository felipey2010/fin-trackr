"use client"

import { DashboardHeader } from "@/components/layout/dashboard-header"

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <>
      <DashboardHeader title={title} />
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-balance">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </>
  )
}
