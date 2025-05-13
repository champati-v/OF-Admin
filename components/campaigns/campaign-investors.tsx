"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import {
  MoreHorizontal,
  Edit,
  Plus,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Search,
  Trash2,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Mail,
  FileText,
  ExternalLink,
  ChevronUp,
} from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { InvestmentForm } from "./investment-form"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Define the Investment type
type Investment = {
  id: string
  investorName: string
  telegram: string
  email: string
  walletAddress: string
  nationality: string
  amountInvested: string
  secondWallet: string
  twitterHandle: string
  date: string
}

// Define the Task type
type Task = {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "upcoming" | "rejected" | "incomplete"
  proof?: {
    url: string
    description: string
    submittedDate: string
    status: "pending" | "authenticated" | "failed"
    rejectionReason?: string
    previousSubmissions?: number
  }
}

// Define the Milestone type with tasks
type Milestone = {
  id: string
  title: string
  description: string
  targetAmount: number
  amountReleased: number
  status: "completed" | "in-progress" | "upcoming"
  completionDate?: string
  tasks: Task[]
  progress: number
}

// Define the Campaign Status type
type CampaignStatus = "active" | "completed"

// Mock data for investments - including multiple investments from the same investor
const mockInvestments: Investment[] = [
  {
    id: "1",
    investorName: "John Smith",
    telegram: "@johnsmith",
    email: "john@example.com",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    nationality: "United States",
    amountInvested: "$50,000",
    secondWallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    twitterHandle: "@johnsmith",
    date: "2023-05-15",
  },
  {
    id: "2",
    investorName: "Emma Johnson",
    telegram: "@emmaj",
    email: "emma@example.com",
    walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
    nationality: "United Kingdom",
    amountInvested: "$75,000",
    secondWallet: "0xbcdef1234567890abcdef1234567890abcdef123",
    twitterHandle: "@emmaj",
    date: "2023-06-20",
  },
  {
    id: "3",
    investorName: "Michael Chen",
    telegram: "@michaelc",
    email: "michael@example.com",
    walletAddress: "0x3456789012abcdef3456789012abcdef34567890",
    nationality: "Singapore",
    amountInvested: "$100,000",
    secondWallet: "0xcdef1234567890abcdef1234567890abcdef1234",
    twitterHandle: "@michaelc",
    date: "2023-07-10",
  },
  {
    id: "4",
    investorName: "John Smith",
    telegram: "@johnsmith",
    email: "john@example.com",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    nationality: "United States",
    amountInvested: "$25,000",
    secondWallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    twitterHandle: "@johnsmith",
    date: "2023-08-05",
  },
  {
    id: "5",
    investorName: "Emma Johnson",
    telegram: "@emmaj",
    email: "emma@example.com",
    walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
    nationality: "United Kingdom",
    amountInvested: "$50,000",
    secondWallet: "0xbcdef1234567890abcdef1234567890abcdef123",
    twitterHandle: "@emmaj",
    date: "2023-09-15",
  },
]

// Mock data for successful campaign
const mockSuccessfulCampaign = {
  id: "success-1",
  name: "GreenSolutions Seed Round",
  targetAmount: 300000,
  status: "completed" as CampaignStatus,
  endDate: "2023-10-15",
  investments: [
    {
      id: "s1",
      investorName: "John Smith",
      telegram: "@johnsmith",
      email: "john@example.com",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      nationality: "United States",
      amountInvested: "$100,000",
      secondWallet: "",
      twitterHandle: "@johnsmith",
      date: "2023-05-15",
    },
    {
      id: "s2",
      investorName: "Emma Johnson",
      telegram: "@emmaj",
      email: "emma@example.com",
      walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
      nationality: "United Kingdom",
      amountInvested: "$150,000",
      secondWallet: "",
      twitterHandle: "@emmaj",
      date: "2023-06-20",
    },
    {
      id: "s3",
      investorName: "Michael Chen",
      telegram: "@michaelc",
      email: "michael@example.com",
      walletAddress: "0x3456789012abcdef3456789012abcdef34567890",
      nationality: "Singapore",
      amountInvested: "$50,000",
      secondWallet: "",
      twitterHandle: "@michaelc",
      date: "2023-07-10",
    },
  ],
  milestones: [
    {
      id: "sm1",
      title: "Problem-Solution Validation",
      description: "Proving you've identified a real problem worth solving",
      targetAmount: 50000,
      amountReleased: 50000,
      status: "completed",
      completionDate: "2023-06-15",
      progress: 100,
      tasks: [
        {
          id: "sm1-t1",
          title: "Customer Discovery",
          description:
            "Complete and document at least 25 interviews with potential users in your target market. These interviews should validate the problem exists and is painful enough that people would pay for a solution.",
          status: "completed",
        },
        {
          id: "sm1-t2",
          title: "Problem Statement Whitepaper",
          description:
            "Create a comprehensive document (at least 10 pages) that clearly defines the problem, analyzes the market size (TAM/SAM/SOM), and outlines your solution approach.",
          status: "completed",
        },
        {
          id: "sm1-t3",
          title: "Community Interest",
          description:
            "Demonstrate early interest by collecting at least 250 wallet addresses from potential users through your interest collection smart contract.",
          status: "completed",
        },
      ],
    },
    {
      id: "sm2",
      title: "MVP Development",
      description: "Building the minimum viable product",
      targetAmount: 50000,
      amountReleased: 50000,
      status: "completed",
      completionDate: "2023-07-20",
      progress: 100,
      tasks: [
        {
          id: "sm2-t1",
          title: "Technical Architecture",
          description:
            "Create detailed technical architecture documentation including system design, data flow, and technology stack.",
          status: "completed",
        },
        {
          id: "sm2-t2",
          title: "Core Functionality",
          description: "Develop and deploy the core functionality of your product with basic features working.",
          status: "completed",
        },
        {
          id: "sm2-t3",
          title: "Internal Testing",
          description: "Complete internal testing with at least 95% test coverage and fix critical bugs.",
          status: "completed",
        },
      ],
    },
    {
      id: "sm3",
      title: "Beta Testing",
      description: "Launch beta version and gather user feedback",
      targetAmount: 50000,
      amountReleased: 50000,
      status: "completed",
      completionDate: "2023-08-25",
      progress: 100,
      tasks: [
        {
          id: "sm3-t1",
          title: "Beta User Onboarding",
          description: "Onboard at least 50 beta users to test your product.",
          status: "completed",
        },
        {
          id: "sm3-t2",
          title: "Feedback Collection",
          description: "Collect and document feedback from beta users through surveys and interviews.",
          status: "completed",
        },
        {
          id: "sm3-t3",
          title: "Iteration Plan",
          description: "Create a detailed plan for product improvements based on user feedback.",
          status: "completed",
        },
      ],
    },
    {
      id: "sm4",
      title: "Product Launch",
      description: "Official product launch",
      targetAmount: 50000,
      amountReleased: 50000,
      status: "completed",
      completionDate: "2023-09-30",
      progress: 100,
      tasks: [
        {
          id: "sm4-t1",
          title: "Marketing Campaign",
          description: "Execute a comprehensive marketing campaign across multiple channels.",
          status: "completed",
        },
        {
          id: "sm4-t2",
          title: "Public Release",
          description: "Launch the product to the public with all core features.",
          status: "completed",
        },
        {
          id: "sm4-t3",
          title: "User Acquisition",
          description: "Acquire at least 500 active users within the first month of launch.",
          status: "completed",
        },
      ],
    },
    {
      id: "sm5",
      title: "Expansion",
      description: "Expand to new markets",
      targetAmount: 50000,
      amountReleased: 50000,
      status: "completed",
      completionDate: "2023-10-15",
      progress: 100,
      tasks: [
        {
          id: "sm5-t1",
          title: "Market Research",
          description: "Conduct research on at least 3 potential new markets for expansion.",
          status: "completed",
        },
        {
          id: "sm5-t2",
          title: "Localization",
          description: "Adapt product and marketing materials for new markets.",
          status: "completed",
        },
        {
          id: "sm5-t3",
          title: "Regional Partnerships",
          description: "Secure at least 2 strategic partnerships in new markets.",
          status: "completed",
        },
      ],
    },
    {
      id: "sm6",
      title: "Team Growth",
      description: "Hire additional team members",
      targetAmount: 50000,
      amountReleased: 50000,
      status: "completed",
      completionDate: "2023-10-15",
      progress: 100,
      tasks: [
        {
          id: "sm6-t1",
          title: "Hiring Plan",
          description: "Create a detailed hiring plan with role descriptions and compensation packages.",
          status: "completed",
        },
        {
          id: "sm6-t2",
          title: "Recruitment",
          description: "Recruit and onboard key team members for critical roles.",
          status: "completed",
        },
        {
          id: "sm6-t3",
          title: "Team Structure",
          description: "Establish team structure, communication protocols, and workflow processes.",
          status: "completed",
        },
      ],
    },
  ],
}

