"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, BadgeCheck, Star, TrendingUp, Users, Loader } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"

type AnalyticsData = {
  message: string
  users: {
    total: number
    founders: number
    investors: number
    serviceProviders: number
  }
  startups: {
    total: number
    verified: number
    featured: number
    trending: number
  }
  engagement: {
    updates: number
    comments: number
  }
}

export function MarketplaceOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://onlyfounders.azurewebsites.net/api/admin/get-analytics", {
          headers: {
            user_id: "62684",
          },
        })

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch analytics data")
        console.log("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertDescription>Error loading analytics: {error}</AlertDescription>
  //     </Alert>
  //   )
  // }

  if (!data) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
          <Building className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.startups.total}</div>
          <p className="text-xs text-muted-foreground">Startups registered on the platform</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified Startups</CardTitle>
          <BadgeCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.startups.verified}</div>
          <p className="text-xs text-muted-foreground">Startups that have been verified</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Featured Startups</CardTitle>
          <Star className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.startups.featured}</div>
          <p className="text-xs text-muted-foreground">Startups featured on the platform</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trending Startups</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.startups.trending}</div>
          <p className="text-xs text-muted-foreground">Startups marked as trending</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.users.total}</div>
          <p className="text-xs text-muted-foreground">Total users on the platform</p>
        </CardContent>
      </Card>
    </div>
  )
}

