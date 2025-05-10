import { CampaignOverview } from "@/components/campaigns/campaign-overview"
import { CampaignManagement } from "@/components/campaigns/campaign-management"
import { CampaignFilters } from "@/components/campaigns/campaign-filters"

export default function CampaignsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage fundraising campaigns and track progress through defined milestones
        </p>
      </div>

      <CampaignOverview />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Campaigns Management</h2>
        <CampaignFilters />
      </div>

      <CampaignManagement />
    </div>
  )
}
