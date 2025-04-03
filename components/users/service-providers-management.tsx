"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Ban, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserCounts } from "./user-counts"

// Define the ServiceProvider type
type ServiceProvider = {
  id: string
  name: string
  email: string
  joinedDate: string
  status: "active" | "blocked"
}

// Mock data for service providers
const serviceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Jennifer Adams",
    email: "jennifer@example.com",
    joinedDate: "2023-01-25",
    status: "active",
  },
  {
    id: "2",
    name: "Thomas Wilson",
    email: "thomas@example.com",
    joinedDate: "2023-02-10",
    status: "active",
  },
  {
    id: "3",
    name: "Patricia Moore",
    email: "patricia@example.com",
    joinedDate: "2023-03-15",
    status: "blocked",
  },
  {
    id: "4",
    name: "Richard Taylor",
    email: "richard@example.com",
    joinedDate: "2023-04-12",
    status: "active",
  },
  {
    id: "5",
    name: "Barbara Martin",
    email: "barbara@example.com",
    joinedDate: "2023-05-20",
    status: "active",
  },
]

export function ServiceProvidersManagement() {
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  // Calculate counts
  const totalProviders = serviceProviders.length
  const activeProviders = serviceProviders.filter((p) => p.status === "active").length
  const blockedProviders = serviceProviders.filter((p) => p.status === "blocked").length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewProfile = (provider: ServiceProvider) => {
    setSelectedProvider(provider)
    setShowProfile(true)
  }

  const handleBlockUnblock = (provider: ServiceProvider) => {
    // In a real implementation, this would call an API to update the user's status
    console.log(`${provider.status === "active" ? "Blocking" : "Unblocking"} ${provider.name}`)
  }

  return (
    <>
      <UserCounts
        total={totalProviders}
        active={activeProviders}
        blocked={blockedProviders}
        userType="Service Providers"
      />

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceProviders.map((provider) => (
              <TableRow key={provider.id} className="border-t border-border">
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>{formatDate(provider.joinedDate)}</TableCell>
                <TableCell>
                  <Badge variant={provider.status === "active" ? "outline" : "destructive"} className="capitalize">
                    {provider.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-primary">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewProfile(provider)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleBlockUnblock(provider)}
                        className={provider.status === "active" ? "text-red-500" : "text-green-500"}
                      >
                        {provider.status === "active" ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Block
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unblock
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Service Provider Profile Dialog */}
      {selectedProvider && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-[600px] border border-border">
            <DialogHeader>
              <DialogTitle>Service Provider Profile</DialogTitle>
              <DialogDescription>Profile details for {selectedProvider.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{selectedProvider.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3">{selectedProvider.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Joined:</div>
                <div className="col-span-3">{formatDate(selectedProvider.joinedDate)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={selectedProvider.status === "active" ? "outline" : "destructive"}
                    className="capitalize"
                  >
                    {selectedProvider.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Service Details</h3>
                <div className="rounded-md border border-border p-4">
                  <p className="text-muted-foreground">
                    This service provider has not registered any specific services yet.
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-lg font-medium mb-2">Engagement History</h3>
                <div className="rounded-md border border-border p-4">
                  <p className="text-muted-foreground">No engagement history available.</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {selectedProvider.status === "active" ? (
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleBlockUnblock(selectedProvider)}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Block Provider
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                    onClick={() => handleBlockUnblock(selectedProvider)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unblock Provider
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

