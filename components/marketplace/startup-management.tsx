"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  BadgeCheck,
  Star,
  TrendingUp,
  ChevronDown,
  Globe,
  Github,
  Twitter,
  MessageSquare,
  BookOpen,
  Send,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

// Define the Startup type
type Startup = {
  _id?: string;
  name: string;
  founder: string;
  created: string;
  description: string;
  industry: string;
  location: string;
  members: number;
  website: string | null;
  totalRaised: number;
  fundingStage: string;
  verification: string;
  featuredStatus: string;
  campaign: string;
  startupName: string;
  hasCampaign: boolean;
  teamSize: number;
};

interface Docs {
  socialLinks: {
    website: string;
    twitter: string;
    linkedin: string;
    telegram: string;
    discord: string;
    medium: string;
  };
  pitchDeck: {
    file_url: string;
    file_name: string;
    _id: string;
  }

  pitchDeckText: string;
  pitchDeck_url: string;
  pitchDemoVideo_url: string;
  whitepaper_Url: string;
}

// Mock data for startups
// const startups: Startup[] = [
//   {
//     id: "1",
//     name: "TechInnovate",
//     founder: {
//       id: "1",
//       name: "Alex Johnson",
//     },
//     createdDate: "2023-01-15",
//     totalRaised: "$250,000",
//     fundingStage: "MVP",
//     verificationStatus: "verified",
//     hasCampaign: true,
//     isFeatured: true,
//     isTrending: true,
//     description: "AI-powered software solutions for small businesses",
//     industry: "Software / AI",
//     location: "San Francisco, CA",
//     teamSize: 8,
//     website: "techinnovate.example.com",
//   },
//   {
//     id: "2",
//     name: "GreenSolutions",
//     founder: {
//       id: "2",
//       name: "Sarah Williams",
//     },
//     createdDate: "2023-02-20",
//     totalRaised: "$120,000",
//     fundingStage: "Prototype",
//     verificationStatus: "verified",
//     hasCampaign: true,
//     isFeatured: true,
//     isTrending: false,
//     description: "Sustainable packaging alternatives for e-commerce",
//     industry: "CleanTech",
//     location: "Portland, OR",
//     teamSize: 5,
//     website: "greensolutions.example.com",
//   },
//   {
//     id: "3",
//     name: "HealthAI",
//     founder: {
//       id: "3",
//       name: "Michael Brown",
//     },
//     createdDate: "2023-03-10",
//     totalRaised: "$450,000",
//     fundingStage: "Public Beta",
//     verificationStatus: "verified",
//     hasCampaign: true,
//     isFeatured: false,
//     isTrending: true,
//     description: "AI diagnostics platform for healthcare providers",
//     industry: "HealthTech",
//     location: "Boston, MA",
//     teamSize: 12,
//     website: "healthai.example.com",
//   },
//   {
//     id: "4",
//     name: "UrbanMobility",
//     founder: {
//       id: "5",
//       name: "David Wilson",
//     },
//     createdDate: "2023-05-12",
//     totalRaised: "$180,000",
//     fundingStage: "Prototype",
//     verificationStatus: "not verified",
//     hasCampaign: false,
//     isFeatured: false,
//     isTrending: false,
//     description: "Electric scooter sharing platform for urban areas",
//     industry: "Transportation",
//     location: "Austin, TX",
//     teamSize: 7,
//     website: "urbanmobility.example.com",
//   },
//   {
//     id: "5",
//     name: "CryptoFinance",
//     founder: {
//       id: "4",
//       name: "Emily Davis",
//     },
//     createdDate: "2023-04-05",
//     totalRaised: "$0",
//     fundingStage: "Ideation",
//     verificationStatus: "blocked",
//     hasCampaign: false,
//     isFeatured: false,
//     isTrending: false,
//     description: "Decentralized finance solutions for small businesses",
//     industry: "FinTech / Crypto",
//     location: "Miami, FL",
//     teamSize: 3,
//     website: "cryptofinance.example.com",
//   },
// ]

