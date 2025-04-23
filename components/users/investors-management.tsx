"use client";

import { useEffect, useState } from "react";
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
import { MoreHorizontal, Eye, Ban, CheckCircle, Pause } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserCounts } from "./user-counts";
import { toast } from "sonner";
import axios from "axios";

// Define the Investor type based on API response
type Investor = {
  _id: string;
  user_id: string;
  username: string;
  professionalTitle: string;
  bio?: string;
  location?: string;
  email: string;
  role: string;
  status: string;
  completedStatus: boolean;
  createdAt: string;
  updatedAt: string;
  file_url?: string;
  founderData?: {
    skills: string[];
    socialLinks: Record<string, string>;
    completedStatus: string;
    watchList: string[];
    recentActivity: string[];
    experienceLevel?: string;
  };
};

// Format for display in the table
type FormattedInvestor = {
  id: string;
  user_id: string;
  username?: string;
  createdAt: string;
  email: string;
  totalInvestments: number;
  capitalDeployed: string;
  professionalTitle: string;
  status: string;
  profilePic?: {
    file_url: string;
  }
  location?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: Record<string, string>;
  portfolioValue?: number;
  investorData?: {
    skills: string[];
    socialLinks: Record<string, string>;
    completedStatus: string;
    watchList: string[];
    recentActivity: string[];
    experienceLevel?: string;
  };
};

export function InvestorsManagement() {
  const [selectedInvestor, setSelectedInvestor] =
    useState<FormattedInvestor | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [investors, setInvestors] = useState<FormattedInvestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch(
          "https://onlyfounders.azurewebsites.net/api/admin/profiles/Investor",
          {
            headers: {
              user_id: "62684",
            },
          }
        );

        const data = await response.json();
        setInvestors(data.profiles || []);

      } catch (err) {
        console.error("Error fetching investors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, [statusLoading]);

  // Calculate counts
  const totalInvestors = investors.length;
  const verifiedInvestors = investors.filter((i) => i.status === "verified").length;
  const blockedInvestors = investors.filter((i) => i.status === "blocked").length;
  const suspendedInvestors = investors.filter((i) => i.status === "suspended").length;
  const unverifiedInvestors = investors.filter((i) => i.status === "Unverified").length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewProfile = (investor: FormattedInvestor) => {
    setSelectedInvestor(investor);
    setShowProfile(true);
  };


  if (loading) return <p>loading Founders...</p>;

  const handleBlock = async (investor: FormattedInvestor) => {
    try {
      setStatusLoading(true);
      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/block/${investor.user_id}`,
        {
          method: "PUT",
          headers: {
            user_id: "62684",
          },
        }
      );

      if (response.status == 200) {
        toast("Founder blocked successfully");
      }
    } catch (error) {
      console.error("Error blocking founder:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleVerify = async (investor: FormattedInvestor) => {
    try {
      setStatusLoading(true);
      console.log("Verifying investor:", investor.user_id);
      const response = await axios.put(
        `https://onlyfounders.azurewebsites.net/api/admin/change-status/${investor.user_id}`,
        {
          status: "verified",
        },
        {
          headers: {
            user_id: "62684",
          },
        }
      );

      if (response.status == 200) {
        toast("Founder Verified successfully!");
      }
    } catch (error) {
      console.error("Error verifying founder:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSuspend = async (investor: FormattedInvestor) => {
    try {
      setStatusLoading(true);
      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/suspend/${investor.user_id}`,
        {
          method: "PUT",
          headers: {
            user_id: "62684",
          },
        }
      );

      if (response.status == 200) {
        toast("Founder suspended successfully");
      }
    } catch (error) {
      console.error("Error blocking founder:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  // Add the new handler function
  const handleViewDashboard = (investor: FormattedInvestor) => {
    // In a real implementation, this would navigate to the investor's dashboard
    console.log(`Viewing dashboard for ${investor.username}`);
  };

  return (
    <>
      <UserCounts
        total={totalInvestors}
        verified={verifiedInvestors}
        blocked={blockedInvestors}
        suspended={suspendedInvestors}
        unverified={unverifiedInvestors}
        userType="Investors"
      />
      
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
                investors.map((investor, index) => (
                  <TableRow
                    key={index}
                    className="border-t border-border"
                  >
                    <TableCell className="font-medium">
                      {investor.username}
                    </TableCell>
                    <TableCell>{investor.email}</TableCell>
                    <TableCell>{formatDate(investor.createdAt)}</TableCell>
                    <TableCell>{investor.totalInvestments}</TableCell>
                    <TableCell>{investor.location}</TableCell>
                    <TableCell>{investor.professionalTitle}</TableCell>
                    <TableCell>
                    <div
                    className={`capitalize text-center w-[80px] text-xs px-2 py-1 rounded-md ${
                      investor.status === "verified"
                        ? "bg-green-500 text-white"
                        : investor.status === "Unverified"
                        ? "bg-yellow-500"
                        : investor.status === "blocked"
                        ? "bg-red-500 text-white"
                        : investor.status === "suspended"
                        ? "bg-orange-400"
                        : ""
                    }`}
                  >
                    {statusLoading ? "loading..." : investor.status}
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
                            onClick={() => handleViewProfile(investor)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-green-500"
                            onClick={() => handleVerify(investor)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify Founder
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleBlock(investor)}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Block Founder
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-orange-500"
                            onClick={() => handleSuspend(investor)}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Suspend Founder
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

      {/* Investor Profile Dialog */}
      {selectedInvestor && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-[600px] border border-border">
            <DialogHeader>
              <DialogTitle>Investor Profile</DialogTitle>
              <DialogDescription>
                Investment history and details for {selectedInvestor.username}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedInvestor.profilePic && (
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full overflow-hidden">
                    <img
                      src={selectedInvestor.profilePic.file_url || "/placeholder.svg"}
                      alt={selectedInvestor.username}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{selectedInvestor.username}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3"><a href={`mailto:${selectedInvestor.email}`} target="_blank" className="text-blue-600"> {selectedInvestor.email}</a></div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">LinkedIn:</div>
                  <div className="col-span-3"><a href={selectedInvestor.investorData?.socialLinks?.Linkedin} className="text-blue-600" target="_blank">{selectedInvestor.investorData?.socialLinks?.Linkedin}</a></div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">Twitter:</div>
                  <div className="col-span-3"><a href={selectedInvestor.investorData?.socialLinks?.Twitter} className="text-blue-600" target="_blank">{selectedInvestor.investorData?.socialLinks?.Twitter}</a></div>
              </div>

              {selectedInvestor.location && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Location:</div>
                  <div className="col-span-3">{selectedInvestor.location}</div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Joined:</div>
                <div className="col-span-3">
                  {formatDate(selectedInvestor.createdAt)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={
                      selectedInvestor.status === "verified"
                        ? "outline"
                        : selectedInvestor.status === "blocked" ||
                          selectedInvestor.status === "suspended"
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

            
              {selectedInvestor.skills &&
                selectedInvestor.skills.length > 0 && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="font-medium">Skills:</div>
                    <div className="col-span-3 flex flex-wrap gap-1">
                      {selectedInvestor.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="capitalize"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
