"use client"

import { useState, useMemo } from "react"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogPortal, DialogTitle } from "@/components/ui/dialog"
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
  fundraisingEndDate: string // Renamed from endingDate to be more specific
  status: "Active" | "Completed" // Removed "Failed" status
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

// Mock data for pending campaigns
const pendingCampaigns: Campaign[] = [
  {
    id: "pending-1",
    name: "AI Startup Funding",
    founder: {
      id: "7",
      name: "Alice Smith",
    },
    startup: {
      id: "6",
      name: "AIInnovations",
      stage: "Seed",
    },
    createdDate: "2024-01-20",
    fundraisingEndDate: "2024-07-20",
    status: "Active",
    approvalStatus: "pending",
    targetAmount: "$750,000",
    raisedAmount: "$50,000",
    milestoneCount: 7,
    completedMilestones: 0,
    isFeatured: false,
    isTrending: true,
    isBlocked: false,
    pendingProofs: 0,
    description: "Seeking funding to develop advanced AI solutions for business automation.",
    milestones: [
      {
        title: "Team Expansion",
        description: "Hire key AI specialists and software engineers.",
        targetDate: "2024-03-01",
        status: "Upcoming",
      },
      {
        title: "Algorithm Development",
        description: "Develop core AI algorithms for automation platform.",
        targetDate: "2024-04-15",
        status: "Upcoming",
      },
      {
        title: "Beta Testing",
        description: "Conduct beta testing with select clients.",
        targetDate: "2024-05-30",
        status: "Upcoming",
      },
      {
        title: "Platform Launch",
        description: "Officially launch the AI automation platform.",
        targetDate: "2024-07-20",
        status: "Upcoming",
      },
      {
        title: "Customer Acquisition",
        description: "Acquire first 100 paying customers.",
        targetDate: "2024-08-15",
        status: "Upcoming",
      },
      {
        title: "Revenue Milestone",
        description: "Achieve $50K monthly recurring revenue.",
        targetDate: "2024-09-30",
        status: "Upcoming",
      },
      {
        title: "Series A Funding",
        description: "Prepare for Series A funding round.",
        targetDate: "2024-10-15",
        status: "Upcoming",
      },
    ],
  },
  {
    id: "pending-2",
    name: "Sustainable Energy Project",
    founder: {
      id: "8",
      name: "Bob Johnson",
    },
    startup: {
      id: "7",
      name: "EcoPower",
      stage: "Pre-seed",
    },
    createdDate: "2024-02-01",
    fundraisingEndDate: "2024-08-01",
    status: "Active",
    approvalStatus: "pending",
    targetAmount: "$400,000",
    raisedAmount: "$20,000",
    milestoneCount: 6,
    completedMilestones: 0,
    isFeatured: false,
    isTrending: false,
    isBlocked: false,
    pendingProofs: 0,
    description: "Seeking funds for a sustainable energy project focused on solar power solutions.",
    milestones: [
      {
        title: "Land Acquisition",
        description: "Acquire land for solar panel installation.",
        targetDate: "2024-03-15",
        status: "Upcoming",
      },
      {
        title: "Panel Installation",
        description: "Install solar panels and energy storage systems.",
        targetDate: "2024-05-01",
        status: "Upcoming",
      },
      {
        title: "Grid Connection",
        description: "Connect solar power system to the electrical grid.",
        targetDate: "2024-06-15",
        status: "Upcoming",
      },
      {
        title: "Energy Production",
        description: "Start producing and distributing solar energy.",
        targetDate: "2024-07-01",
        status: "Upcoming",
      },
      {
        title: "Community Outreach",
        description: "Engage with the local community to promote sustainable energy.",
        targetDate: "2024-07-15",
        status: "Upcoming",
      },
      {
        title: "Expansion Planning",
        description: "Plan for expansion to additional locations.",
        targetDate: "2024-08-01",
        status: "Upcoming",
      },
    ],
  },
]