export function StartupManagement() {
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<Docs[]>([]);
  const [showDocs, setShowDocs] = useState(false);
  const API_URL =
    "https://onlyfounders.azurewebsites.net/api/admin/get-all-startups";

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            user_id: "62684",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStartups(data.startups || []);
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        console.error("Error fetching startups:", errorMessage, error);
      } finally {
        setLoading(false);
        console.log(loading);
      }
    };
    fetchFounders();
  }, [statusLoading]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = async (startup: Startup) => {
    setSelectedStartup(startup);
    setShowDetails(true);
  };

  const handleViewDocs = async (startup: Startup) => {
    try {
      setShowDocs(true);
      const response = await axios.get(
        `https://onlyfounders.azurewebsites.net/api/admin/get-startup-documents/${startup._id}`,
        {
          headers: {
            user_id: "62684",
          },
        }
      );
      setDocs(response.data.documents || []);
    } catch (err) {
      console.log("Error fetching startup documents:", err);
    }
  };

  const handleVerifyUnverify = async (startup: Startup) => {
    try {
      setStatusLoading(true);
      // Check for "Verified" with capital V
      const newStatus =
        startup.verification === "Verified" ? "Unverified" : "Verified";

      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/change-verification-status/${startup._id}/${newStatus}`,
        {
          method: "PATCH", // Keep the original method
          headers: {
            user_id: "62684",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${newStatus.toLowerCase()} startup`);
      }

      const data = await response.json();
      console.log(`${newStatus} startup:`, data.message);

      // This will trigger a refetch of the startups list
      setStatusLoading(false);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error(
        `Error ${
          startup.verification === "Verified" ? "unverifying" : "verifying"
        } startup:`,
        errorMessage
      );
      setError(errorMessage);
      setStatusLoading(false);
    }
  };

  const handleToggleStatus = async (
    startup: Startup,
    newStatus: "Featured" | "Trending"
  ) => {
    try {
      setStatusLoading(true);

      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/change-status/${startup._id}/${newStatus}`,
        {
          method: "PATCH",
          headers: {
            user_id: "62684",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark startup as ${newStatus}`);
      }

      const data = await response.json();
      console.log(`Status updated to ${newStatus}:`, data.message);

      // This will trigger a refetch of the startups list
      setStatusLoading(false);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error(`Error updating startup status:`, errorMessage);
      setError(errorMessage);
      setStatusLoading(false);
    }
  };

  const handleBlockUnblock = (startup: Startup) => {
    // In a real implementation, this would call an API to update the startup's status
    console.log(
      `${startup.verification === "blocked" ? "Unblocking" : "Blocking"} ${
        startup.startupName
      }`
    );
  };

  const handleViewCampaign = (startup: Startup) => {
    // In a real implementation, this would navigate to the campaign page
    console.log(`Viewing campaign for ${startup.name}`);
  };

  const handleToggleFeatured = (startup: Startup) => {
    // In a real implementation, this would call an API to update the startup's featured status
    console.log(
      `${startup.featuredStatus ? "Removing from" : "Adding to"} featured: ${
        startup.name
      }`
    );
  };

  const handleToggleTrending = (startup: Startup) => {
    // In a real implementation, this would call an API to update the startup's trending status
    console.log(
      `${startup.featuredStatus ? "Removing from" : "Adding to"} trending: ${
        startup.name
      }`
    );
  };

  // Helper function to get the appropriate badge variant based on verification status
  const getVerificationBadgeVariant = (status: string) => {
    switch (status) {
      case "verified":
        return "outline";
      case "not verified":
        return "secondary";
      case "blocked":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const iconMap = {
    website: <Globe className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    github: <Github className="w-5 h-5" />,
    telegram: <Send className="w-5 h-5" />,
    discord: <MessageSquare className="w-5 h-5" />,
    medium: <BookOpen className="w-5 h-5" />,
  }

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Startup Name</TableHead>
              <TableHead>Founder</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Total Raised</TableHead>
              <TableHead>Funding Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {startups.map((startup) => (
              <TableRow key={startup._id} className="border-t border-border">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-1">
                    {startup.name}
                    {startup.featuredStatus === "Featured" && (
                      <Star className="h-4 w-4 text-primary ml-1" />
                    )}
                    {startup.featuredStatus === "Trending" && (
                      <TrendingUp className="h-4 w-4 text-primary ml-1" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/users?founder=${startup._id}`}
                    className="text-primary hover:underline"
                  >
                    {startup.name}
                  </Link>
                </TableCell>
                <TableCell>{formatDate(startup.created)}</TableCell>
                <TableCell>{startup.totalRaised}</TableCell>
                <TableCell>{startup.fundingStage}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-1 items-center">
                    <Badge
                      variant={getVerificationBadgeVariant(
                        startup.verification
                      )}
                      className="capitalize"
                    >
                      {loading? 'loading...': startup.verification.replace("-", " ")}
                    </Badge>
                    {startup.featuredStatus && (
                      <Badge
                        variant="outline"
                        className={
                          startup.featuredStatus === "Featured"
                            ? "bg-primary/10"
                            : "bg-blue-500/10"
                        }
                      >
                        {loading? 'loading...' : startup.featuredStatus}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(startup)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Startup
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleViewDocs(startup)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Docs
                      </DropdownMenuItem>

                      {/* {startup.campaign && (
                        <DropdownMenuItem
                          onClick={() => handleViewCampaign(startup)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Campaign
                        </DropdownMenuItem>
                      )} */}
                      <DropdownMenuSeparator />

                      {/* Verify/Unverify option */}
                      {startup.verification !== "blocked" && (
                        <DropdownMenuItem
                          onClick={() => handleVerifyUnverify(startup)}
                          className={
                            startup.verification === "Verified"
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        >
                          <BadgeCheck className="mr-2 h-4 w-4" />
                          {startup.verification === "Verified"
                            ? "Unverify"
                            : "Verify"}
                        </DropdownMenuItem>
                      )}

                      {/* Status dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start font-normal text-sm px-2 py-1.5 h-auto"
                          >
                            <div className="flex items-center">
                              {startup.featuredStatus === "Featured" ? (
                                <Star className="mr-2 h-4 w-4 text-primary" />
                              ) : (
                                <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                              )}
                              <span>
                                {startup.featuredStatus
                                  ? `Status: ${startup.featuredStatus}`
                                  : "Status: Trending (Default)"}
                              </span>
                              <ChevronDown className="ml-auto h-4 w-4" />
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(startup, "Featured")
                            }
                            disabled={startup.featuredStatus === "Featured"}
                            className={
                              startup.featuredStatus === "Featured"
                                ? "text-muted-foreground"
                                : "text-green-500"
                            }
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Mark as Featured
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(startup, "Trending")
                            }
                            disabled={startup.featuredStatus === "Trending"}
                            className={
                              startup.featuredStatus === "Trending"
                                ? "text-muted-foreground"
                                : "text-green-500"
                            }
                          >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Mark as Trending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Featured option */}
                      {/* <DropdownMenuItem
                        onClick={() => handleToggleFeatured(startup)}
                        className={startup.isFeatured ? "text-red-500" : "text-green-500"}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        {startup.isFeatured ? "Remove from Featured" : "Add to Featured"}
                      </DropdownMenuItem> */}

                      {/* Trending option */}
                      {/* <DropdownMenuItem
                        onClick={() => handleToggleTrending(startup)}
                        className={startup.isTrending ? "text-red-500" : "text-green-500"}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        {startup.isTrending ? "Remove from Trending" : "Add to Trending"}
                      </DropdownMenuItem> */}

                      {/* Block/Unblock option */}
                      <DropdownMenuItem
                        onClick={() => handleBlockUnblock(startup)}
                        className={
                          startup.verification === "blocked"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {startup.verification === "blocked" ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Block
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

      {/* Startup Details Dialog */}
      {selectedStartup && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="sm:max-w-[600px] border border-border">
            <DialogHeader>
              <DialogTitle>Startup Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedStartup.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3 flex items-center">
                  {selectedStartup.name}
                  {selectedStartup.featuredStatus && (
                    <Star className="h-4 w-4 text-primary ml-2" />
                  )}
                  {selectedStartup.featuredStatus && (
                    <TrendingUp className="h-4 w-4 text-primary ml-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Founder:</div>
                <div className="col-span-3">
                  <p className="text-primary">{selectedStartup.founder}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Created:</div>
                <div className="col-span-3">
                  {formatDate(selectedStartup.created)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Description:</div>
                <div className="col-span-3">{selectedStartup.description}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="flex gap-2 items-center">
                  <div className="font-medium">Industry:</div>
                  <div className="col-span-3">{selectedStartup.industry}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="font-medium">Location:</div>
                  <div className="col-span-3">{selectedStartup.location}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4"></div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Team Size:</div>
                <div className="col-span-3">
                  {selectedStartup.teamSize} members
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Website:</div>
                <div className="col-span-3">
                  <a
                    href={`https://${selectedStartup.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedStartup.website}
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Total Raised:</div>
                <div className="col-span-3">{selectedStartup.totalRaised}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="flex gap-2 items-center">
                  <div className="font-medium">Stage:</div>
                  <div className="col-span-3">
                    {selectedStartup.fundingStage}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="font-medium">Verification:</div>
                  <div className="col-span-3">
                    <Badge
                      variant={getVerificationBadgeVariant(
                        selectedStartup.verification
                      )}
                      className="capitalize"
                    >
                      {selectedStartup.verification}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4"></div>
            </div>
          </DialogContent>
        </Dialog>
      )}

<Dialog open={showDocs} onOpenChange={setShowDocs}>
  <DialogContent className="sm:max-w-[600px] border border-border">
    <DialogHeader>
      <DialogTitle>Startup Documents</DialogTitle>
    </DialogHeader>

    <div className="space-y-6">
      {/* Social Links Section */}
      <div>
        <p className="text-lg font-semibold mb-2">Social Links</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(docs.socialLinks || {}).map(([key, url]) =>
            url ? (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition"
              >
                {iconMap[key as keyof typeof iconMap]}
                <span className="capitalize">{key}</span>
              </a>
            ) : null
          )}
        </div>
      </div>

      {/* Pitch Deck Section */}
      {docs? (
        <>        
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">Pitch Deck Url</p>
          <a
            href={docs.pitchDeck_Url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {docs.pitchDeck_Url}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">Pitch Deck Text</p>
          <p>{docs.pitchDeckText}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">Pitch demo Video Url</p>
          <a
            href={docs.pitchDemoVideo_Url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {docs.pitchDemoVideo_Url}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">Whitepaper Url</p>
          <a
            href={docs.whitepaper_Url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {docs.whitepaper_Url}
          </a>
        </div>
      </>

      ): (
        <div className="text-sm text-muted-foreground">
          loading...
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>
    </>
  );
}
