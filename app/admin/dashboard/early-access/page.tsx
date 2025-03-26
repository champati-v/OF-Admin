import { EarlyAccessOverview } from "@/components/early-access/early-access-overview"
import { EarlyAccessEntries } from "@/components/early-access/early-access-entries"

export default function EarlyAccessPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Early Access Management</h1>
        <p className="text-muted-foreground mt-2">Review and manage early access requests from potential users</p>
      </div>

      <EarlyAccessOverview />

      <div>
        <h2 className="text-xl font-semibold mb-4">Early Access Entries</h2>
        <EarlyAccessEntries />
      </div>
    </div>
  )
}

