import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to OnlyFounders Admin</h1>
        <p className="text-muted-foreground">Select a section from the navigation to get started</p>
        <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
        {/* <Button asChild>
          <Link href="/admin/dashboard/users">Manage Users</Link>
        </Button> */}
        {/* <Button asChild>
          <Link href="/admin/dashboard/early-access">Manage Early Access</Link>
        </Button> */}
        {/* <Button asChild>
          <Link href="/admin/dashboard/marketplace">Manage Marketplace</Link>
        </Button> */}
        <Button asChild>
          <Link href="/admin/dashboard/blog">Manage Blogs</Link>
        </Button>
        {/* <Button asChild>
          <Link href="/admin">Manage Campaigns</Link>
        </Button> */}
        </div>
      </div>
    </div>
  )
}

