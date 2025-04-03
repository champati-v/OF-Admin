import { Card, CardContent } from "@/components/ui/card"

interface UserCountsProps {
  total: number
  active: number
  blocked: number
  userType: string
}

export function UserCounts({ total, active, blocked, userType }: UserCountsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Total {userType}</span>
          <span className="text-2xl font-bold">{total}</span>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Active {userType}</span>
          <span className="text-2xl font-bold">{active}</span>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col">
          <span className="text-sm text-muted-foreground">Blocked {userType}</span>
          <span className="text-2xl font-bold">{blocked}</span>
        </CardContent>
      </Card>
    </div>
  )
}

