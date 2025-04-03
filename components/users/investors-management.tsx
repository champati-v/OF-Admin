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

// Define the Investor type
type Investor = {
  id: string
  name: string
  email: string
  joinedDate: string
  totalInvestments: number
  capitalDeployed: string
  portfolioValue: string
  status: "active" | "blocked"
}

// Mock data for investors
const investors: Investor[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    joinedDate: "2023-01-10",
    totalInvestments: 8,
    capitalDeployed: "$450,000",
    portfolioValue: "$520,000",
    status: "active",
  },
  {
    id: "2",
    name: "Emma Johnson",
    email: "emma@example.com",
    joinedDate: "2023-02-15",
    totalInvestments: 5,
    capitalDeployed: "$300,000",
    portfolioValue: "$380,000",
    status: "active",
  },
  {
    id: "3",
    name: "Robert Davis",
    email: "robert@example.com",
    joinedDate: "2023-03-05",
    totalInvestments: 12,
    capitalDeployed: "$750,000",
    portfolioValue: "$900,000",
    status: "active",
  },
  {
    id: "4",
    name: "Lisa Wilson",
    email: "lisa@example.com",
    joinedDate: "2023-04-20",
    totalInvestments: 3,
    capitalDeployed: "$120,000",
    portfolioValue: "$110,000",
    status: "blocked",
  },
  {
    id: "5",
    name: "Mark Thompson",
    email: "mark@example.com",
    joinedDate: "2023-05-08",
    totalInvestments: 7,
    capitalDeployed: "$350,000",
    portfolioValue: "$420,000",
    status: "active",
  },
]


export function InvestorsManagement() {
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [investor, setInvestor] = useState<Investor[]>([])

  // Calculate counts
  const totalInvestors = investors.length
  const activeInvestors = investors.filter((i) => i.status === "active").length
  const blockedInvestors = investors.filter((i) => i.status === "blocked").length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewProfile = (investor: Investor) => {
    setSelectedInvestor(investor)
    setShowProfile(true)
  }

  const handleBlockUnblock = (investor: Investor) => {
    // In a real implementation, this would call an API to update the user's status
    console.log(`${investor.status === "active" ? "Blocking" : "Unblocking"} ${investor.name}`)
  }

  // Add the new handler function
  const handleViewDashboard = (investor: Investor) => {
    // In a real implementation, this would navigate to the investor's dashboard
    console.log(`Viewing dashboard for ${investor.name}`)
  }

  return (
    <>
      <UserCounts total={totalInvestors} active={activeInvestors} blocked={blockedInvestors} userType="Investors" />

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Total Investments</TableHead>
              <TableHead>Capital Deployed</TableHead>
              <TableHead>Portfolio Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investors.map((investor) => (
              <TableRow key={investor.id} className="border-t border-border">
                <TableCell className="font-medium">{investor.name}</TableCell>
                <TableCell>{investor.email}</TableCell>
                <TableCell>{formatDate(investor.joinedDate)}</TableCell>
                <TableCell>{investor.totalInvestments}</TableCell>
                <TableCell>{investor.capitalDeployed}</TableCell>
                <TableCell>{investor.portfolioValue}</TableCell>
                <TableCell>
                  <Badge variant={investor.status === "active" ? "outline" : "destructive"} className="capitalize">
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
                        className={investor.status === "active" ? "text-red-500" : "text-green-500"}
                      >
                        {investor.status === "active" ? (
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

      {/* Investor Profile Dialog */}
      {selectedInvestor && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-[600px] border border-border">
            <DialogHeader>
              <DialogTitle>Investor Profile</DialogTitle>
              <DialogDescription>Investment history and details for {selectedInvestor.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{selectedInvestor.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3">{selectedInvestor.email}</div>
              </div>
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
                    variant={selectedInvestor.status === "active" ? "outline" : "destructive"}
                    className="capitalize"
                  >
                    {selectedInvestor.status}
                  </Badge>
                </div>
              </div>

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
                        <TableCell>TechInnovate</TableCell>
                        <TableCell>Jan 15, 2023</TableCell>
                        <TableCell>$75,000</TableCell>
                        <TableCell>$90,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>GreenSolutions</TableCell>
                        <TableCell>Mar 22, 2023</TableCell>
                        <TableCell>$120,000</TableCell>
                        <TableCell>$150,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>HealthAI</TableCell>
                        <TableCell>May 10, 2023</TableCell>
                        <TableCell>$50,000</TableCell>
                        <TableCell>$65,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {selectedInvestor.status === "active" ? (
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

