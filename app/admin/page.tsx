import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">OnlyFounders Admin</h1>
        <p className="text-muted-foreground">Manage your platform with ease</p>
        <Button asChild>
          <Link href="/admin/dashboard/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

