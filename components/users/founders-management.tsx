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
import { MoreHorizontal, Eye, Ban, CheckCircle, Pause, Target } from "lucide-react";
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

// Define the Founder type
type Founder = {
  _id: string;
  user_id: string;
  username: string;
  email?: string;
  bio: string;
  createdAt: string;
  status: "verified" | "Unverified" | "blocked" | "suspended";
  location?: string;
  professionalTitle?: string;
  profilePic?: {
    file_url: string;
  };
  totalCampaigns?: number;
  totalRaised?: number;
  founderData: {
    socialLinks: {
      Twitter?: string;
    };
  };
  startup_id: string;
};

export function FoundersManagement() {
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [founder, setFounder] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  // Calculate counts

  const totalFounders = founder.length;
  const verifiedFounders = founder.filter((f) => f.status === "verified").length;
  const blockedFounders = founder.filter((f) => f.status === "blocked").length;
  const suspendedFounders = founder.filter((f) => f.status === "suspended").length;
  const unverifiedFounders = founder.filter((f) => f.status === "Unverified").length;

  const API_URL =
    "https://onlyfounders.azurewebsites.net/api/admin/profiles/Founder";

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            user_id: "62684",
          },
        });
        const data = await response.json();
        setFounder(data.profiles || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
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

  const handleViewProfile = (founder: Founder) => {
    setSelectedFounder(founder);
    setShowProfile(true);
  };

  if (loading) return <p>loading Founders...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleBlock = async (founder: Founder) => {
    try {
      setStatusLoading(true);
      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/block/${founder.user_id}`,
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

  const handleVerify = async (founder: Founder) => {
    try {
      setStatusLoading(true);
      console.log("Verifying founder:", founder.user_id);

      const response = await axios.put(
        `https://onlyfounders.azurewebsites.net/api/admin/change-status/${founder.user_id}`,
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

  const handleSuspend = async (founder: Founder) => {
    try {
      setStatusLoading(true);
      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/suspend/${founder.user_id}`,
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

  // Add new handler functions
  const handleViewStartup = (founder: Founder) => {
    // In a real implementation, this would navigate to the startup page
    console.log(`Viewing startup for ${founder.username}`);
  };

  const handleViewCampaign = (founder: Founder) => {
    // In a real implementation, this would navigate to the campaign page
    console.log(`Viewing campaign for ${founder.username}`);
  };

  // const handleViewDocs = (founder: Founder) => {
  //   setSelectedFounder(founder);
  //   setShowDocs(true);
  // };

  return (
    <>
      <UserCounts
        total={totalFounders}
        verified={verifiedFounders}
        blocked={blockedFounders}
        suspended={suspendedFounders}
        unverified={unverifiedFounders}
        userType="Founders"
      />

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Total Campaigns</TableHead>
              <TableHead>Total Raised</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {founder.map((founder) => (
              <TableRow key={founder._id} className="border-t border-border">
                <TableCell className="font-medium">
                  {founder.username}
                </TableCell>
                <TableCell>{founder.email}</TableCell>
                <TableCell>{formatDate(founder.createdAt)}</TableCell>
                <TableCell>{founder.totalCampaigns ?? "-"}</TableCell>
                <TableCell>{founder.totalRaised ?? "-"}</TableCell>
                <TableCell>
                  <div
                    className={`capitalize text-center w-[80px] text-xs px-2 py-1 rounded-md ${
                      founder.status === "verified"
                        ? "bg-green-500 text-white"
                        : founder.status === "Unverified"
                        ? "bg-yellow-500"
                        : founder.status === "blocked"
                        ? "bg-red-500 text-white"
                        : founder.status === "suspended"
                        ? "bg-orange-400"
                        : ""
                    }`}
                  >
                    {statusLoading ? "loading..." : founder.status}
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
                      <DropdownMenuItem onClick={() => handleViewProfile(founder)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        onClick={() => handleViewStartup(founder)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Startup
                      </DropdownMenuItem> */}
                      {/* <DropdownMenuItem
                        onClick={() => handleViewCampaign(founder)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Campaign
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-green-500"
                        onClick={() => handleVerify(founder)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Founder
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleBlock(founder)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Block Founder
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-orange-500"
                        onClick={() => handleSuspend(founder)}
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Suspend Founder
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Founder Profile Dialog */}
      {selectedFounder && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-[600px] border border-border">
            <DialogHeader>
              <DialogTitle>Founder Profile</DialogTitle>
              <DialogDescription>
                Detailed Documentation for {selectedFounder.username}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{selectedFounder.username}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Title: </div>
                <div className="col-span-3">{selectedFounder.professionalTitle}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3"><a href={`mailto:${selectedFounder.email}`} className="text-blue-600" target="_blank">{selectedFounder.email}</a></div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Twitter: </div>
                <div className="col-span-3"><a className="text-blue-600" href={selectedFounder.founderData?.socialLinks?.Twitter} target="_blank">{selectedFounder.founderData?.socialLinks?.Twitter}</a></div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Joined:</div>
                <div className="col-span-3">
                  {formatDate(selectedFounder.createdAt)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Bio:</div>
                <div className="col-span-3">
                  {selectedFounder.bio ?? "-"}
                </div>
              </div>
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Total Raised:</div>
                <div className="col-span-3">
                  {selectedFounder.totalRaised ?? "-"}
                </div>
              </div> */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={
                      selectedFounder.status === "verified"
                        ? "outline"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {selectedFounder.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className={`${selectedFounder.startup_id == null? "hidden" : "block"}`}>
              <a href={`https://www.onlyfounders.xyz/marketplace/project/${selectedFounder.startup_id}`} target="_blank" className="text-white px-2 py-1 rounded-md bg-blue-500">View Startup</a>
            </div>

          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