// Mock data for completed campaign (previously failed)
const mockCompletedCampaign = {
  id: "completed-2",
  name: "CryptoWallet App",
  targetAmount: 500000,
  status: "completed" as CampaignStatus,
  fundraisingEndDate: "2023-09-30", // Renamed from endDate to be more specific
  investments: [
    {
      id: "f1",
      investorName: "David Wilson",
      telegram: "@davidw",
      email: "david@example.com",
      walletAddress: "0x4567890123abcdef4567890123abcdef45678901",
      nationality: "Canada",
      amountInvested: "$75,000",
      secondWallet: "",
      twitterHandle: "@davidw",
      date: "2023-04-10",
    },
    {
      id: "f2",
      investorName: "Sarah Lee",
      telegram: "@sarahlee",
      email: "sarah@example.com",
      walletAddress: "0x5678901234abcdef5678901234abcdef56789012",
      nationality: "Australia",
      amountInvested: "$50,000",
      secondWallet: "",
      twitterHandle: "@sarahlee",
      date: "2023-05-05",
    },
  ],
  milestones: [
    {
      id: "fm1",
      title: "Problem-Solution Validation",
      description: "Proving you've identified a real problem worth solving",
      targetAmount: 83333,
      amountReleased: 83333,
      status: "completed",
      completionDate: "2023-05-20",
      progress: 100,
      tasks: [
        {
          id: "fm1-t1",
          title: "Customer Discovery",
          description:
            "Complete and document at least 25 interviews with potential users in your target market. These interviews should validate the problem exists and is painful enough that people would pay for a solution.",
          status: "completed",
        },
        {
          id: "fm1-t2",
          title: "Problem Statement Whitepaper",
          description:
            "Create a comprehensive document (at least 10 pages) that clearly defines the problem, analyzes the market size (TAM/SAM/SOM), and outlines your solution approach.",
          status: "completed",
        },
        {
          id: "fm1-t3",
          title: "Community Interest",
          description:
            "Demonstrate early interest by collecting at least 250 wallet addresses from potential users through your interest collection smart contract.",
          status: "completed",
        },
      ],
    },
    {
      id: "fm2",
      title: "MVP Development",
      description: "Building the minimum viable product",
      targetAmount: 83333,
      amountReleased: 41667,
      status: "in-progress",
      completionDate: undefined,
      progress: 67,
      tasks: [
        {
          id: "fm2-t1",
          title: "Technical Architecture",
          description:
            "Create detailed technical architecture documentation including system design, data flow, and technology stack.",
          status: "completed",
        },
        {
          id: "fm2-t2",
          title: "Core Functionality",
          description: "Develop and deploy the core functionality of your product with basic features working.",
          status: "completed",
        },
        {
          id: "fm2-t3",
          title: "Internal Testing",
          description: "Complete internal testing with at least 95% test coverage and fix critical bugs.",
          status: "in-progress",
          proof: {
            url: "https://example.com/prototype-proof.pdf",
            description:
              "We've completed the internal testing with 95% test coverage. All critical bugs have been fixed and the system is stable. Please find attached the test reports and bug fix documentation.",
            submittedDate: "2023-09-25",
            status: "pending",
            previousSubmissions: 0,
          },
        },
      ],
    },
    {
      id: "fm3",
      title: "Beta Testing",
      description: "Launch beta version and gather user feedback",
      targetAmount: 83333,
      amountReleased: 0,
      status: "upcoming",
      completionDate: undefined,
      progress: 0,
      tasks: [
        {
          id: "fm3-t1",
          title: "Beta User Onboarding",
          description: "Onboard at least 50 beta users to test your product.",
          status: "upcoming",
        },
        {
          id: "fm3-t2",
          title: "Feedback Collection",
          description: "Collect and document feedback from beta users through surveys and interviews.",
          status: "upcoming",
        },
        {
          id: "fm3-t3",
          title: "Iteration Plan",
          description: "Create a detailed plan for product improvements based on user feedback.",
          status: "upcoming",
        },
      ],
    },
    {
      id: "fm4",
      title: "Product Launch",
      description: "Official product launch",
      targetAmount: 83333,
      amountReleased: 0,
      status: "upcoming",
      completionDate: undefined,
      progress: 0,
      tasks: [
        {
          id: "fm4-t1",
          title: "Marketing Campaign",
          description: "Execute a comprehensive marketing campaign across multiple channels.",
          status: "upcoming",
        },
        {
          id: "fm4-t2",
          title: "Public Release",
          description: "Launch the product to the public with all core features.",
          status: "upcoming",
        },
        {
          id: "fm4-t3",
          title: "User Acquisition",
          description: "Acquire at least 500 active users within the first month of launch.",
          status: "upcoming",
        },
      ],
    },
    {
      id: "fm5",
      title: "Expansion",
      description: "Expand to new markets",
      targetAmount: 83333,
      amountReleased: 0,
      status: "upcoming",
      completionDate: undefined,
      progress: 0,
      tasks: [
        {
          id: "fm5-t1",
          title: "Market Research",
          description: "Conduct research on at least 3 potential new markets for expansion.",
          status: "upcoming",
        },
        {
          id: "fm5-t2",
          title: "Localization",
          description: "Adapt product and marketing materials for new markets.",
          status: "upcoming",
        },
        {
          id: "fm5-t3",
          title: "Regional Partnerships",
          description: "Secure at least 2 strategic partnerships in new markets.",
          status: "upcoming",
        },
      ],
    },
    {
      id: "fm6",
      title: "Team Growth",
      description: "Hire additional team members",
      targetAmount: 83333,
      amountReleased: 0,
      status: "upcoming",
      completionDate: undefined,
      progress: 0,
      tasks: [
        {
          id: "fm6-t1",
          title: "Hiring Plan",
          description: "Create a detailed hiring plan with role descriptions and compensation packages.",
          status: "upcoming",
        },
        {
          id: "fm6-t2",
          title: "Recruitment",
          description: "Recruit and onboard key team members for critical roles.",
          status: "upcoming",
        },
        {
          id: "fm6-t3",
          title: "Team Structure",
          description: "Establish team structure, communication protocols, and workflow processes.",
          status: "upcoming",
        },
      ],
    },
  ],
}

