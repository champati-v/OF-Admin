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
import { MoreHorizontal, Eye, Ban, CheckCircle, Pause } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserCounts } from "./user-counts"
import { toast } from "sonner"
import axios from "axios"

// Define the User type
type User = {
  user_id: string
  profilePic?: string
  username?: string
  email?: string
  location?: string
  role: string
  professionalTitle?: string
  status?: "verified" | "Unverified" | "blocked" | "suspended"
}

export function AllUsersManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  // Calculate counts
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "verified" || !u.status).length
  const blockedUsers = users.filter((u) => u.status === "blocked" || u.status === "Unverified").length

  const API_URL = "https://onlyfounders.azurewebsites.net/api/admin/get-all-profiles"

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            user_id: "62684",
          },
        })

        const data = await response.json()
        setUsers(data.profiles || [])

      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [statusLoading])

  const handleViewProfile = (user: User) => {
    setSelectedUser(user)
    setShowProfile(true)
  }

  const handleBlock = async (user: User) => {
    try {
      setStatusLoading(true)
      const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/block/${user.user_id}`, {
        method: "PUT",
        headers: {
          user_id: "62684",
        },
      })

      if (response.status === 200) {
        toast("User blocked successfully")
      }
    } catch (error) {
      console.error("Error blocking user:", error)
      toast("Failed to block user")
    } finally {
      setStatusLoading(false)
    }
  }

  const handleUnblock = async (user: User) => {
    try {
      setStatusLoading(true)
      const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/unblock/${user.user_id}`, {
        method: "PUT",
        headers: {
          user_id: "62684",
        },
      })

      if (response.status === 200) {
        toast("User unblocked successfully")
      }
    } catch (error) {
      console.error("Error unblocking user:", error)
      toast("Failed to unblock user")
    } finally {
      setStatusLoading(false)
    }
  }

  const handleVerify = async (user: User) => {
    try {
      setStatusLoading(true)
      const response = await axios.put(
        `https://onlyfounders.azurewebsites.net/api/admin/change-status/${user.user_id}`,
        {
          status: "verified",
        },
        {
          headers: {
            user_id: "62684",
          },
        }
      );

      if (response.status === 200) {
        toast("User verified successfully")
      }
    } catch (error) {
      console.error("Error verifying user:", error)
      toast("Failed to verify user")
    } finally {
      setStatusLoading(false)
    }
  }

  const handleUnverify = async (user: User) => {
    try {
      setStatusLoading(true)
      const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/unverify/${user.user_id}`, {
        method: "PUT",
        headers: {
          user_id: "62684",
        },
      })

      if (response.status === 200) {
        toast("User unverified successfully")
      }
    } catch (error) {
      console.error("Error unverifying user:", error)
      toast("Failed to unverify user")
    } finally {
      setStatusLoading(false)
    }
  }

  const handleSuspend = async (user: User) => {
    try {
      setStatusLoading(true)
      const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/suspend/${user.user_id}`, {
        method: "PUT",
        headers: {
          user_id: "62684",
        },
      })

      if (response.status === 200) {
        toast("User suspended successfully")
      }
    } catch (error) {
      console.error("Error suspending user:", error)
      toast("Failed to suspend user")
    } finally {
      setStatusLoading(false)
    }
  }

  const handleUnsuspend = async (user: User) => {
    try {
      setStatusLoading(true)
      const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/unsuspend/${user.user_id}`, {
        method: "PUT",
        headers: {
          user_id: "62684",
        },
      })

      if (response.status === 200) {
        toast("User unsuspended successfully")
      }
    } catch (error) {
      console.error("Error unsuspending user:", error)
      toast("Failed to unsuspend user")
    } finally {
      setStatusLoading(false)
    }
  }

  if (loading) return <p>Loading users...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <>
      <UserCounts total={totalUsers} active={activeUsers} blocked={blockedUsers} userType="Users" />

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Professional Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id} className="border-t border-border">
                <TableCell className="font-medium">{user.username || "N/A"}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.location || "N/A"}</TableCell>
                <TableCell>{user.professionalTitle || "N/A"}</TableCell>
                <TableCell>
                  <div
                    className={`capitalize text-center w-[80px] text-xs px-2 py-1 rounded-md ${
                      user.status === "verified"
                        ? "bg-green-500 text-white"
                        : user.status === "Unverified"
                          ? "bg-yellow-500"
                          : user.status === "blocked"
                            ? "bg-red-500 text-white"
                            : user.status === "suspended"
                              ? "bg-orange-400"
                              : "bg-green-500 text-white"
                    }`}
                  >
                    {statusLoading ? "loading..." : user.status}
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
                      <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-green-500"
                        onClick={() => handleVerify(user)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify User
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleBlock(user)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Block User
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-orange-500"
                        onClick={() => handleSuspend(user)}
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Suspend User
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User Profile Dialog */}
      {selectedUser && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-[600px] border border-border">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>Detailed information about {selectedUser.username || "this user"}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedUser.profilePic && (
                <div className="flex justify-center">
                  <img
                    src={selectedUser.profilePic || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{selectedUser.username || "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3">{selectedUser.email || "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Role:</div>
                <div className="col-span-3">
                  <Badge variant="outline" className="capitalize">
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Location:</div>
                <div className="col-span-3">{selectedUser.location || "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Professional Title:</div>
                <div className="col-span-3">{selectedUser.professionalTitle || "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={selectedUser.status === "verified" || !selectedUser.status ? "outline" : "destructive"}
                    className="capitalize"
                  >
                    {selectedUser.status || "verified"}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
