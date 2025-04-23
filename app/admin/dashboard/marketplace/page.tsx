'use client'

import { MarketplaceOverview } from "@/components/marketplace/marketplace-overview"
import { StartupManagement } from "@/components/marketplace/startup-management"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MarketplacePage() {
  const router = useRouter()
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace Management</h1>
        <p className="text-muted-foreground mt-2">Manage all startups and their verification status on the platform</p>
        </div>

        <Button onClick={() => router.push('/admin/dashboard')} className="cursor-pointer">
           <ArrowLeft className="w-4 h-4"/>
            Back
        </Button>
      </div>

      <MarketplaceOverview />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Startup Management</h2>
        <MarketplaceFilters />
      </div>

      <StartupManagement />
    </div>
  )
}