// Mock data for active campaign
const mockActiveCampaign = {
  id: "active-1",
  name: "TechInnovate Series A",
  targetAmount: 500000,
  status: "active" as CampaignStatus,
  endDate: "2023-12-31",
  investments: mockInvestments,
  milestones: [
    {
      id: "1",
      title: "Problem-Solution Validation",
      description: "Proving you've identified a real problem worth solving",
      targetAmount: 83333,
      amountReleased: 83333,
      status: "completed",
      completionDate: "2023-06-30",
      progress: 100,
      tasks: [
        {
          id: "1-t1",
          title: "Customer Discovery",
          description:
            "Complete and document at least 25 interviews with potential users in your target market. These interviews should validate the problem exists and is painful enough that users would pay for a solution.",
          status: "completed",
          proof: {
            url: "https://example.com/customer-discovery-proof.pdf",
            description:
              "We conducted 30 interviews with potential users in our target market. The interviews validated that our identified problem exists and is painful enough that users would pay for our solution.",
            submittedDate: "2023-06-15",
            status: "authenticated",
          },
        },
        {
          id: "1-t2",
          title: "Problem Statement Whitepaper",
          description:
            "Create a comprehensive document (at least 10 pages) that clearly defines the problem, analyzes the market size (TAM/SAM/SOM), and outlines your solution approach.",
          status: "completed",
          proof: {
            url: "https://example.com/problem-statement-whitepaper.pdf",
            description:
              "We created a 15-page whitepaper that clearly defines the problem, analyzes the market size, and outlines our solution approach.",
            submittedDate: "2023-06-22",
            status: "authenticated",
          },
        },
        {
          id: "1-t3",
          title: "Community Interest",
          description:
            "Demonstrate early interest by collecting at least 250 wallet addresses from potential users through your interest collection smart contract.",
          status: "completed",
          proof: {
            url: "https://example.com/community-interest-proof.pdf",
            description:
              "We collected 300 wallet addresses from potential users through our interest collection smart contract, demonstrating early interest in our solution.",
            submittedDate: "2023-06-29",
            status: "authenticated",
          },
        },
      ],
    },
    {
      id: "2",
      title: "MVP Development",
      description: "Building the minimum viable product",
      targetAmount: 83333,
      amountReleased: 41667,
      status: "in-progress",
      progress: 67,
      tasks: [
        {
          id: "2-t1",
          title: "Technical Architecture",
          description:
            "Create detailed technical architecture documentation including system design, data flow, and technology stack.",
          status: "completed",
        },
        {
          id: "2-t2",
          title: "Core Functionality",
          description: "Develop and deploy the core functionality of your product with basic features working.",
          status: "completed",
        },
        {
          id: "2-t3",
          title: "Internal Testing",
          description: "Complete internal testing with at least 95% test coverage and fix critical bugs.",
          status: "in-progress",
          proof: {
            url: "https://example.com/proof-document.pdf",
            description:
              "We have successfully completed internal testing with 96% test coverage. All critical bugs have been fixed and the system is stable for beta release. Attached is the test report and bug fix documentation.",
            submittedDate: "2023-07-15",
            status: "pending",
            previousSubmissions: 0,
          },
        },
      ],
    },
    {
      id: "3",
      title: "Beta Testing",
      description: "Launch beta version and gather user feedback",
      targetAmount: 83333,
      amountReleased: 0,
      status: "upcoming",
      progress: 0,
      tasks: [
        {
          id: "3-t1",
          title: "Beta User Onboarding",
          description: "Onboard at least 50 beta users to test your product.",
          status: "upcoming",
        },
        {
          id: "3-t2",
          title: "Feedback Collection",
          description: "Collect and document feedback from beta users through surveys and interviews.",
          status: "upcoming",
        },
        {
          id: "3-t3",
          title: "Iteration Plan",
          description: "Create a detailed plan for product improvements based on user feedback.",
          status: "upcoming",
        },
      ],
    },
    {
      id: "4",
      title: "Product Launch",
      description: "Official product launch",
      targetAmount: 83333,
      amountReleased: 0,
      status: "upcoming",
      progress: 0,
      tasks: [
        {
          id: "4-t1",
          title: "Marketing Campaign",
          description: "Execute a comprehensive marketing campaign across multiple channels.",
          status: "upcoming",
        },
        {
          id: "4-t2",
          title: "Public Release",
          description: "Launch the product to the public with all core features.",
          status: "upcoming",
        },
        {
          id: "4-t3",
          title: "User Acquisition",
          description: "Acquire at least 500 active users within the first month of launch.",
          status: "upcoming",
        },
      ],
    },
    {
      id: "5",
      title: "Expansion",
      description: "Expand to new markets",
      targetAmount: 83333,
      amountReleased: 0,
      status: "upcoming",
      progress: 0,
      tasks: [
        {
          id: "5-t1",
          title: "Market Research",
          description: "Conduct research on at least 3 potential new markets for expansion.",
          status: "upcoming",
        },
        {
          id: "5-t2",
          title: "Localization",
          description: "Adapt product and marketing materials for new markets.",
          status: "upcoming",
        },
        {
          id: "5-t3",
          title: "Regional Partnerships",
          description: "Secure at least 2 strategic partnerships in new markets.",
          status: "upcoming",
        },
      ],
    },
    {
      id: "6",
      title: "Team Growth",
      description: "Hire additional team members",
      targetAmount: 83333,
      amountReleased: 0,
      status: "upcoming",
      progress: 0,
      tasks: [
        {
          id: "6-t1",
          title: "Hiring Plan",
          description: "Create a detailed hiring plan with role descriptions and compensation packages.",
          status: "upcoming",
        },
        {
          id: "6-t2",
          title: "Recruitment",
          description: "Recruit and onboard key team members for critical roles.",
          status: "upcoming",
        },
        {
          id: "6-t3",
          title: "Team Structure",
          description: "Establish team structure, communication protocols, and workflow processes.",
          status: "upcoming",
        },
      ],
    },
  ],
}

