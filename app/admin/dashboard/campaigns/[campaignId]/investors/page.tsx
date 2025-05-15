import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CampaignInvestors } from "@/components/campaigns/campaign-investors"

export default async function CampaignInvestorsPage({
  params,
}: {
  params: { campaignId: string }
}) {

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="h-8 gap-1">
            <Link href="/admin/dashboard/campaigns">
              <ArrowLeft className="h-4 w-4" />
              Back to Campaigns
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Campaign Investors</h1>
        <p className="text-muted-foreground">
          Manage investments and milestones for this campaign
        </p>
      </div>

      <CampaignInvestors campaignId={params.campaignId} />
    </div>
  )
}
