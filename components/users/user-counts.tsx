import { Card, CardContent } from "@/components/ui/card"

interface UserCountsProps {
  total: number
  verified: number
  blocked: number
  suspended: number
  unverified: number
  userType: string
}

export function UserCounts({ total, verified, blocked, suspended, unverified, userType }: UserCountsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Total {userType}</span>
          <span className="text-2xl font-bold">{total}</span>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Verified {userType}</span>
          <span className="text-2xl font-bold">{verified}</span>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Blocked {userType}</span>
          <span className="text-2xl font-bold">{blocked}</span>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Suspended {userType}</span>
          <span className="text-2xl font-bold">{suspended}</span>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Unverified {userType}</span>
          <span className="text-2xl font-bold">{unverified}</span>
        </CardContent>
      </Card>
    </div>
  )
}

