import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to OnlyFounders Admin</h1>
        <p className="text-muted-foreground">Select a section from the navigation to get started</p>
        <Button asChild>
          <Link href="/dashboard/users">Manage Users</Link>
        </Button>
      </div>
    </div>
  )
}

