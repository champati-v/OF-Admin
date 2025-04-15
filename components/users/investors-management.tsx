"use client"

import { useEffect, useState } from "react"
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

// Define the Investor type based on API response
type Investor = {
  _id: string
  user_id: string
  username: string
  professionalTitle: string
  bio?: string
  location?: string
  email?: string
  role: string
  status: string
  completedStatus: boolean
  createdAt: string
  updatedAt: string
  profilePic?: {
    file_name: string
    file_url: string
  }
  founderData?: {
    skills: string[]
    socialLinks: Record<string, string>
    completedStatus: string
    watchList: any[]
    recentActivity: any[]
    experienceLevel?: string
  }
}

// Format for display in the table
type FormattedInvestor = {
  id: string
  name: string
  email: string
  joinedDate: string
  totalInvestments: number
  capitalDeployed: string
  portfolioValue: string
  status: string
  profilePic?: string
  location?: string
  bio?: string
  skills?: string[]
  socialLinks?: Record<string, string>
}

export function InvestorsManagement() {
  const [selectedInvestor, setSelectedInvestor] = useState<FormattedInvestor | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [investors, setInvestors] = useState<FormattedInvestor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://onlyfounders.azurewebsites.net/api/admin/profiles/Founder", {
          headers: {
            user_id: "62684",
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        // Format the data for display
        const formattedData = data.profiles.map((investor: Investor) => ({
          id: investor._id,
          name: investor.username || "Unknown",
          email: investor.user_id, // Using user_id as email since email is not provided
          joinedDate: investor.createdAt,
          totalInvestments: Math.floor(Math.random() * 10) + 1, // Random number for demo
          capitalDeployed: `$${(Math.floor(Math.random() * 900) + 100).toLocaleString()}k`, // Random amount for demo
          portfolioValue: `$${(Math.floor(Math.random() * 1200) + 100).toLocaleString()}k`, // Random amount for demo
          status: investor.status?.toLowerCase() || "unknown",
          profilePic: investor.profilePic?.file_url,
          location: investor.location,
          bio: investor.bio,
          skills: investor.founderData?.skills,
          socialLinks: investor.founderData?.socialLinks,
        }))

        setInvestors(formattedData)
      } catch (err) {
        console.error("Error fetching investors:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvestors()
  }, [])

  // Calculate counts
  const totalInvestors = investors.length
  const activeInvestors = investors.filter((i) => i.status === "verified").length
  const blockedInvestors = investors.filter((i) => i.status === "blocked" || i.status === "suspended").length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewProfile = (investor: FormattedInvestor) => {
    setSelectedInvestor(investor)
    setShowProfile(true)
  }

  const handleBlockUnblock = async (investor: FormattedInvestor) => {
    // In a real implementation, this would call an API to update the user's status
    try {
      // This is a placeholder for the actual API call
      console.log(`${investor.status === "verified" ? "Blocking" : "Unblocking"} ${investor.name}`)

      // Optimistic UI update
      setInvestors((prevInvestors) =>
        prevInvestors.map((inv) =>
          inv.id === investor.id ? { ...inv, status: inv.status === "verified" ? "blocked" : "verified" } : inv,
        ),
      )

      // If the selected investor is being blocked/unblocked, update that too
      if (selectedInvestor && selectedInvestor.id === investor.id) {
        setSelectedInvestor({
          ...selectedInvestor,
          status: selectedInvestor.status === "verified" ? "blocked" : "verified",
        })
      }

      // Here you would make the actual API call to update the status
      // const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/profiles/${investor.id}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'user_id': '62684'
      //   },
      //   body: JSON.stringify({
      //     status: investor.status === "verified" ? "blocked" : "verified"
      //   })
      // })

      // if (!response.ok) throw new Error('Failed to update status')
    } catch (err) {
      console.error("Error updating investor status:", err)
      // Revert the optimistic update if the API call fails
      // You would add error handling here
    }
  }

  // Add the new handler function
  const handleViewDashboard = (investor: FormattedInvestor) => {
    // In a real implementation, this would navigate to the investor's dashboard
    console.log(`Viewing dashboard for ${investor.name}`)
  }

  return (
    <>
      <UserCounts total={totalInvestors} active={activeInvestors} blocked={blockedInvestors} userType="Investors" />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2">Loading investors...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          <p>Error: {error}</p>
          <p className="mt-2">Please try again later or contact support.</p>
        </div>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Total Investments</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Professional Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No investors found
                  </TableCell>
                </TableRow>
              ) : (
                investors.map((investor) => (
                  <TableRow key={investor.id} className="border-t border-border">
                    <TableCell className="font-medium">{investor.name}</TableCell>
                    <TableCell>{investor.email}</TableCell>
                    <TableCell>{formatDate(investor.joinedDate)}</TableCell>
                    <TableCell>{investor.totalInvestments}</TableCell>
                    <TableCell>{investor.location}</TableCell>
                    <TableCell>{investor.professionalTitle}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          investor.status === "verified"
                            ? "outline"
                            : investor.status === "blocked" || investor.status === "suspended"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {investor.status}
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
                          <DropdownMenuItem onClick={() => handleViewProfile(investor)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDashboard(investor)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleBlockUnblock(investor)}
                            className={investor.status === "verified" ? "text-red-500" : "text-green-500"}
                          >
                            {investor.status === "verified" ? (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Investor Profile Dialog */}
      {selectedInvestor && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-[600px] border border-border">
            <DialogHeader>
              <DialogTitle>Investor Profile</DialogTitle>
              <DialogDescription>Investment history and details for {selectedInvestor.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedInvestor.profilePic && (
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full overflow-hidden">
                    <img
                      src={selectedInvestor.profilePic || "/placeholder.svg"}
                      alt={selectedInvestor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{selectedInvestor.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">User ID:</div>
                <div className="col-span-3">{selectedInvestor.email}</div>
              </div>
              {selectedInvestor.location && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Location:</div>
                  <div className="col-span-3">{selectedInvestor.location}</div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Joined:</div>
                <div className="col-span-3">{formatDate(selectedInvestor.joinedDate)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Investments:</div>
                <div className="col-span-3">{selectedInvestor.totalInvestments}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Capital Deployed:</div>
                <div className="col-span-3">{selectedInvestor.capitalDeployed}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Portfolio Value:</div>
                <div className="col-span-3">{selectedInvestor.portfolioValue}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={
                      selectedInvestor.status === "verified"
                        ? "outline"
                        : selectedInvestor.status === "blocked" || selectedInvestor.status === "suspended"
                          ? "destructive"
                          : "secondary"
                    }
                    className="capitalize"
                  >
                    {selectedInvestor.status}
                  </Badge>
                </div>
              </div>

              {selectedInvestor.bio && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">Bio:</div>
                  <div className="col-span-3">{selectedInvestor.bio}</div>
                </div>
              )}

              {selectedInvestor.skills && selectedInvestor.skills.length > 0 && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">Skills:</div>
                  <div className="col-span-3 flex flex-wrap gap-1">
                    {selectedInvestor.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="capitalize">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedInvestor.socialLinks && Object.keys(selectedInvestor.socialLinks).length > 0 && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">Social:</div>
                  <div className="col-span-3">
                    {Object.entries(selectedInvestor.socialLinks).map(([platform, url]) => (
                      <div key={platform} className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{platform}:</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate max-w-[250px]"
                        >
                          {url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Investment History</h3>
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead>Startup</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Current Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No investment history available
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {selectedInvestor.status === "verified" ? (
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleBlockUnblock(selectedInvestor)}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Block Investor
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                    onClick={() => handleBlockUnblock(selectedInvestor)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unblock Investor
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
