'use client'

import { EarlyAccessOverview } from "@/components/early-access/early-access-overview"
import { EarlyAccessEntries } from "@/components/early-access/early-access-entries"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EarlyAccessPage() {
  const router = useRouter()
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Early Access Management</h1>
          <p className="text-muted-foreground mt-2">Review and manage early access requests from potential users</p>
        </div>

        <Button onClick={() => router.push('/admin/dashboard')} className="cursor-pointer">
           <ArrowLeft className="w-4 h-4"/>
            Back
        </Button>
      </div>

      <EarlyAccessOverview />

      <div>
        <h2 className="text-xl font-semibold mb-4">Early Access Entries</h2>
        <EarlyAccessEntries />
      </div>
    </div>
  )
}

