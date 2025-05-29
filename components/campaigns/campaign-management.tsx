"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
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
import {
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Mail,
} from "lucide-react"
import { Dialog, DialogPortal, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PaginationContent, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Update the Campaign type to include a fundraising end date
type Campaign = {
  id: string
  name: string
  founder: {
    id: string
    name: string
  }
  startup: {
    id: string
    name: string
    stage: string
  }
  createdDate: string
  campaign_id?: string // Added for API compatibility
  fundraisingEndDate: string // Renamed from endingDate to be more specific
  status: "Active" | "Completed" | "Pending" | "Rejected" // Removed "Failed" status
  approvalStatus?: "pending" | "approved" | "rejected"
  targetAmount: string
  raisedAmount: string
  milestoneCount: number
  completedMilestones: number
  isFeatured: boolean
  isTrending: boolean
  isBlocked: boolean
  pendingProofs: number
  description: string
  milestones: {
    title: string
    description: string
    targetDate: string
    status: "Completed" | "In Progress" | "Upcoming"
  }[]
}


// Update the export function to include the new metrics and tab structure
export function CampaignManagement() {
  const router = useRouter()
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 15

  const [showFeaturedAlert, setShowFeaturedAlert] = useState(false)
  const [campaignToFeature, setCampaignToFeature] = useState<Campaign | null>(null)
  const [showTrendingAlert, setShowTrendingAlert] = useState(false)
  const [campaignToTrend, setCampaignToTrend] = useState<Campaign | null>(null)
  const [showBlockAlert, setShowBlockAlert] = useState(false)
  const [campaignToBlock, setCampaignToBlock] = useState<Campaign | null>(null)

  // Add new state variables for approval functionality
  const [activeTab, setActiveTab] = useState<"pending" | "live" | "completed" | "rejected">("pending")
  const [showApproveAlert, setShowApproveAlert] = useState(false)
  const [campaignToApprove, setCampaignToApprove] = useState<Campaign | null>(null)

  // Replace the simple reject alert with a dialog for entering rejection reason
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [campaignToReject, setCampaignToReject] = useState<Campaign | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // Add state for milestone rejection
  const [showMilestoneRejectDialog, setShowMilestoneRejectDialog] = useState(false)
  const [milestoneToReject, setMilestoneToReject] = useState<{
    campaign: Campaign
    milestoneIndex: number
  } | null>(null)
  const [milestoneRejectionReason, setMilestoneRejectionReason] = useState("")

  // Add these state variables after the other state declarations in the CampaignManagement component
  const [isLoading, setIsLoading] = useState(false)
  const [apiCampaigns, setApiCampaigns] = useState<any[]>([])

  const campaignModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          campaignModalRef.current &&
          !campaignModalRef.current.contains(event.target as Node)
        ) {
          setShowDetails(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);


    const alertRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          alertRef.current &&
          !alertRef.current.contains(event.target as Node)
        ) {
          setShowFeaturedAlert(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const trendingAlertRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          trendingAlertRef.current &&
          !trendingAlertRef.current.contains(event.target as Node)
        ) {
          setShowTrendingAlert(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const blockAlertRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          blockAlertRef.current &&
          !blockAlertRef.current.contains(event.target as Node)
        ) {
          setShowBlockAlert(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const approveAlertRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          approveAlertRef.current &&
          !approveAlertRef.current.contains(event.target as Node)
        ) {
          setShowApproveAlert(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const rejectDialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          rejectDialogRef.current &&
          !rejectDialogRef.current.contains(event.target as Node)
        ) {
          setShowRejectDialog(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const milestoneRejectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          milestoneRejectRef.current &&
          !milestoneRejectRef.current.contains(event.target as Node)
        ) {
          setShowMilestoneRejectDialog(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);


  // Add this useEffect hook after the state declarations and before the useMemo hooks
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("https://ofstaging.azurewebsites.net/api/admin/get-campaign-details", {
          headers: {
            user_id: "62684",
          },
        })

        if (!response.ok) {
          throw new Error(`Error fetching campaign details: ${response.statusText}`)
        }

        const data = await response.json()
        setApiCampaigns(data)

        // Map API data to our Campaign type
        const mappedCampaigns = data.map((campaign: any) => ({
          id: campaign.campaign_id,
          name: campaign.campaignName,
          founder: {
            id: campaign.campaign_id.substring(0, 5),
            name: campaign.founderName,
          },
          startup: {
            id: campaign.campaign_id.substring(0, 5),
            name: campaign.startupName,
            stage: "N/A",
          },
          createdDate: campaign.createdDate,
          fundraisingEndDate: campaign.fundraisingEndDate || new Date().toISOString(),
          status: campaign.status as "Active" | "Completed" | "Pending",
          approvalStatus: "approved",
          targetAmount: `$${campaign.fundingTarget?.toLocaleString() || 0}`,
          raisedAmount: `$${campaign.totalRaisedOnPlatform?.toLocaleString() || 0}`,
          milestoneCount: campaign.totalMilestones || 0,
          completedMilestones: campaign.milestonesCompleted || 0,
          isFeatured: false,
          isTrending: false,
          isBlocked: false,
          pendingProofs: 0,
          description: `Campaign for ${campaign.startupName}`,
          milestones: Array(campaign.totalMilestones || 0)
            .fill(null)
            .map((_, i) => ({
              title: `Milestone ${i + 1}`,
              description: `Description for milestone ${i + 1}`,
              targetDate: campaign.fundraisingEndDate || new Date().toISOString(),
              status:
                i < (campaign.milestonesCompleted || 0)
                  ? "Completed"
                  : ("Upcoming" as "Completed" | "In Progress" | "Upcoming"),
            })),
        }))

        // Update allCampaigns with the API data
        setAllCampaigns([...mappedCampaigns])
      } catch (error) {
        console.error("Failed to fetch campaign details:", error)
        // Keep the mock data if API fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaignDetails()
  }, [campaignToApprove])

  // Update allCampaigns to include rejected campaigns
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([])

  // Filter campaigns based on approval status and completion status
  const pendingApprovalCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => campaign.status === "Pending")
  }, [allCampaigns])

  const liveCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => campaign.approvalStatus === "approved" && campaign.status === "Active")
  }, [allCampaigns])

  const completedCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => campaign.approvalStatus === "approved" && campaign.status === "Completed")
  }, [allCampaigns])

  const rejectedCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => campaign.approvalStatus === "approved" && campaign.status === "Rejected")
  }, [allCampaigns])

  // Get the current campaigns based on active tab
  const getCurrentCampaigns = () => {
    switch (activeTab) {
      case "pending":
        return pendingApprovalCampaigns
      case "live":
        return liveCampaigns
      case "completed":
        return completedCampaigns
      case "rejected":
       return rejectedCampaigns
      default:
        return pendingApprovalCampaigns
    }
  }

  // Calculate pagination for the active tab
  const currentCampaigns = getCurrentCampaigns().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewCampaign = () => {
    if (selectedCampaign) {
      window.open(`https://www.onlyfounders.xyz/campaign/campaigns/${selectedCampaign.id}`, "_blank");
    }
  }

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setShowDetails(true)
  }

  const handleToggleFeatured = (campaign: Campaign) => {
    setCampaignToFeature(campaign)
    setShowFeaturedAlert(true)
  }

  const confirmToggleFeatured = () => {
    if (campaignToFeature) {
      // In a real implementation, this would call an API to update the campaign's featured status
      console.log(`${campaignToFeature.isFeatured ? "Removing from" : "Adding to"} featured: ${campaignToFeature.name}`)
      setShowFeaturedAlert(false)
      setCampaignToFeature(null)
    }
  }

  const handleToggleTrending = (campaign: Campaign) => {
    setCampaignToTrend(campaign)
    setShowTrendingAlert(true)
  }

  const confirmToggleTrending = () => {
    if (campaignToTrend) {
      // In a real implementation, this would call an API to update the campaign's trending status
      console.log(`${campaignToTrend.isTrending ? "Removing from" : "Adding to"} trending: ${campaignToTrend.name}`)
      setShowTrendingAlert(false)
      setCampaignToTrend(null)
    }
  }

  const handleToggleBlocked = (campaign: Campaign) => {
    setCampaignToBlock(campaign)
    setShowBlockAlert(true)
  }

  const confirmToggleBlocked = () => {
    if (campaignToBlock) {
      // In a real implementation, this would call an API to update the campaign's blocked status
      console.log(`${campaignToBlock.isBlocked ? "Unblocking" : "Blocking"} campaign: ${campaignToBlock.name}`)
      setShowBlockAlert(false)
      setCampaignToBlock(null)
    }
  }

  // Add new handlers for approving and rejecting campaigns
  const handleApproveCampaign = async (campaign: Campaign) => {
    try {
      setIsLoading(true)
      const response = await fetch(`https://ofStaging.azurewebsites.net/api/admin/change-campaignStatus/${campaign.id}`,
        {
          method: "POST", // Add the missing method
          headers: {
            "Content-Type": "application/json",
            user_id: "62684",
          },
          body: JSON.stringify({ status: "Active" }),
        },
      )

      // Set the campaign to approve and show the alert
      setCampaignToApprove(campaign)

      // Update the campaign's approval status in the local state
      // setAllCampaigns(allCampaigns.map((c) => (c.id === campaign.id ? { ...c, approvalStatus: "approved" } : c)))

      // Show success toast
      toast({
        title: "Campaign Approved",
        description: "The campaign has been approved successfully!",
      })

    } catch (error) {
      console.error("Error approving campaign:", error)
      toast({
        title: "Error",
        description: "Error approving campaign. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmApproveCampaign = () => {
    if (campaignToApprove) {
      // Update the campaign's approval status
      setAllCampaigns(
        allCampaigns.map((c) => (c.id === campaignToApprove.id ? { ...c, approvalStatus: "approved" } : c)),
      )
      setShowApproveAlert(false)
      setCampaignToApprove(null)

      // Show success toast
      toast({
        title: "Campaign Approved",
        description: "The campaign has been approved and is now visible to investors.",
      })
    }
  }

  // Updated rejection handler to open the dialog for entering a reason
  const handleRejectCampaign = async (campaign: Campaign) => {
  try {
      setIsLoading(true)
      const response = await fetch(`https://ofStaging.azurewebsites.net/api/admin/change-campaignStatus/${campaign.id}`,
        {
          method: "POST", // Add the missing method
          headers: {
            "Content-Type": "application/json",
            user_id: "62684",
          },
          body: JSON.stringify({ status: "Rejected" }),
        },
      )

      // Set the campaign to approve and show the alert
      setCampaignToApprove(campaign)

      // Update the campaign's approval status in the local state
      // setAllCampaigns(allCampaigns.map((c) => (c.id === campaign.id ? { ...c, approvalStatus: "approved" } : c)))

      // Show success toast
      toast({
        title: "Campaign Approved",
        description: "The campaign has been approved successfully!",
      })

    } catch (error) {
      console.error("Error approving campaign:", error)
      toast({
        title: "Error",
        description: "Error approving campaign. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // New function to handle the rejection with reason
  const confirmRejectCampaign = () => {
    if (campaignToReject && rejectionReason.trim()) {
      // Update the campaign's approval status
      setAllCampaigns(
        allCampaigns.map((c) => (c.id === campaignToReject.id ? { ...c, approvalStatus: "rejected" } : c)),
      )

      // In a real implementation, this would send an email with the rejection reason
      console.log(`Campaign rejected: ${campaignToReject.name}. Reason: ${rejectionReason}`)
      console.log(`Email sent to ${campaignToReject.founder.name} at ${campaignToReject.founder.id}@example.com`)

      // Show success toast
      toast({
        title: "Campaign Rejected",
        description: "The campaign has been rejected and the founder has been notified.",
      })

      setShowRejectDialog(false)
      setCampaignToReject(null)
      setRejectionReason("")
    }
  }

  // Handler for milestone rejection
  const handleRejectMilestone = (campaign: Campaign, milestoneIndex: number) => {
    setMilestoneToReject({ campaign, milestoneIndex })
    setMilestoneRejectionReason("") // Clear previous reason
    setShowMilestoneRejectDialog(true)
  }

  // Confirm milestone rejection with reason
  const confirmRejectMilestone = () => {
    if (milestoneToReject && milestoneRejectionReason.trim()) {
      // In a real implementation, this would update the milestone status and send an email
      console.log(
        `Milestone rejected: ${milestoneToReject.campaign.milestones[milestoneToReject.milestoneIndex].title}`,
      )
      console.log(`Reason: ${milestoneRejectionReason}`)
      console.log(
        `Email sent to ${milestoneToReject.campaign.founder.name} at ${milestoneToReject.campaign.founder.id}@example.com`,
      )

      // Show success toast
      toast({
        title: "Milestone Proof Rejected",
        description: "The milestone proof has been rejected and the founder has been notified.",
      })

      setShowMilestoneRejectDialog(false)
      setMilestoneToReject(null)
      setMilestoneRejectionReason("")
    }
  }

  // Helper function to calculate progress percentage
  const calculateProgress = (raised: string, target: string) => {
    const raisedAmount = Number.parseInt(raised.replace(/[^0-9]/g, ""))
    const targetAmount = Number.parseInt(target.replace(/[^0-9]/g, ""))
    return Math.min(Math.round((raisedAmount / targetAmount) * 100), 100)
  }

  // Update the getStatusBadgeVariant function to use the new status names and colors
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "outline"
      case "Completed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Function to handle viewing pending proofs
  const handleViewPendingProofs = (campaign: Campaign) => {
    router.push(`/admin/dashboard/campaigns/${campaign.id}/investors?tab=milestones`)
  }

  return (
    <>
      {/* Campaign Metrics */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovalCampaigns.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Campaigns awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Fundraising</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveCampaigns.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Campaigns in fundraising period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Fundraising</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCampaigns.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Campaigns with ended fundraising</p>
          </CardContent>
        </Card>
      </div>

      {/* Updated tabs for campaign categories with new style */}
      <div className="mb-6">
        <div className="inline-flex p-1 bg-gray-50 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "pending" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("pending")
              setCurrentPage(1)
            }}
          >
            Pending Approval ({pendingApprovalCampaigns.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "live" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("live")
              setCurrentPage(1)
            }}
          >
            Active Fundraising ({liveCampaigns.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "completed" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("completed")
              setCurrentPage(1)
            }}
          >
            Completed Fundraising ({completedCampaigns.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "rejected" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("rejected")
              setCurrentPage(1)
            }}
          >
            Rejected Fundraising ({rejectedCampaigns.length})
          </button>
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Campaign Name</TableHead>
              <TableHead>Founder</TableHead>
              <TableHead>Startup</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Fundraising End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fundraising</TableHead>
              <TableHead>Milestones</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-primary" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading campaigns...
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {currentCampaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className={`border-t border-border ${campaign.pendingProofs > 0 ? "bg-amber-50" : ""}`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      {campaign.name}
                      {campaign.isFeatured && <Star className="h-4 w-4 text-primary ml-1" />}
                      {campaign.isTrending && <TrendingUp className="h-4 w-4 text-primary ml-1" />}
                      {campaign.pendingProofs > 0 && (
                        <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                          <Clock className="h-3 w-3 mr-1" />
                          {campaign.pendingProofs} Pending
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/dashboard/users?founder=${campaign.founder.id}`}
                      className="text-primary hover:underline"
                    >
                      {campaign.founder.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/dashboard/marketplace?startup=${campaign.startup.id}`}
                      className="text-primary hover:underline"
                    >
                      {campaign.startup.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{campaign.startup.stage}</div>
                  </TableCell>
                  <TableCell>{formatDate(campaign.createdDate)}</TableCell>
                  <TableCell>{campaign.fundraisingEndDate ? formatDate(campaign.fundraisingEndDate) : "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(campaign.status)} className="capitalize">
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {campaign.raisedAmount} / {campaign.targetAmount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {campaign.completedMilestones}/{campaign.milestoneCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-primary">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Show different options based on the active tab */}
                        {activeTab === "pending" ? (
                          <>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleApproveCampaign(campaign)}
                              className="text-green-500"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRejectCampaign(campaign)} className="text-red-500">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject Campaign
                            </DropdownMenuItem>
                          </>
                        ) : activeTab === 'rejected' ? (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApproveCampaign(campaign)}
                              className="text-green-500"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDetails(campaign)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/dashboard/campaigns/${campaign.id}/investors`)}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Investment
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem onClick={() => handleViewDetails(campaign)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/dashboard/campaigns/${campaign.id}/investors`)}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Investment
                            </DropdownMenuItem>

                            {campaign.pendingProofs > 0 && (
                              <DropdownMenuItem
                                onClick={() => handleViewPendingProofs(campaign)}
                                className="text-amber-600"
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Review {campaign.pendingProofs} Pending Proof{campaign.pendingProofs > 1 ? "s" : ""}
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {currentCampaigns.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {activeTab === "pending"
                      ? "No campaigns pending approval"
                      : activeTab === "live"
                        ? "No live campaigns found"
                        : "No completed campaigns found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Pagination */}
      <PaginationContent>
        <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        <PaginationNext
          href="#"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(getCurrentCampaigns().length / itemsPerPage)}
        />
      </PaginationContent>

      {/* Campaign Details Dialog */}
      {showDetails && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            ref={campaignModalRef}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-[700px] p-6 border border-border overflow-y-auto max-h-[90vh] relative"
          >
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-2">Campaign Details</h2>
            <p className="text-muted-foreground mb-4">
              Detailed information about {selectedCampaign.name}
            </p>

            <div className="grid gap-4">
              {/* Campaign Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Campaign:</div>
                <div className="col-span-3 flex items-center">
                  {selectedCampaign.name}
                  {selectedCampaign.isFeatured && (
                    <Star className="h-4 w-4 text-primary ml-2" />
                  )}
                  {selectedCampaign.isTrending && (
                    <TrendingUp className="h-4 w-4 text-primary ml-2" />
                  )}
                </div>
              </div>

              {/* Founder */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Founder:</div>
                <div className="col-span-3">
                  <Link
                    href={`/admin/dashboard/users?founder=${selectedCampaign.founder.id}`}
                    className="text-primary hover:underline"
                  >
                    {selectedCampaign.founder.name}
                  </Link>
                </div>
              </div>

              {/* Startup */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Startup:</div>
                <div className="col-span-3">
                  <Link
                    href={`/admin/dashboard/marketplace?startup=${selectedCampaign.startup.id}`}
                    className="text-primary hover:underline"
                  >
                    {selectedCampaign.startup.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {selectedCampaign.startup.stage}
                  </div>
                </div>
              </div>

              {/* Created and Fundraising Dates */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Created Date:</div>
                <div className="col-span-3">{formatDate(selectedCampaign.createdDate)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Fundraising End Date:</div>
                <div className="col-span-3">{formatDate(selectedCampaign.fundraisingEndDate)}</div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={getStatusBadgeVariant(selectedCampaign.status)}
                    className="capitalize"
                  >
                    {selectedCampaign.status}
                  </Badge>
                </div>
              </div>

              {/* Fundraising */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Fundraising:</div>
                <div className="col-span-3">
                  {selectedCampaign.raisedAmount} / {selectedCampaign.targetAmount} (
                  {calculateProgress(
                    selectedCampaign.raisedAmount,
                    selectedCampaign.targetAmount
                  )}
                  %)
                </div>
              </div>

              {/* Milestones Count */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Milestones:</div>
                <div className="col-span-3">
                  {selectedCampaign.completedMilestones}/{selectedCampaign.milestoneCount} completed
                  {selectedCampaign.pendingProofs > 0 && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-amber-100 text-amber-800 border-amber-200"
                    >
                      {selectedCampaign.pendingProofs} Pending Proof
                      {selectedCampaign.pendingProofs > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Description:</div>
                <div className="col-span-3">{selectedCampaign.description}</div>
              </div>

              <button className="bg-blue-500 px-2 py-1 text-white cursor-pointer rounded-md" onClick={() => handleViewCampaign()} >View Campaign</button>
            </div>
          </div>
        </div>
      )}


      {/* Featured Confirmation Dialog */}
      {showFeaturedAlert && campaignToFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            ref={alertRef}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 border border-border relative"
          >
            <button
              onClick={() => setShowFeaturedAlert(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-2">
              {campaignToFeature.isFeatured ? "Remove from Featured" : "Add to Featured"}
            </h2>

            <p className="text-muted-foreground mb-4">
              {campaignToFeature.isFeatured
                ? "Are you sure you want to remove this campaign from featured? It will no longer appear in the featured section."
                : "Are you sure you want to add this campaign to featured? It will appear in the featured section."}
            </p>

            <div className="mt-2 p-3 bg-muted rounded-md text-sm space-y-1">
              <div className="font-medium">Campaign: {campaignToFeature.name}</div>
              <div className="font-medium">Startup: {campaignToFeature.startup.name}</div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowFeaturedAlert(false)}
                className="px-4 py-2 rounded-md text-sm bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleFeatured}
                className="px-4 py-2 rounded-md text-sm bg-primary text-white hover:bg-primary/90"
              >
                {campaignToFeature.isFeatured ? "Remove from Featured" : "Add to Featured"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Trending Confirmation Dialog */}
      {showTrendingAlert && campaignToTrend && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          ref={trendingAlertRef}
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 border border-border relative"
        >
          <button
            onClick={() => setShowTrendingAlert(false)}
            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
          >
            ✕
          </button>

          <h2 className="text-xl font-semibold mb-2">
            {campaignToTrend.isTrending ? "Remove from Trending" : "Add to Trending"}
          </h2>

          <p className="text-muted-foreground mb-4">
            {campaignToTrend.isTrending
              ? "Are you sure you want to remove this campaign from trending? It will no longer appear in the trending section."
              : "Are you sure you want to add this campaign to trending? It will appear in the trending section."}
          </p>

          <div className="mt-2 p-3 bg-muted rounded-md text-sm space-y-1">
            <div className="font-medium">Campaign: {campaignToTrend.name}</div>
            <div className="font-medium">Startup: {campaignToTrend.startup.name}</div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setShowTrendingAlert(false)}
              className="px-4 py-2 rounded-md text-sm bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmToggleTrending}
              className="px-4 py-2 rounded-md text-sm bg-primary text-white hover:bg-primary/90"
            >
              {campaignToTrend.isTrending ? "Remove from Trending" : "Add to Trending"}
            </button>
          </div>
        </div>
      </div>
      )}


      {/* Block/Unblock Confirmation Dialog */}
      {showBlockAlert && campaignToBlock && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      ref={blockAlertRef}
      className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 border border-border relative"
    >
      <button
        onClick={() => setShowBlockAlert(false)}
        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-2">
        {campaignToBlock.isBlocked ? "Unblock Campaign" : "Block Campaign"}
      </h2>

      <p className="text-muted-foreground mb-4">
        {campaignToBlock.isBlocked
          ? "Are you sure you want to unblock this campaign? It will be visible on the platform again."
          : "Are you sure you want to block this campaign? It will be hidden from the platform."}
      </p>

      <div className="mt-2 p-3 bg-muted rounded-md text-sm space-y-1">
        <div className="font-medium">Campaign: {campaignToBlock.name}</div>
        <div className="font-medium">Startup: {campaignToBlock.startup.name}</div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => setShowBlockAlert(false)}
          className="px-4 py-2 rounded-md text-sm bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600"
        >
          Cancel
        </button>
        <button
          onClick={confirmToggleBlocked}
          className={`px-4 py-2 rounded-md text-sm text-white ${
            campaignToBlock.isBlocked
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {campaignToBlock.isBlocked ? "Unblock" : "Block"}
        </button>
      </div>
    </div>
  </div>
      )}


      {/* Approve Campaign Confirmation Dialog */}
      {showApproveAlert && campaignToApprove && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      ref={approveAlertRef}
      className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 border border-border relative"
    >
      <button
        onClick={() => setShowApproveAlert(false)}
        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-2">Approve Campaign</h2>

      <p className="text-muted-foreground mb-4">
        Are you sure you want to approve this campaign? Once approved, it will be visible to investors on the
        platform.
      </p>

      <div className="mt-2 p-3 bg-muted rounded-md text-sm space-y-1">
        <div className="font-medium">Campaign: {campaignToApprove.name}</div>
        <div className="font-medium">Startup: {campaignToApprove.startup.name}</div>
        <div className="font-medium">Target: {campaignToApprove.targetAmount}</div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => setShowApproveAlert(false)}
          className="px-4 py-2 rounded-md text-sm bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600"
        >
          Cancel
        </button>
        <button
          onClick={confirmApproveCampaign}
          className="px-4 py-2 rounded-md text-sm bg-green-500 hover:bg-green-600 text-white"
        >
          Approve Campaign
        </button>
      </div>
    </div>
  </div>
      )}


      {/* Campaign Rejection Dialog with Reason */}
      {showRejectDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      ref={rejectDialogRef}
      className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 border border-border overflow-y-auto max-h-[90vh] relative"
    >
      <button
        onClick={() => setShowRejectDialog(false)}
        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-2">Reject Campaign</h2>
      <p className="text-muted-foreground mb-4">
        Please provide a reason for rejecting this campaign. This will be sent to the founder via email.
      </p>

      {campaignToReject && (
        <div className="mb-4 p-3 bg-muted rounded-md text-sm space-y-1">
          <div className="font-medium">Campaign: {campaignToReject.name}</div>
          <div className="font-medium">Founder: {campaignToReject.founder.name}</div>
          <div className="font-medium">Startup: {campaignToReject.startup.name}</div>
        </div>
      )}

      <div className="grid gap-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor="rejection-reason">Rejection Reason</Label>
          <Textarea
            id="rejection-reason"
            placeholder="Please explain why this campaign is being rejected..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setShowRejectDialog(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={confirmRejectCampaign}
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={!rejectionReason.trim()}
        >
          <Mail className="mr-2 h-4 w-4" />
          Reject & Send Email
        </Button>
      </div>
    </div>
  </div>
      )}


      {/* Milestone Rejection Dialog with Reason */}
      {showMilestoneRejectDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      ref={milestoneRejectRef}
      className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 border border-border overflow-y-auto max-h-[90vh] relative"
    >
      <button
        onClick={() => setShowMilestoneRejectDialog(false)}
        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-2">Reject Milestone Proof</h2>
      <p className="text-muted-foreground mb-4">
        Please provide a reason for rejecting this milestone proof. This will be sent to the founder via email.
      </p>

      {/* Optional campaign/founder info if needed */}
      {/* {milestoneToReject && (
        <div className="mb-4 p-3 bg-muted rounded-md text-sm space-y-1">
          <div className="font-medium">Campaign: {milestoneToReject.name}</div>
          <div className="font-medium">Founder: {milestoneToReject.founder.name}</div>
          <div className="font-medium">Startup: {milestoneToReject.startup.name}</div>
        </div>
      )} */}

      <div className="grid gap-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor="rejection-reason">Rejection Reason</Label>
          <Textarea
            id="rejection-reason"
            placeholder="Please explain why this campaign is being rejected..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setShowMilestoneRejectDialog(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={confirmRejectCampaign}
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={!rejectionReason.trim()}
        >
          <Mail className="mr-2 h-4 w-4" />
          Reject & Send Email
        </Button>
      </div>
    </div>
  </div>
      )}

    </>
  )
}
