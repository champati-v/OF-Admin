import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, BadgeCheck, Ban, TrendingUp, Star } from "lucide-react"

export function MarketplaceOverview() {
  // This would be fetched from your API in a real implementation
  const stats = {
    totalStartups: 87,
    verifiedStartups: 62,
    blockedStartups: 5,
    featuredStartups: 12,
    trendingStartups: 8,
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
          <Building className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStartups}</div>
          <p className="text-xs text-muted-foreground">Startups registered on the platform</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified Startups</CardTitle>
          <BadgeCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.verifiedStartups}</div>
          <p className="text-xs text-muted-foreground">Startups that have been verified</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Featured Startups</CardTitle>
          <Star className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.featuredStartups}</div>
          <p className="text-xs text-muted-foreground">Startups featured on the platform</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trending Startups</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.trendingStartups}</div>
          <p className="text-xs text-muted-foreground">Startups marked as trending</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blocked Startups</CardTitle>
          <Ban className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.blockedStartups}</div>
          <p className="text-xs text-muted-foreground">Startups that have been blocked</p>
        </CardContent>
      </Card>
    </div>
  )
}

