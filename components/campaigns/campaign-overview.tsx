"use client"

import { useEffect, useState } from "react"
import { BarChart3, CheckCircle, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the type for our analytics data
interface CampaignAnalytics {
  totalCampaigns: number
  totalFundsRaised: number
  activeCampaigns: number
  completedCampaigns: number
}

export function CampaignOverview() {
  // State for analytics data, loading state, and error handling
  const [analytics, setAnalytics] = useState<CampaignAnalytics>({
    totalCampaigns: 0,
    totalFundsRaised: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://ofstaging.azurewebsites.net/api/admin/get-campaign-analytics", {
          headers: {
           user_id:"62684" // Note: This header seems incomplete, you may need to adjust
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        setAnalytics(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
        setError("Failed to load campaign analytics. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Manage fundraising campaigns and track progress through defined milestones
      </h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{analytics.totalCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">All campaigns created on the platform</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funds Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(analytics.totalFundsRaised)}</div>
                <p className="text-xs text-muted-foreground mt-1">Combined funds raised across all campaigns</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{analytics.activeCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently live fundraising campaigns</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Campaigns</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{analytics.completedCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">Successfully completed campaigns</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