// Add some rejected campaigns to the mock data
const rejectedCampaigns: Campaign[] = [
  {
    id: "rejected-1",
    name: "CryptoTrading Platform",
    founder: {
      id: "10",
      name: "Brittany Hall",
    },
    startup: {
      id: "9",
      name: "CryptoTrade",
      stage: "Ideation",
    },
    createdDate: "2023-09-05",
    fundraisingEndDate: "2024-03-05",
    status: "Active",
    approvalStatus: "rejected",
    targetAmount: "$500,000",
    raisedAmount: "$0",
    milestoneCount: 6,
    completedMilestones: 0,
    isFeatured: false,
    isTrending: false,
    isBlocked: false,
    pendingProofs: 0,
    description: "Building a decentralized cryptocurrency trading platform with low fees",
    milestones: [
      {
        title: "Platform Design",
        description: "Complete platform design and architecture",
        targetDate: "2023-11-05",
        status: "Upcoming",
      },
      {
        title: "MVP Development",
        description: "Develop minimum viable product",
        targetDate: "2024-01-05",
        status: "Upcoming",
      },
      {
        title: "Security Audit",
        description: "Complete third-party security audit",
        targetDate: "2024-02-05",
        status: "Upcoming",
      },
      {
        title: "Beta Launch",
        description: "Launch beta version to early users",
        targetDate: "2024-03-05",
        status: "Upcoming",
      },
      {
        title: "Marketing Campaign",
        description: "Launch marketing campaign",
        targetDate: "2024-04-05",
        status: "Upcoming",
      },
      {
        title: "Public Launch",
        description: "Full public launch of the platform",
        targetDate: "2024-05-05",
        status: "Upcoming",
      },
    ],
  },
  {
    id: "rejected-2",
    name: "VR Education Platform",
    founder: {
      id: "11",
      name: "Justin Clark",
    },
    startup: {
      id: "10",
      name: "EduVR",
      stage: "Prototype",
    },
    createdDate: "2023-10-15",
    fundraisingEndDate: "2024-04-15",
    status: "Active",
    approvalStatus: "rejected",
    targetAmount: "$300,000",
    raisedAmount: "$0",
    milestoneCount: 5,
    completedMilestones: 0,
    isFeatured: false,
    isTrending: false,
    isBlocked: false,
    pendingProofs: 0,
    description: "Virtual reality platform for immersive educational experiences",
    milestones: [
      {
        title: "Content Development",
        description: "Develop initial educational content",
        targetDate: "2023-12-15",
        status: "Upcoming",
      },
      {
        title: "Platform Development",
        description: "Complete core platform development",
        targetDate: "2024-02-15",
        status: "Upcoming",
      },
      {
        title: "School Partnerships",
        description: "Secure partnerships with 5 schools",
        targetDate: "2024-03-15",
        status: "Upcoming",
      },
      {
        title: "Beta Testing",
        description: "Conduct beta testing with partner schools",
        targetDate: "2024-04-15",
        status: "Upcoming",
      },
      {
        title: "Commercial Launch",
        description: "Full commercial launch of the platform",
        targetDate: "2024-05-15",
        status: "Upcoming",
      },
    ],
  },
]