interface CampaignInvestorsProps {
  campaignId: string
}

// Helper function to group investments by investor
const groupInvestmentsByInvestor = (investments: Investment[]) => {
  const groupedMap = new Map<string, Investment[]>()

  investments.forEach((investment) => {
    // Use name and email as a unique key for each investor
    const key = `${investment.investorName}-${investment.email}`

    if (!groupedMap.has(key)) {
      groupedMap.set(key, [])
    }

    groupedMap.get(key)?.push(investment)
  })

  return Array.from(groupedMap.entries()).map(([key, investments]) => ({
    key,
    investor: investments[0], // Use the first investment to get investor details
    investments: investments,
    totalInvested: investments.reduce((sum, inv) => {
      const amount = Number.parseFloat(inv.amountInvested.replace(/[^0-9.]/g, ""))
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0),
    // Get the most recent investment date for sorting
    latestInvestmentDate: investments.reduce((latest, inv) => {
      const currentDate = new Date(inv.date)
      return currentDate > latest ? currentDate : latest
    }, new Date(0)),
  }))
}

type SortOrder = "newest" | "oldest" | "amount-high" | "amount-low"

export function CampaignInvestors({ campaignId }: CampaignInvestorsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const milestoneIdParam = searchParams.get("milestoneId")
  const taskIdParam = searchParams.get("taskId")

  // Determine which campaign to show based on campaignId (in a real app, this would be fetched from API)
  const getCampaignData = () => {
    if (campaignId === "success-1") return mockSuccessfulCampaign
    if (campaignId === "failed-1") return mockCompletedCampaign // Keep the ID the same for compatibility
    return mockActiveCampaign
  }

  const campaignData = getCampaignData()

  // const [investments, setInvestments] = useState<Investment[]>(campaignData.investments)
  const [investments, setInvestments] = useState<Investment[]>([])
  // const [milestones, setMilestones] = useState<Milestone[]>(campaignData.milestones)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>(campaignData.status)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState<"new" | "edit" | "update">("new")
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [expandedInvestorsSet, setExpandedInvestorsSet] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
  const [investmentToDelete, setInvestmentToDelete] = useState<Investment | null>(null)
  const [activeTab, setActiveTab] = useState<string>(tabParam === "milestones" ? "milestones" : "investors")
  const [showCompleteMilestoneAlert, setShowCompleteMilestoneAlert] = useState<boolean>(false)
  const [milestoneToComplete, setMilestoneToComplete] = useState<Milestone | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState<number>(15)
  const [showProofDialog, setShowProofDialog] = useState<boolean>(false)
  const [selectedProof, setSelectedProof] = useState<{ milestone: Milestone; task: Task } | null>(null)
  const [highlightedMilestoneId, setHighlightedMilestoneId] = useState<string | null>(null)
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set())

  // Add state for task proof rejection
  const [showRejectProofDialog, setShowRejectProofDialog] = useState<boolean>(false)
  const [proofRejectionReason, setProofRejectionReason] = useState<string>("")

  const itemsPerPageConst = 15

  // Campaign details
  const campaignName = campaignData.name
  const campaignTarget = campaignData.targetAmount

  // Check for URL parameters to highlight a specific milestone and task
  useEffect(() => {
    if (milestoneIdParam) {
      setActiveTab("milestones")
      setHighlightedMilestoneId(milestoneIdParam)
      setExpandedMilestones(new Set([milestoneIdParam]))

      // Find the milestone
      const milestone = milestones.find((m) => m.id === milestoneIdParam)

      if (milestone) {
        // If there's a specific task ID, find that task
        if (taskIdParam) {
          const task = milestone.tasks.find((t) => t.id === taskIdParam)
          if (task && task.proof && task.proof.status === "pending") {
            setSelectedProof({ milestone, task })
            setShowProofDialog(true)
          }
        }
        // Otherwise, find any pending task in the milestone
        else {
          const pendingTask = milestone.tasks.find((t) => t.proof && t.proof.status === "pending")
          if (pendingTask) {
            setSelectedProof({ milestone, task: pendingTask })
            setShowProofDialog(true)
          }
        }
      }
    }
  }, [milestoneIdParam, taskIdParam, milestones])

  // Fetch investments data from API
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        // Extract campaign_id from URL
        const pathParts = window.location.pathname.split("/")
        const campaign_id = pathParts[pathParts.length - 2] // Get the campaign_id from URL

        const response = await fetch(`https://ofstaging.azurewebsites.net/api/admin/get-all-investments/${campaign_id}`, {
          headers:{
            user_id: "62684"
          }
        })
        const data = await response.json()

        if (data.investments) {
          // Transform API data to match our Investment type
          const formattedInvestments = data.investments.flatMap((item) => {
            return item.investments.map((inv, index) => ({
              id: `${item.investor._id}-${index}`,
              investorName: item.investor.name,
              telegram: item.investor.telegram || "",
              email: item.investor.email,
              walletAddress: inv.walletAddress,
              nationality: item.investor.nationality,
              amountInvested: `$${inv.amount.toLocaleString()}`,
              secondWallet: inv.secondaryWalletAddress || "",
              twitterHandle: item.investor.twitter || "",
              date: inv.date,
            }))
          })

          setInvestments(formattedInvestments)
        }
      } catch (error) {
        console.error("Error fetching investments:", error)
      }
    }

    fetchInvestments()
  }, [])

  // Fetch milestones data from API
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        // Extract campaign_id from URL
        console.log("Fetching milestones...")
        const pathParts = window.location.pathname.split("/")
        const campaign_id = pathParts[pathParts.length - 2] // Get the campaign_id from URL
        console.log("Campaign ID is:", campaign_id)

        const response = await fetch(`https://ofstaging.azurewebsites.net/api/admin/get-milestones/${campaign_id}`, {
          headers:{
            user_id: "62684"
          }
        })
        const data = await response.json()

        if (data.milestones) {
          // Transform API data to match our Milestone type
          const formattedMilestones = data.milestones.map((milestone) => ({
            id: milestone.milestoneId,
            title: milestone.name,
            description: milestone.description,
            targetAmount: campaignTarget / data.milestones.length, // Divide target amount equally
            amountReleased:
              milestone.adminApprovalStatus === "rejected" ? 0 : (milestone.fundPercentage * campaignTarget) / 100,
            status:
              milestone.milestoneStatus === "completed"
                ? "completed"
                : milestone.milestoneStatus === "incomplete"
                  ? "in-progress"
                  : "upcoming",
            completionDate: milestone.milestoneStatus === "completed" ? new Date().toISOString() : undefined,
            progress:
              milestone.milestoneStatus === "completed"
                ? 100
                : (milestone.requirements.filter((req) => req.status === "completed").length /
                    milestone.requirements.length) *
                  100,
            tasks: milestone.requirements.map((req) => ({
              id: req._id,
              title: req.name,
              description: req.description,
              status:
                req.status === "completed" ? "completed" : req.status === "incomplete" ? "in-progress" : "upcoming",
              proof:
                milestone.verificationProof && milestone.verificationProof !== "url"
                  ? {
                      url: milestone.verificationProof,
                      description: "Verification proof submitted by the team",
                      submittedDate: new Date().toISOString(),
                      status:
                        milestone.adminApprovalStatus === "pending"
                          ? "pending"
                          : milestone.adminApprovalStatus === "rejected"
                            ? "failed"
                            : "authenticated",
                      rejectionReason: milestone.rejectionReason || undefined,
                    }
                  : undefined,
            })),
          }))

          setMilestones(formattedMilestones)
        }
      } catch (error) {
        console.error("Error fetching milestones:", error)
      }
    }

    fetchMilestones()
  }, [campaignTarget])

  // Filter investments based on search query
  const filteredInvestments = useMemo(() => {
    if (!searchQuery.trim()) return investments

    return investments.filter(
      (inv) =>
        inv.investorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.telegram.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [investments, searchQuery])

  // Group investments by investor
  const groupedInvestors = useMemo(() => {
    const grouped = groupInvestmentsByInvestor(filteredInvestments)

    // Sort the grouped investors based on the selected sort order
    return grouped.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return b.latestInvestmentDate.getTime() - a.latestInvestmentDate.getTime()
        case "oldest":
          return a.latestInvestmentDate.getTime() - b.latestInvestmentDate.getTime()
        case "amount-high":
          return b.totalInvested - a.totalInvested
        case "amount-low":
          return a.totalInvested - b.totalInvested
        default:
          return 0
      }
    })
  }, [filteredInvestments, sortOrder])

  // Calculate campaign metrics
  const totalRaised = useMemo(() => {
    return investments.reduce((sum, inv) => {
      const amount = Number.parseFloat(inv.amountInvested.replace(/[^0-9.]/g, ""))
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)
  }, [investments])

  const uniqueInvestorCount = useMemo(() => {
    return groupInvestmentsByInvestor(investments).length
  }, [investments])

  const totalFundsReleased = useMemo(() => {
    return milestones.reduce((sum, milestone) => sum + milestone.amountReleased, 0)
  }, [milestones])

  const fundingProgress = useMemo(() => {
    return Math.min(Math.round((totalRaised / campaignTarget) * 100), 100)
  }, [totalRaised, campaignTarget])

  // Check if target is reached
  const isTargetReached = useMemo(() => {
    return totalRaised >= campaignTarget
  }, [totalRaised, campaignTarget])

  // Count completed milestones
  const completedMilestones = useMemo(() => {
    return milestones.filter((m) => m.status === "completed").length
  }, [milestones])

  // Count pending proofs across all tasks in all milestones
  const pendingProofs = useMemo(() => {
    return milestones.reduce((count, milestone) => {
      return count + milestone.tasks.filter((task) => task.proof && task.proof.status === "pending").length
    }, 0)
  }, [milestones])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleNewInvestment = () => {
    // Prevent new investments if target is reached or campaign is not active
    if (isTargetReached || campaignStatus === "completed") {
      return
    }

    setFormMode("new")
    setSelectedInvestment(null)
    setShowForm(true)
  }

  const handleEditInvestment = (investment: Investment) => {
    // Prevent editing if campaign is not active
    if (campaignStatus !== "active") {
      return
    }

    setFormMode("edit")
    setSelectedInvestment(investment)
    setShowForm(true)
  }

  const handleAddUpdate = (investment: Investment) => {
    // Prevent updates if target is reached or campaign is not active
    if (isTargetReached || campaignStatus !== "active") {
      return
    }

    setFormMode("update")
    setSelectedInvestment(investment)
    setShowForm(true)
  }

  const handleDeleteInvestment = (investment: Investment) => {
    // Prevent deletion if campaign is not active
    if (campaignStatus !== "active") {
      return
    }

    setInvestmentToDelete(investment)
    setShowDeleteAlert(true)
  }

  const confirmDeleteInvestment = () => {
    if (investmentToDelete) {
      setInvestments(investments.filter((inv) => inv.id !== investmentToDelete.id))
      setShowDeleteAlert(false)
      setInvestmentToDelete(null)
    }
  }

  const handleCompleteMilestone = (milestone: Milestone) => {
    setMilestoneToComplete(milestone)
    setShowCompleteMilestoneAlert(true)
  }

  const confirmCompleteMilestone = () => {
    if (milestoneToComplete) {
      // Update the milestone status and release funds
      setMilestones(
        milestones.map((m) =>
          m.id === milestoneToComplete.id
            ? {
                ...m,
                status: "completed",
                amountReleased: m.targetAmount,
                completionDate: new Date().toISOString().split("T")[0],
                progress: 100,
                tasks: m.tasks.map((task) => ({ ...task, status: "completed" })),
              }
            : m,
        ),
      )

      // Check if all milestones are completed to mark campaign as completed
      const updatedMilestones = milestones.map((m) =>
        m.id === milestoneToComplete.id ? { ...m, status: "completed" } : m,
      )

      const allCompleted = updatedMilestones.every((m) => m.status === "completed")
      if (allCompleted && isTargetReached) {
        setCampaignStatus("completed")
      }

      setShowCompleteMilestoneAlert(false)
      setMilestoneToComplete(null)
    }
  }

  const toggleExpandInvestor = (investorKey: string) => {
    const newExpanded = new Set(expandedInvestorsSet)
    if (newExpanded.has(investorKey)) {
      newExpanded.delete(investorKey)
    } else {
      newExpanded.add(investorKey)
    }
    setExpandedInvestorsSet(newExpanded)
  }

  const toggleExpandMilestone = (milestoneId: string) => {
    const newExpanded = new Set(expandedMilestones)
    if (newExpanded.has(milestoneId)) {
      newExpanded.delete(milestoneId)
    } else {
      newExpanded.add(milestoneId)
    }
    setExpandedMilestones(newExpanded)
  }

  const handleFormSubmit = (data: any) => {
    // Prevent form submission if target is reached or campaign is not active
    if (isTargetReached || campaignStatus !== "active") {
      return
    }

    // In a real implementation, this would call an API to save the investment data
    console.log("Form submitted:", data)

    if (formMode === "new") {
      // Add new investment
      const newInvestment: Investment = {
        id: `${investments.length + 1}`,
        investorName: data.name,
        telegram: data.telegram,
        email: data.email,
        walletAddress: data.walletAddress,
        nationality: data.nationality,
        amountInvested: data.amountInvested,
        secondWallet: data.secondWallet,
        twitterHandle: data.twitterHandle,
        date: data.date, // Use the date from the form instead of current date
      }

      const updatedInvestments = [...investments, newInvestment]
      setInvestments(updatedInvestments)

      // Check if target is reached with this new investment
      const newTotal = updatedInvestments.reduce((sum, inv) => {
        const amount = Number.parseFloat(inv.amountInvested.replace(/[^0-9.]/g, ""))
        return sum + (isNaN(amount) ? 0 : amount)
      }, 0)

      if (newTotal >= campaignTarget) {
        // If all milestones are also completed, mark campaign as completed
        const allCompleted = milestones.every((m) => m.status === "completed")
        if (allCompleted) {
          setCampaignStatus("completed")
        }
      }
    } else if (formMode === "edit") {
      // Edit existing investment
      setInvestments(
        investments.map((inv) =>
          inv.id === selectedInvestment?.id
            ? {
                ...inv,
                investorName: data.name,
                telegram: data.telegram,
                email: data.email,
                walletAddress: data.walletAddress,
                nationality: data.nationality,
                amountInvested: data.amountInvested,
                secondWallet: data.secondWallet,
                twitterHandle: data.twitterHandle,
                date: data.date, // Update the date
              }
            : inv,
        ),
      )
    } else if (formMode === "update") {
      // Add another investment for the same investor
      const newInvestment: Investment = {
        id: `${investments.length + 1}`,
        investorName: data.name,
        telegram: data.telegram,
        email: data.email,
        walletAddress: data.walletAddress,
        nationality: data.nationality,
        amountInvested: data.amountInvested,
        secondWallet: data.secondWallet,
        twitterHandle: data.twitterHandle,
        date: data.date, // Use the date from the form
      }

      const updatedInvestments = [...investments, newInvestment]
      setInvestments(updatedInvestments)

      // Check if target is reached with this new investment
      const newTotal = updatedInvestments.reduce((sum, inv) => {
        const amount = Number.parseFloat(inv.amountInvested.replace(/[^0-9.]/g, ""))
        return sum + (isNaN(amount) ? 0 : amount)
      }, 0)

      if (newTotal >= campaignTarget) {
        // If all milestones are also completed, mark campaign as completed
        const allCompleted = milestones.every((m) => m.status === "completed")
        if (allCompleted) {
          setCampaignStatus("completed")
        }
      }
    }

    setShowForm(false)
  }

  // Calculate pagination
  const indexOfLastInvestor = currentPage * itemsPerPage
  const indexOfFirstInvestor = indexOfLastInvestor - itemsPerPage
  const currentGroupedInvestors = groupedInvestors.slice(indexOfFirstInvestor, indexOfLastInvestor)

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Get sort icon based on current sort order
  const getSortIcon = () => {
    switch (sortOrder) {
      case "newest":
        return <ArrowDown className="h-4 w-4 ml-1" />
      case "oldest":
        return <ArrowUp className="h-4 w-4 ml-1" />
      case "amount-high":
        return <ArrowDown className="h-4 w-4 ml-1" />
      case "amount-low":
        return <ArrowUp className="h-4 w-4 ml-1" />
      default:
        return <ArrowUpDown className="h-4 w-4 ml-1" />
    }
  }

  // Get milestone status icon
  const getMilestoneStatusIcon = (status: Milestone["status"], hasPendingTasks: boolean) => {
    if (status === "completed") {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    } else if (status === "in-progress") {
      if (hasPendingTasks) {
        return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
      }
      return <Clock className="h-5 w-5 text-amber-500" />
    } else {
      return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  // Get task status icon
  const getTaskStatusIcon = (task: Task) => {
    if (task.status === "completed") {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    } else if (task.status === "in-progress") {
      if (task.proof && task.proof.status === "pending") {
        return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
      } else if (task.proof && task.proof.status === "failed") {
        return <XCircle className="h-5 w-5 text-red-500" />
      }
      return <Clock className="h-5 w-5 text-amber-500" />
    } else if (task.status === "rejected") {
      return <XCircle className="h-5 w-5 text-red-500" />
    } else {
      return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  // Get campaign status badge
  const getCampaignStatusBadge = () => {
    switch (campaignStatus) {
      case "active":
        return (
          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Fundraising
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-100">
            Fundraising Ended
          </Badge>
        )
      default:
        return null
    }
  }

  const handleViewProof = (milestone: Milestone, task: Task) => {
    setSelectedProof({ milestone, task })
    setShowProofDialog(true)

    // Clear the highlighted milestone after viewing
    setHighlightedMilestoneId(null)
  }

  const handleAuthenticateProof = (milestone: Milestone, task: Task) => {
    // Update the task status and mark as completed
    setMilestones(
      milestones.map((m) =>
        m.id === milestone.id
          ? {
              ...m,
              tasks: m.tasks.map((t) =>
                t.id === task.id
                  ? {
                      ...t,
                      status: "completed",
                      proof: t.proof ? { ...t.proof, status: "authenticated" } : undefined,
                    }
                  : t,
              ),
              // Check if all tasks are completed to update milestone status
              status: m.tasks.every((t) => (t.id === task.id ? true : t.status === "completed"))
                ? "completed"
                : m.status,
              // If all tasks are completed, release full amount
              amountReleased: m.tasks.every((t) => (t.id === task.id ? true : t.status === "completed"))
                ? m.targetAmount
                : m.amountReleased,
              // Update progress based on completed tasks
              progress: Math.round(
                (m.tasks.filter((t) => t.id === task.id || t.status === "completed").length / m.tasks.length) * 100,
              ),
            }
          : m,
      ),
    )

    // Show success toast
    toast({
      title: "Task Proof Authenticated",
      description: `The proof for "${task.title}" has been authenticated.`,
    })

    // Close the proof dialog
    setShowProofDialog(false)
  }

  // New function to handle proof rejection with reason
  const handleRejectProof = (milestone: Milestone, task: Task) => {
    setSelectedProof({ milestone, task })
    setProofRejectionReason("")
    setShowRejectProofDialog(true)
    setShowProofDialog(false)
  }

  // Confirm proof rejection with reason
  const confirmRejectProof = () => {
    if (selectedProof && proofRejectionReason.trim()) {
      // Update the proof status to failed
      setMilestones(
        milestones.map((m) =>
          m.id === selectedProof.milestone.id
            ? {
                ...m,
                tasks: m.tasks.map((t) =>
                  t.id === selectedProof.task.id && t.proof
                    ? {
                        ...t,
                        status: "rejected",
                        proof: {
                          ...t.proof,
                          status: "failed",
                          rejectionReason: proofRejectionReason,
                          previousSubmissions: (t.proof.previousSubmissions || 0) + 1,
                        },
                      }
                    : t,
                ),
              }
            : m,
        ),
      )

      // In a real implementation, this would send an email with the rejection reason
      console.log(`Task proof rejected: ${selectedProof.task.title}. Reason: ${proofRejectionReason}`)

      // Show success toast
      toast({
        title: "Task Proof Rejected",
        description: "The founder has been notified about the rejection.",
      })

      setShowRejectProofDialog(false)
      setSelectedProof(null)
      setProofRejectionReason("")
    }
  }

  // Calculate if a milestone has any pending task proofs
  const hasPendingTaskProofs = (milestone: Milestone) => {
    return milestone.tasks.some((task) => task.proof && task.proof.status === "pending")
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">Investors for {campaignName}</h2>
          {getCampaignStatusBadge()}
        </div>
        <div className="flex items-center gap-2">
          {pendingProofs > 0 && (
            <Button
              variant="outline"
              className="border-amber-500 text-amber-500 hover:bg-amber-50"
              onClick={() => setActiveTab("milestones")}
            >
              <Clock className="mr-2 h-4 w-4" />
              {pendingProofs} Pending Proof{pendingProofs > 1 ? "s" : ""}
            </Button>
          )}
          <Button
            onClick={handleNewInvestment}
            disabled={campaignStatus === "completed" || isTargetReached}
            title={
              campaignStatus === "completed"
                ? "Fundraising period has ended"
                : isTargetReached
                  ? "Target amount reached"
                  : ""
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            New Investment
          </Button>
        </div>
      </div>

      {/* Campaign Status Banner */}
      {campaignStatus === "completed" && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-center">
          <Clock className="h-6 w-6 text-blue-500 mr-3" />
          <div>
            <h3 className="font-medium text-blue-800">Fundraising Period Ended</h3>
            <p className="text-blue-700 text-sm">
              The fundraising period for this campaign ended on {formatDate(campaignData.fundraisingEndDate)}. No new
              investments can be added, but milestone verification can continue.
            </p>
          </div>
        </div>
      )}

      {isTargetReached && campaignStatus === "active" && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-center">
          <CheckCircle2 className="h-6 w-6 text-green-500 mr-3" />
          <div>
            <h3 className="font-medium text-green-800">Target Amount Reached</h3>
            <p className="text-green-700 text-sm">
              This campaign has reached its target of {formatCurrency(campaignTarget)}. Fundraising will continue until{" "}
              {formatDate(campaignData.fundraisingEndDate)}.
            </p>
          </div>
        </div>
      )}

      {campaignStatus === "active" && !isTargetReached && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-center">
          <Clock className="h-6 w-6 text-amber-500 mr-3" />
          <div>
            <h3 className="font-medium text-amber-800">Fundraising In Progress</h3>
            <p className="text-amber-700 text-sm">
              Fundraising period ends on {formatDate(campaignData.fundraisingEndDate)}.
              {totalRaised > 0
                ? ` Currently raised ${formatCurrency(totalRaised)} (${fundingProgress}% of target).`
                : ""}
            </p>
          </div>
        </div>
      )}

      {/* Campaign Metrics */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRaised)}</div>
            <div className="mt-2">
              <Progress value={fundingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {fundingProgress}% of {formatCurrency(campaignTarget)} goal
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueInvestorCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{investments.length} total investments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funds Released</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFundsReleased)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalRaised > 0 ? ((totalFundsReleased / totalRaised) * 100).toFixed(1) : "0"}% of total raised
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedMilestones}/{milestones.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((completedMilestones / milestones.length) * 100).toFixed(0)}% completed
            </p>
            {pendingProofs > 0 && (
              <p className="text-xs text-amber-500 mt-1 font-medium">
                {pendingProofs} pending proof{pendingProofs > 1 ? "s" : ""} to review
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Investors and Milestones */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="milestones" className="relative">
            Milestones
            {pendingProofs > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {pendingProofs}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="investors" className="space-y-4">
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search investors..."
                className="pl-8 border-border"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <SelectTrigger className="border-border">
                  <div className="flex items-center">
                    <span>Sort by</span>
                    {getSortIcon()}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead>Investor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telegram</TableHead>
                  <TableHead>Total Invested</TableHead>
                  <TableHead>Investments</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody key={currentPage}>
                {currentGroupedInvestors.map((group) => (
                  <>
                    <TableRow key={group.key} className="border-t border-border">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleExpandInvestor(group.key)}
                        >
                          {expandedInvestorsSet.has(group.key) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{group.investor.investorName}</TableCell>
                      <TableCell>{group.investor.email}</TableCell>
                      <TableCell>{group.investor.telegram}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(group.totalInvested)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{group.investments.length}</Badge>
                      </TableCell>
                      <TableCell>{group.investor.nationality}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary"
                              disabled={campaignStatus !== "active"}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleAddUpdate(group.investor)}
                              disabled={isTargetReached}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Add Investment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {/* Expanded view showing individual investments */}
                    {expandedInvestorsSet.has(group.key) && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={8} className="p-0">
                          <div className="px-4 py-2">
                            <h4 className="text-sm font-medium mb-2">Investment History</h4>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/50">
                                  <TableHead>Date</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Wallet Address</TableHead>
                                  <TableHead>Second Wallet</TableHead>
                                  <TableHead className="w-[120px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody key={group.key}>
                                {/* Sort investments by date (newest first) */}
                                {[...group.investments]
                                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .map((investment) => (
                                    <TableRow key={investment.id}>
                                      <TableCell>{formatDate(investment.date)}</TableCell>
                                      <TableCell>{investment.amountInvested}</TableCell>
                                      <TableCell className="font-mono text-xs truncate max-w-[150px]">
                                        {investment.walletAddress}
                                      </TableCell>
                                      <TableCell className="font-mono text-xs truncate max-w-[150px]">
                                        {investment.secondWallet || "-"}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2"
                                            onClick={() => handleEditInvestment(investment)}
                                            disabled={campaignStatus !== "active"}
                                          >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDeleteInvestment(investment)}
                                            disabled={campaignStatus !== "active"}
                                          >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {groupedInvestors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      {searchQuery ? "No matching investors found" : "No investments found for this campaign"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {groupedInvestors.length > itemsPerPage && (
            <Pagination
              totalItems={groupedInvestors.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Campaign Milestones</h3>
            <div className="text-sm text-muted-foreground">
              Each milestone releases {formatCurrency(campaignTarget / milestones.length)} when verified, regardless of
              campaign status
            </div>
          </div>

          {/* Milestones with Tasks */}
          <div className="space-y-6">
            {milestones.map((milestone) => (
              <Card
                key={milestone.id}
                className={`${highlightedMilestoneId === milestone.id ? "border-amber-300 shadow-md" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">
                        {milestones.indexOf(milestone) + 1}
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {milestone.title}
                          {hasPendingTaskProofs(milestone) && (
                            <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Proofs
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpandMilestone(milestone.id)}
                      className="text-muted-foreground"
                    >
                      {expandedMilestones.has(milestone.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Release Amount</p>
                        <p className="font-semibold">{formatCurrency(milestone.targetAmount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((milestone.targetAmount / campaignTarget) * 100)}% of total funding
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Released</p>
                        <p className="font-semibold">{formatCurrency(milestone.amountReleased)}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((milestone.amountReleased / milestone.targetAmount) * 100)}% of milestone
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Tasks Section */}
                {expandedMilestones.has(milestone.id) && (
                  <div className="px-6 pb-6">
                    <h4 className="text-sm font-semibold mb-4">Tasks</h4>
                    <div className="space-y-4">
                      {milestone.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`border rounded-md p-4 ${
                            task.status === "incomplete"
                              ? "border-amber-500 bg-amber-200"
                              : task.status === "completed"
                                ? "border-green-500 bg-green-200"
                                : task.status === "rejected"
                                  ? "border-red-500 bg-red-200"
                                  : "border-gray-500 bg-gray-200"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getTaskStatusIcon(task)}</div>
                            <div className="flex-1">
                              <h5 className="font-medium">{task.title}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>

                              {/* Proof Status */}
                              {task.proof && (
                                <div className="mt-3 space-y-2">
                                  {task.proof.status === "pending" && (
                                    <div className="bg-amber-100 border border-amber-200 rounded-md p-3">
                                      <p className="text-sm font-medium text-amber-800 flex items-center">
                                        <Clock className="h-4 w-4 mr-1" /> Proof Pending Review
                                      </p>
                                      <p className="text-xs text-amber-700 mt-1">
                                        Submitted on {formatDate(task.proof.submittedDate)}
                                      </p>
                                    </div>
                                  )}

                                  {task.proof.status === "authenticated" && (
                                    <div className="bg-green-100 border border-green-200 rounded-md p-3">
                                      <div>
                                        <p className="text-sm font-medium text-green-800 flex items-center">
                                          <CheckCircle2 className="h-4 w-4 mr-1" /> Proof Authenticated
                                        </p>
                                        <p className="text-xs text-green-700 mt-1">
                                          Submitted on {formatDate(task.proof.submittedDate)}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {task.proof.status === "failed" && (
                                    <div className="bg-red-100 border border-red-200 rounded-md p-3">
                                      <div>
                                        <p className="text-sm font-medium text-red-800 flex items-center">
                                          <XCircle className="h-4 w-4 mr-1" /> Proof Rejected
                                        </p>
                                        <p className="text-xs text-red-700 mt-1">
                                          Submitted on {formatDate(task.proof.submittedDate)}
                                        </p>
                                        {task.proof.rejectionReason && (
                                          <p className="text-xs text-red-700 mt-2 bg-red-50 p-2 rounded">
                                            <span className="font-medium">Reason:</span> {task.proof.rejectionReason}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Task Actions */}
                            <div className="flex gap-2">
                              {task.proof && task.proof.status === "pending" ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => handleViewProof(milestone, task)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Proof
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 text-green-600 border-green-600 hover:bg-green-50"
                                    onClick={() => handleAuthenticateProof(milestone, task)}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => handleRejectProof(milestone, task)}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                task.proof && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => handleViewProof(milestone, task)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Proof
                                  </Button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestone Actions */}
                <CardFooter className="pt-0">
                  <div className="w-full flex justify-end">
                    {milestone.status === "completed" ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Milestone Completed
                      </Badge>
                    ) : milestone.status === "in-progress" ? (
                      <div className="flex gap-2">
                        {hasPendingTaskProofs(milestone) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-amber-600"
                            onClick={() => toggleExpandMilestone(milestone.id)}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Review Pending Proofs
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleCompleteMilestone(milestone)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Complete Milestone
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Investment Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px] border border-border">
          <DialogHeader>
            <DialogTitle>
              {formMode === "new"
                ? "Add New Investment"
                : formMode === "edit"
                  ? "Edit Investment"
                  : "Add Investment Update"}
            </DialogTitle>
            <DialogDescription>
              {formMode === "new"
                ? "Add a new investor to this campaign"
                : formMode === "edit"
                  ? "Edit the investment details"
                  : "Add another investment from the same investor"}
            </DialogDescription>
          </DialogHeader>
          <InvestmentForm
            initialData={selectedInvestment}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            mode={formMode}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Investment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this investment? This action cannot be undone.
              {investmentToDelete && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="font-medium">Investor: {investmentToDelete.investorName}</div>
                  <div className="font-medium">Amount: {investmentToDelete.amountInvested}</div>
                  <div className="font-medium">Date: {formatDate(investmentToDelete.date)}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInvestment} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Milestone Confirmation Dialog */}
      <AlertDialog open={showCompleteMilestoneAlert} onOpenChange={setShowCompleteMilestoneAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Milestone</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this milestone as completed? This will release{" "}
              {milestoneToComplete ? formatCurrency(milestoneToComplete.targetAmount) : ""} of funds.
              {milestoneToComplete && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="font-medium">Milestone: {milestoneToComplete.title}</div>
                  <div className="font-medium">Description: {milestoneToComplete.description}</div>
                  <div className="font-medium">
                    Amount to Release: {formatCurrency(milestoneToComplete.targetAmount)}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompleteMilestone} className="bg-green-500 hover:bg-green-600">
              Complete Milestone
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Task Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="sm:max-w-[700px] border border-border">
          <DialogHeader>
            <DialogTitle>Task Proof</DialogTitle>
            <DialogDescription>
              Proof submitted for task: {selectedProof?.task.title} in milestone: {selectedProof?.milestone.title}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedProof?.task.proof ? (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Submitted:</div>
                  <div className="col-span-3">{formatDate(selectedProof.task.proof.submittedDate)}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Description:</div>
                  <div className="col-span-3">{selectedProof.task.proof.description}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Status:</div>
                  <div className="col-span-3">
                    <Badge
                      variant={
                        selectedProof.task.proof.status === "authenticated"
                          ? "success"
                          : selectedProof.task.proof.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {selectedProof.task.proof.status === "authenticated"
                        ? "Authenticated"
                        : selectedProof.task.proof.status === "failed"
                          ? "Failed"
                          : "Pending"}
                    </Badge>
                  </div>
                </div>
                {selectedProof.task.proof.previousSubmissions && selectedProof.task.proof.previousSubmissions > 0 && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Previous Attempts:</div>
                    <div className="col-span-3">{selectedProof.task.proof.previousSubmissions}</div>
                  </div>
                )}
                {selectedProof.task.proof.rejectionReason && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Rejection Reason:</div>
                    <div className="col-span-3 text-red-600">{selectedProof.task.proof.rejectionReason}</div>
                  </div>
                )}
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Proof Document</h3>
                  <div className="border border-border rounded-md p-4">
                    <a
                      href={selectedProof.task.proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Document
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>

                {selectedProof.task.proof.status === "pending" && (
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleRejectProof(selectedProof.milestone, selectedProof.task)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Proof
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                      onClick={() => handleAuthenticateProof(selectedProof.milestone, selectedProof.task)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve Proof
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No proof has been submitted for this task.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Proof Rejection Dialog with Reason */}
      <Dialog open={showRejectProofDialog} onOpenChange={setShowRejectProofDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Task Proof</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this task proof. This will be sent to the founder via email.
            </DialogDescription>
          </DialogHeader>

          {selectedProof && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <div className="font-medium">Milestone: {selectedProof.milestone.title}</div>
              <div className="font-medium">Task: {selectedProof.task.title}</div>
              <div className="font-medium">Campaign: {campaignName}</div>
              {selectedProof.task.proof && (
                <div className="font-medium">Submitted: {formatDate(selectedProof.task.proof.submittedDate)}</div>
              )}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="proof-rejection-reason">Rejection Reason</Label>
              <Textarea
                id="proof-rejection-reason"
                placeholder="Please explain why this task proof is being rejected..."
                value={proofRejectionReason}
                onChange={(e) => setProofRejectionReason(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectProofDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmRejectProof}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={!proofRejectionReason.trim()}
            >
              <Mail className="mr-2 h-4 w-4" />
              Reject & Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
