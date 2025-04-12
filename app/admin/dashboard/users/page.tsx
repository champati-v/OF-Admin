import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersOverview } from "@/components/users/user-overview"
import { FoundersManagement } from "@/components/users/founders-management"
import { InvestorsManagement } from "@/components/users/investors-management"
import { ServiceProvidersManagement } from "@/components/users/service-providers-management"
import {AllUsersManagement} from "@/components/users/all-user-management"
import { UserFilters } from "@/components/users/user-filters"

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground mt-2">Manage all user types—Founders, Investors, and Service Providers</p>
      </div>

      <UsersOverview />

      <Tabs defaultValue="founders" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="founders" className="data-[state=active]:bg-background">
              Founders
            </TabsTrigger>
            <TabsTrigger value="investors" className="data-[state=active]:bg-background">
              Investors
            </TabsTrigger>
            <TabsTrigger value="service-providers" className="data-[state=active]:bg-background">
              Service Providers
            </TabsTrigger>
            <TabsTrigger value="all-users" className="data-[state=active]:bg-background">
              All Users
            </TabsTrigger>
          </TabsList>
          <UserFilters />
        </div>


        <TabsContent value="founders" className="mt-0">
          <FoundersManagement />
        </TabsContent>

        <TabsContent value="investors" className="mt-0">
          <InvestorsManagement />
        </TabsContent>

        <TabsContent value="service-providers" className="mt-0">
          <ServiceProvidersManagement />
        </TabsContent>

        <TabsContent value="all-users" className="mt-0">
          <AllUsersManagement />
        </TabsContent>

      </Tabs>
    </div>
  )
}