// Update the campaigns array to include approvalStatus
const campaigns: Campaign[] = [
  {
    id: "active-1",
    name: "TechInnovate Series A",
    founder: {
      id: "1",
      name: "Alex Johnson",
    },
    startup: {
      id: "1",
      name: "TechInnovate",
      stage: "MVP",
    },
    createdDate: "2023-01-15",
    fundraisingEndDate: "2023-04-15",
    status: "Active",
    approvalStatus: "approved",
    targetAmount: "$250,000",
    raisedAmount: "$120,000",
    milestoneCount: 8,
    completedMilestones: 2,
    isFeatured: true,
    isTrending: true,
    isBlocked: false,
    pendingProofs: 1,
    description: "Raising funds to scale our AI-powered software solutions for small businesses",
    milestones: [
      {
        title: "Beta Launch",
        description: "Launch beta version to 100 test users",
        targetDate: "2023-02-15",
        status: "Completed",
      },
      {
        title: "Product Refinement",
        description: "Implement feedback and refine product features",
        targetDate: "2023-03-15",
        status: "Completed",
      },
      {
        title: "Marketing Campaign",
        description: "Launch marketing campaign to acquire first 1000 users",
        targetDate: "2023-04-01",
        status: "In Progress",
      },
      {
        title: "Full Launch",
        description: "Official product launch with all features",
        targetDate: "2023-04-30",
        status: "Upcoming",
      },
      {
        title: "User Acquisition",
        description: "Reach 5000 active users",
        targetDate: "2023-05-15",
        status: "Upcoming",
      },
      {
        title: "Revenue Milestone",
        description: "Achieve $10K monthly recurring revenue",
        targetDate: "2023-06-15",
        status: "Upcoming",
      },
      {
        title: "Enterprise Clients",
        description: "Sign 3 enterprise clients",
        targetDate: "2023-07-15",
        status: "Upcoming",
      },
      {
        title: "International Expansion",
        description: "Launch in European market",
        targetDate: "2023-08-15",
        status: "Upcoming",
      },
    ],
  },
  // Add approvalStatus to the rest of the campaigns
  {
    id: "success-1",
    name: "GreenSolutions Seed Round",
    founder: {
      id: "2",
      name: "Sarah Williams",
    },
    startup: {
      id: "2",
      name: "GreenSolutions",
      stage: "Prototype",
    },
    createdDate: "2023-02-20",
    fundraisingEndDate: "2023-05-20",
    status: "Completed",
    approvalStatus: "approved",
    targetAmount: "$120,000",
    raisedAmount: "$120,000",
    milestoneCount: 6,
    completedMilestones: 6,
    isFeatured: true,
    isTrending: false,
    isBlocked: false,
    pendingProofs: 0,
    description: "Funding sustainable packaging alternatives for e-commerce businesses",
    milestones: [
      {
        title: "Prototype Development",
        description: "Complete working prototype of sustainable packaging",
        targetDate: "2023-03-15",
        status: "Completed",
      },
      {
        title: "Manufacturing Setup",
        description: "Set up small-scale manufacturing facility",
        targetDate: "2023-04-20",
        status: "Completed",
      },
      {
        title: "First Production Run",
        description: "Complete first production run of 10,000 units",
        targetDate: "2023-05-30",
        status: "Completed",
      },
      {
        title: "Retail Partnerships",
        description: "Secure partnerships with 5 e-commerce retailers",
        targetDate: "2023-06-30",
        status: "Completed",
      },
      {
        title: "Certification",
        description: "Obtain eco-friendly certification",
        targetDate: "2023-07-30",
        status: "Completed",
      },
      {
        title: "Scale Production",
        description: "Scale to 50,000 units monthly production",
        targetDate: "2023-08-30",
        status: "Completed",
      },
    ],
  },
  // Continue adding approvalStatus to the rest of the campaigns...
  {
    id: "failed-1",
    name: "CryptoWallet App",
    founder: {
      id: "3",
      name: "Michael Brown",
    },
    startup: {
      id: "3",
      name: "HealthAI",
      stage: "Public Beta",
    },
    createdDate: "2023-03-10",
    fundraisingEndDate: "2023-06-10",
    status: "Completed",
    approvalStatus: "approved",
    targetAmount: "$500,000",
    raisedAmount: "$125,000",
    milestoneCount: 10,
    completedMilestones: 1,
    isFeatured: false,
    isTrending: false,
    isBlocked: false,
    pendingProofs: 1,
    description: "Expanding our AI diagnostics platform for healthcare providers",
    milestones: [
      {
        title: "Algorithm Refinement",
        description: "Improve diagnostic accuracy to 95%",
        targetDate: "2023-04-01",
        status: "Completed",
      },
      {
        title: "Hospital Partnerships",
        description: "Secure partnerships with 5 major hospitals",
        targetDate: "2023-05-01",
        status: "In Progress",
      },
      {
        title: "Regulatory Approval",
        description: "Obtain FDA clearance for diagnostic tool",
        targetDate: "2023-06-15",
        status: "Upcoming",
      },
      {
        title: "Platform Expansion",
        description: "Add support for 10 additional medical conditions",
        targetDate: "2023-07-15",
        status: "Upcoming",
      },
      {
        title: "International Launch",
        description: "Launch in European markets",
        targetDate: "2023-08-15",
        status: "Upcoming",
      },
      {
        title: "Mobile App Release",
        description: "Launch companion mobile app for patients",
        targetDate: "2023-09-15",
        status: "Upcoming",
      },
      {
        title: "Research Publication",
        description: "Publish research findings in medical journal",
        targetDate: "2023-10-15",
        status: "Upcoming",
      },
      {
        title: "AI Training Expansion",
        description: "Expand training dataset to 1 million cases",
        targetDate: "2023-11-15",
        status: "Upcoming",
      },
      {
        title: "Integration API",
        description: "Release API for third-party EMR integration",
        targetDate: "2023-12-15",
        status: "Upcoming",
      },
      {
        title: "Series C Preparation",
        description: "Prepare metrics and documentation for Series C",
        targetDate: "2024-01-15",
        status: "Upcoming",
      },
    ],
  },
  {
    id: "4",
    name: "UrbanMobility Pre-Seed",
    founder: {
      id: "5",
      name: "David Wilson",
    },
    startup: {
      id: "4",
      name: "UrbanMobility",
      stage: "Prototype",
    },
    createdDate: "2023-05-12",
    fundraisingEndDate: "2023-08-12",
    status: "Active",
    approvalStatus: "approved",
    targetAmount: "$80,000",
    raisedAmount: "$0",
    milestoneCount: 6,
    completedMilestones: 0,
    isFeatured: false,
    isTrending: false,
    isBlocked: false,
    pendingProofs: 0,
    description: "Developing electric scooter sharing platform for urban areas",
    milestones: [
      {
        title: "Prototype Development",
        description: "Build working prototype of scooter and app",
        targetDate: "2023-06-30",
        status: "In Progress",
      },
      {
        title: "Pilot Program",
        description: "Launch pilot program in Austin with 50 scooters",
        targetDate: "2023-08-30",
        status: "Upcoming",
      },
      {
        title: "App Development",
        description: "Complete mobile app for scooter rental",
        targetDate: "2023-09-30",
        status: "Upcoming",
      },
      {
        title: "City Permits",
        description: "Secure operating permits in 3 cities",
        targetDate: "2023-10-30",
        status: "Upcoming",
      },
      {
        title: "Fleet Expansion",
        description: "Expand fleet to 200 scooters",
        targetDate: "2023-11-30",
        status: "Upcoming",
      },
      {
        title: "Marketing Launch",
        description: "Launch marketing campaign in target cities",
        targetDate: "2023-12-30",
        status: "Upcoming",
      },
    ],
  },
  {
    id: "5",
    name: "CryptoFinance Initial Round",
    founder: {
      id: "4",
      name: "Emily Davis",
    },
    startup: {
      id: "5",
      name: "CryptoFinance",
      stage: "Ideation",
    },
    createdDate: "2023-04-05",
    fundraisingEndDate: "2023-07-05",
    status: "Completed",
    approvalStatus: "approved",
    targetAmount: "$150,000",
    raisedAmount: "$30,000",
    milestoneCount: 7,
    completedMilestones: 1,
    isFeatured: false,
    isTrending: false,
    isBlocked: true,
    pendingProofs: 0,
    description: "Building decentralized finance solutions for small businesses",
    milestones: [
      {
        title: "Whitepaper",
        description: "Complete detailed whitepaper and technical documentation",
        targetDate: "2023-05-01",
        status: "Completed",
      },
      {
        title: "MVP Development",
        description: "Develop minimum viable product",
        targetDate: "2023-06-15",
        status: "In Progress",
      },
      {
        title: "Security Audit",
        description: "Complete third-party security audit",
        targetDate: "2023-07-30",
        status: "Upcoming",
      },
      {
        title: "Token Launch",
        description: "Launch utility token for platform",
        targetDate: "2023-08-30",
        status: "Upcoming",
      },
      {
        title: "Exchange Listing",
        description: "List token on decentralized exchange",
        targetDate: "2023-09-30",
        status: "Upcoming",
      },
      {
        title: "Platform Beta",
        description: "Launch beta version of platform to early users",
        targetDate: "2023-10-30",
        status: "Upcoming",
      },
      {
        title: "Governance Model",
        description: "Implement decentralized governance model",
        targetDate: "2023-11-30",
        status: "Upcoming",
      },
    ],
  },
]

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
  const [activeTab, setActiveTab] = useState<"pending" | "live" | "completed">("pending")
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

  // Update allCampaigns to include rejected campaigns
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([
    ...pendingCampaigns,
    ...campaigns,
    ...rejectedCampaigns,
  ])

  // Filter campaigns based on approval status and completion status
  const pendingApprovalCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => campaign.approvalStatus === "pending")
  }, [allCampaigns])

  const liveCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => campaign.approvalStatus === "approved" && campaign.status === "Active")
  }, [allCampaigns])

  const completedCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => campaign.approvalStatus === "approved" && campaign.status === "Completed")
  }, [allCampaigns])

  const rejectedCampaignsCount = useMemo(() => {
    return allCampaigns.filter((campaign) => campaign.approvalStatus === "rejected").length
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
  const handleApproveCampaign = (campaign: Campaign) => {
    setCampaignToApprove(campaign)
    setShowApproveAlert(true)
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
  const handleRejectCampaign = (campaign: Campaign) => {
    setCampaignToReject(campaign)
    setRejectionReason("") // Clear previous reason
    setShowRejectDialog(true)
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
                <TableCell>{formatDate(campaign.fundraisingEndDate)}</TableCell>
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Show different options based on the active tab */}
                      {activeTab === "pending" ? (
                        <>
                          <DropdownMenuItem onClick={() => handleViewDetails(campaign)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleApproveCampaign(campaign)} className="text-green-500">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRejectCampaign(campaign)} className="text-red-500">
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Campaign
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

                          <DropdownMenuSeparator />

                          {/* Featured option */}
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(campaign)}
                            className={campaign.isFeatured ? "text-red-500" : "text-green-500"}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            {campaign.isFeatured ? "Remove from Featured" : "Add to Featured"}
                          </DropdownMenuItem>

                          {/* Trending option */}
                          <DropdownMenuItem
                            onClick={() => handleToggleTrending(campaign)}
                            className={campaign.isTrending ? "text-red-500" : "text-green-500"}
                          >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            {campaign.isTrending ? "Remove from Trending" : "Add to Trending"}
                          </DropdownMenuItem>

                          {/* Block/Unblock option */}
                          <DropdownMenuItem
                            onClick={() => handleToggleBlocked(campaign)}
                            className={campaign.isBlocked ? "text-green-500" : "text-red-500"}
                          >
                            {campaign.isBlocked ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Unblock Campaign
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Block Campaign
                              </>
                            )}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {currentCampaigns.length === 0 && (
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
      {selectedCampaign && (
        <Dialog
          open={showDetails}
          onOpenChange={(open) => {
            if (!open) {
              // Immediately set showDetails to false
              setShowDetails(false)
              // Use a more direct approach to reset state
              document.body.style.pointerEvents = "" // Ensure pointer events are enabled
              // Small delay before removing the campaign from state
              setTimeout(() => {
                setSelectedCampaign(null)
              }, 10)
            }
          }}
        >
          <DialogPortal>
          <DialogContent className="sm:max-w-[700px] border border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Campaign Details</DialogTitle>
              <DialogDescription>Detailed information about {selectedCampaign.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Campaign:</div>
                <div className="col-span-3 flex items-center">
                  {selectedCampaign.name}
                  {selectedCampaign.isFeatured && <Star className="h-4 w-4 text-primary ml-2" />}
                  {selectedCampaign.isTrending && <TrendingUp className="h-4 w-4 text-primary ml-2" />}
                </div>
              </div>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Startup:</div>
                <div className="col-span-3">
                  <Link
                    href={`/admin/dashboard/marketplace?startup=${selectedCampaign.startup.id}`}
                    className="text-primary hover:underline"
                  >
                    {selectedCampaign.startup.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">{selectedCampaign.startup.stage}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Created Date:</div>
                <div className="col-span-3">{formatDate(selectedCampaign.createdDate)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Fundraising End Date:</div>
                <div className="col-span-3">{formatDate(selectedCampaign.fundraisingEndDate)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge variant={getStatusBadgeVariant(selectedCampaign.status)} className="capitalize">
                    {selectedCampaign.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Fundraising:</div>
                <div className="col-span-3">
                  {selectedCampaign.raisedAmount} / {selectedCampaign.targetAmount} (
                  {calculateProgress(selectedCampaign.raisedAmount, selectedCampaign.targetAmount)}%)
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Milestones:</div>
                <div className="col-span-3">
                  {selectedCampaign.completedMilestones}/{selectedCampaign.milestoneCount} completed
                  {selectedCampaign.pendingProofs > 0 && (
                    <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                      {selectedCampaign.pendingProofs} Pending Proof{selectedCampaign.pendingProofs > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Description:</div>
                <div className="col-span-3">{selectedCampaign.description}</div>
              </div>
              <div className="grid gap-4 py-4">
                <h3 className="text-lg font-semibold">Milestones</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Milestones can be verified and funds released at any time, regardless of fundraising status.
                </p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Target Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCampaign.milestones.map((milestone, index) => (
                        <TableRow key={index}>
                          <TableCell>{milestone.title}</TableCell>
                          <TableCell>{milestone.description}</TableCell>
                          <TableCell>{formatDate(milestone.targetDate)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {milestone.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {milestone.status === "In Progress" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-red-500 hover:bg-red-50"
                                onClick={() => handleRejectMilestone(selectedCampaign, index)}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Add approval/rejection buttons for pending campaigns */}
              {selectedCampaign.approvalStatus === "pending" && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      setShowDetails(false)
                      setTimeout(() => {
                        setSelectedCampaign(null)
                        handleRejectCampaign(selectedCampaign)
                      }, 10)
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Campaign
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                    onClick={() => {
                      setShowDetails(false)
                      setTimeout(() => {
                        setSelectedCampaign(null)
                        handleApproveCampaign(selectedCampaign)
                      }, 10)
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve Campaign
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
            </DialogPortal>
        </Dialog>
      )}

      {/* Featured Confirmation Dialog */}
      <AlertDialog
        open={showFeaturedAlert}
        onOpenChange={(open) => {
          setShowFeaturedAlert(open)
          if (!open) {
            setTimeout(() => {
              if (!open && campaignToFeature) {
                setCampaignToFeature(null)
              }
            }, 100)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {campaignToFeature?.isFeatured ? "Remove from Featured" : "Add to Featured"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {campaignToFeature?.isFeatured
                ? "Are you sure you want to remove this campaign from featured? It will no longer appear in the featured section."
                : "Are you sure you want to add this campaign to featured? It will appear in the featured section."}
              {campaignToFeature && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="font-medium">Campaign: {campaignToFeature.name}</div>
                  <div className="font-medium">Startup: {campaignToFeature.startup.name}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleFeatured}>
              {campaignToFeature?.isFeatured ? "Remove from Featured" : "Add to Featured"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Trending Confirmation Dialog */}
      <AlertDialog
        open={showTrendingAlert}
        onOpenChange={(open) => {
          setShowTrendingAlert(open)
          if (!open) {
            setTimeout(() => {
              if (!open && campaignToTrend) {
                setCampaignToTrend(null)
              }
            }, 100)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {campaignToTrend?.isTrending ? "Remove from Trending" : "Add to Trending"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {campaignToTrend?.isTrending
                ? "Are you sure you want to remove this campaign from trending? It will no longer appear in the trending section."
                : "Are you sure you want to add this campaign to trending? It will appear in the trending section."}
              {campaignToTrend && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="font-medium">Campaign: {campaignToTrend.name}</div>
                  <div className="font-medium">Startup: {campaignToTrend.startup.name}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleTrending}>
              {campaignToTrend?.isTrending ? "Remove from Trending" : "Add to Trending"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block/Unblock Confirmation Dialog */}
      <AlertDialog
        open={showBlockAlert}
        onOpenChange={(open) => {
          setShowBlockAlert(open)
          if (!open) {
            setTimeout(() => {
              if (!open && campaignToBlock) {
                setCampaignToBlock(null)
              }
            }, 100)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{campaignToBlock?.isBlocked ? "Unblock Campaign" : "Block Campaign"}</AlertDialogTitle>
            <AlertDialogDescription>
              {campaignToBlock?.isBlocked
                ? "Are you sure you want to unblock this campaign? It will be visible on the platform again."
                : "Are you sure you want to block this campaign? It will be hidden from the platform."}
              {campaignToBlock && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="font-medium">Campaign: {campaignToBlock.name}</div>
                  <div className="font-medium">Startup: {campaignToBlock.startup.name}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleBlocked}
              className={campaignToBlock?.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
            >
              {campaignToBlock?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Campaign Confirmation Dialog */}
      <AlertDialog
        open={showApproveAlert}
        onOpenChange={(open) => {
          setShowApproveAlert(open)
          if (!open) {
            setTimeout(() => {
              if (!open && campaignToApprove) {
                setCampaignToApprove(null)
              }
            }, 100)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this campaign? Once approved, it will be visible to investors on the
              platform.
              {campaignToApprove && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="font-medium">Campaign: {campaignToApprove.name}</div>
                  <div className="font-medium">Startup: {campaignToApprove.startup.name}</div>
                  <div className="font-medium">Target: {campaignToApprove.targetAmount}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApproveCampaign} className="bg-green-500 hover:bg-green-600">
              Approve Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Campaign Rejection Dialog with Reason */}
      <Dialog
        open={showRejectDialog}
        onOpenChange={(open) => {
          setShowRejectDialog(open)
          if (!open) {
            setTimeout(() => {
              if (!open && campaignToReject) {
                setCampaignToReject(null)
              }
            }, 100)
          }
        }}
      >
        <DialogPortal>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this campaign. This will be sent to the founder via email.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {campaignToReject && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <div className="font-medium">Campaign: {campaignToReject.name}</div>
              <div className="font-medium">Founder: {campaignToReject.founder.name}</div>
              <div className="font-medium">Startup: {campaignToReject.startup.name}</div>
            </div>
          )}

          <div className="grid gap-4 py-4">
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

          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
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
          </AlertDialogFooter>
        </AlertDialogContent>
        </DialogPortal>
      </Dialog>

      {/* Milestone Rejection Dialog with Reason */}
      <Dialog
        open={showMilestoneRejectDialog}
        onOpenChange={(open) => {
          setShowMilestoneRejectDialog(open)
          if (!open) {
            setTimeout(() => {
              if (!open && milestoneToReject) {
                setMilestoneToReject(null)
              }
            }, 100)
          }
        }}
      >
        <DialogPortal>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Milestone Proof</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this milestone proof. This will be sent to the founder via email.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {milestoneToReject && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <div className="font-medium">Campaign: {milestoneToReject.name}</div>
              <div className="font-medium">Founder: {milestoneToReject.founder.name}</div>
              <div className="font-medium">Startup: {milestoneToReject.startup.name}</div>
            </div>
          )}

          <div className="grid gap-4 py-4">
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

          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
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
          </AlertDialogFooter>
        </AlertDialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}
