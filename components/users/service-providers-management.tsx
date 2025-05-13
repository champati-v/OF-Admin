"use client"

import { useState, useEffect, useRef } from "react"
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
import { MoreHorizontal, Eye, Ban, CheckCircle, Pause } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserCounts } from "./user-counts"
import { toast } from "sonner";
import axios from "axios"

// Replace the ServiceProvider type with a type that matches the API response
type ServiceProvider = {
  _id: string
  user_id: string
  role: string
  status: string
  username: string
  email: string
  bio?: string
  location?: string
  professionalTitle?: string
  profilePic?: {
    file_name: string
    file_url: string
    _id: string
  }
  createdAt: string
  updatedAt: string
  serviceProviderData?: {
    buisnessName: string
    nameOfServiceProvider: string
    email: string
    category: string
    serviceDescription: string
    pricingModel: string
    websiteUrl: string
    companySocialLinks: Record<string, string>
    personalSocialLinks: Record<string, string>
    _id: string
    createdAt: string
    updatedAt: string
  }
}

// Replace the mock data with a useState and useEffect to fetch from the API
export function ServiceProvidersManagement() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  const providerModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          providerModalRef.current &&
          !providerModalRef.current.contains(event.target as Node)
        ) {
          setShowProfile(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);


  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const response = await fetch("https://onlyfounders.azurewebsites.net/api/admin/profiles/ServiceProvider", {
          headers: {
            user_id: "62684",
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        setServiceProviders(data.profiles)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching service providers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceProviders()
  }, [statusLoading])


  const handleBlock = async (provider: ServiceProvider) => {
    try {
      setStatusLoading(true);
      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/block/${provider.user_id}`,
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

  const handleVerify = async (provider: ServiceProvider) => {
    try {
      setStatusLoading(true);
      console.log("Verifying founder:", provider.user_id);
      const response = await axios.put(
        `https://onlyfounders.azurewebsites.net/api/admin/change-status/${provider.user_id}`,
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

  const handleSuspend = async (provider: ServiceProvider) => {
    try {
      setStatusLoading(true);
      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/suspend/${provider.user_id}`,
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

  // Calculate counts
  const totalProviders = serviceProviders.length
  const verifiedProviders = serviceProviders.filter((p) => p.status === "Verified").length
  const blockedProviders = serviceProviders.filter((p) => p.status?.toLowerCase() === "blocked").length
  const suspendedProviders = serviceProviders.filter((p) => p.status?.toLowerCase() === "suspended").length
  const unverifiedProviders = serviceProviders.filter((p) => p.status?.toLowerCase() === "unverified").length

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
    console.log(`${provider.status?.toLowerCase() === "suspended" ? "Unblocking" : "Blocking"} ${provider.username}`)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading service providers...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4 border border-red-300 rounded">Error: {error}</div>
  }

  return (
    <>
      <UserCounts
        total={totalProviders}
        verified={verifiedProviders}
        blocked={blockedProviders}
        suspended={suspendedProviders}
        unverified={unverifiedProviders}
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
              <TableRow key={provider._id} className="border-t border-border">
                <TableCell className="font-medium">{provider.username}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>{formatDate(provider.createdAt)}</TableCell>
                <TableCell>
                <div
                    className={`capitalize text-center w-[80px] text-xs px-2 py-1 rounded-md ${
                      provider.status === "verified"
                        ? "bg-green-500 text-white"
                        : provider.status === "Unverified"
                        ? "bg-yellow-500"
                        : provider.status === "blocked"
                        ? "bg-red-500 text-white"
                        : provider.status === "suspended"
                        ? "bg-orange-400"
                        : ""
                    }`}
                  >
                      {statusLoading ? "loading..." : provider.status}
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
                      <DropdownMenuItem onClick={() => handleViewProfile(provider)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem className="text-green-500" onClick={() => handleVerify(provider)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                         Verify Founder
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-red-500" onClick={() => handleBlock(provider)}>
                        <Ban className="mr-2 h-4 w-4" />
                         Block Founder
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-orange-500" onClick={() => handleSuspend(provider)}>
                        <Pause className="mr-2 h-4 w-4" />
                         Suspend Founder
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
     {showProfile && selectedProvider && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          ref={providerModalRef}
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-screen-sm p-6 border border-border overflow-y-auto max-h-screen relative"
        >
          <button
            onClick={() => setShowProfile(false)}
            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
          >
            ✕
          </button>

          <h2 className="text-xl font-semibold mb-2">Service Provider Profile</h2>
          <p className="text-muted-foreground mb-4">
            Profile details for {selectedProvider.username}
          </p>

          <div className="grid gap-4">
            {selectedProvider.profilePic && (
              <div className="flex justify-center">
                <img
                  src={selectedProvider.profilePic.file_url || "/placeholder.svg"}
                  alt={`${selectedProvider.username}'s profile`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-3">{selectedProvider.username}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Email:</div>
              <div className="col-span-3">{selectedProvider.email}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">User ID:</div>
              <div className="col-span-3">{selectedProvider.user_id}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Joined:</div>
              <div className="col-span-3">{formatDate(selectedProvider.createdAt)}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Status:</div>
              <div className="col-span-3">
                <Badge
                  variant={
                    selectedProvider.status?.toLowerCase() === "suspended" ||
                    selectedProvider.status?.toLowerCase() === "blocked"
                      ? "destructive"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {selectedProvider.status}
                </Badge>
              </div>
            </div>

            {selectedProvider.professionalTitle && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Title:</div>
                <div className="col-span-3">{selectedProvider.professionalTitle}</div>
              </div>
            )}

            {selectedProvider.location && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Location:</div>
                <div className="col-span-3">{selectedProvider.location}</div>
              </div>
            )}

            {selectedProvider.bio && (
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Bio:</div>
                <div className="col-span-3">{selectedProvider.bio}</div>
              </div>
            )}

            {selectedProvider.serviceProviderData && (
              <div className="mt-2">
                <h3 className="text-lg font-medium mb-2">Service Details</h3>
                <div className="rounded-md border border-border p-4 space-y-2">
                  {selectedProvider.serviceProviderData.buisnessName && (
                    <div>
                      <span className="font-medium">Business Name:</span>{" "}
                      {selectedProvider.serviceProviderData.buisnessName}
                    </div>
                  )}
                  {selectedProvider.serviceProviderData.category && (
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedProvider.serviceProviderData.category}
                    </div>
                  )}
                  {selectedProvider.serviceProviderData.pricingModel && (
                    <div>
                      <span className="font-medium">Pricing Model:</span>{" "}
                      {selectedProvider.serviceProviderData.pricingModel}
                    </div>
                  )}
                  {selectedProvider.serviceProviderData.serviceDescription && (
                    <div>
                      <span className="font-medium">Service Description:</span>{" "}
                      {selectedProvider.serviceProviderData.serviceDescription}
                    </div>
                  )}
                  {selectedProvider.serviceProviderData.websiteUrl && (
                    <div>
                      <span className="font-medium">Website:</span>{" "}
                      <a
                        href={selectedProvider.serviceProviderData.websiteUrl}
                        className="text-blue-600"
                        target="_blank"
                      >
                        {selectedProvider.serviceProviderData.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
)}

    </>
  )
}
