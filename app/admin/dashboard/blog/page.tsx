"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react"

interface Blog {
  _id: string
  title: string
  description: string
  content: string
  categories: string[]
  headerImage?: {
    file_url: string
  }
  createdAt: string
  updatedAt: string
  isTrending?: boolean
  isFeatured?: boolean
}

export default function BlogManagement() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [blogToUpdateStatus, setBlogToUpdateStatus] = useState<Blog | null>(null)
  const [blogStatus, setBlogStatus] = useState<"none" | "trending" | "featured">("none")
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch all blogs
  const fetchBlogs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://onlyfounders.azurewebsites.net/api/admin/get-all-blogs", {
        headers: {
          user_id: "62684",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch blogs")
      }
      const data = await response.json()
      setBlogs(Array.isArray(data) ? data : data.blogs || [])
      console.log(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching blogs")
      console.error("Error fetching blogs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  // Handle creating a new blog
  const handleCreateBlog = () => {
    router.push("/admin/dashboard/blog/1")
  }

  // Handle editing a blog
  const handleEditBlog = (blogId: string) => {
    router.push(`/admin/dashboard/blog/${blogId}`)
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (blogId: string) => {
    setBlogToDelete(blogId)
    setDeleteDialogOpen(true)
  }

  // Handle deleting a blog
  const handleDeleteBlog = async () => {
    if (!blogToDelete) return
    setIsDeleting(true)
    try {
      const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/delete-blog/${blogToDelete}`, {
        method: "DELETE",
        headers: {
          user_id: "62684",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog")
      }

      // Remove the deleted blog from the state
      setBlogs(blogs.filter((blog) => blog._id !== blogToDelete))
      setDeleteDialogOpen(false)
      setBlogToDelete(null)
      setIsDeleting(false)
    } catch (err) {
      console.error("Error deleting blog:", err)
      alert("Failed to delete blog. Please try again.")
    }
  }

  // Open status update dialog
  // const openStatusDialog = (blog: Blog) => {
  //   setBlogToUpdateStatus(blog)

  //   // Set initial status based on blog properties
  //   if (blog.isTrending) {
  //     setBlogStatus("trending")
  //   } else if (blog.isFeatured) {
  //     setBlogStatus("featured")
  //   } else {
  //     setBlogStatus("none")
  //   }

  //   setStatusDialogOpen(true)
  // }

  // Handle updating blog status (trending/featured)
  const handleUpdateStatus = async () => {
    if (!blogToUpdateStatus) return

    // Convert radio selection to boolean flags
    const isTrending = blogStatus === "trending"
    const isFeatured = blogStatus === "featured"

    try {
      const response = await fetch(
        `https://onlyfounders.azurewebsites.net/api/admin/update-blog-status/${blogToUpdateStatus._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            user_id: "62684",
          },
          body: JSON.stringify({
            isTrending,
            isFeatured,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update blog status")
      }

      // Update the blog in the state
      setBlogs(blogs.map((blog) => (blog._id === blogToUpdateStatus._id ? { ...blog, isTrending, isFeatured } : blog)))

      setStatusDialogOpen(false)
      setBlogToUpdateStatus(null)
    } catch (err) {
      console.error("Error updating blog status:", err)
      alert("Failed to update blog status. Please try again.")
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button onClick={handleCreateBlog} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Create New Blog
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading blogs...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
          <Button variant="outline" className="ml-4" onClick={fetchBlogs}>
            Try Again
          </Button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-8">No blogs found. Create your first blog!</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Header Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[200px]">Categories</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs?.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>
                    {blog.headerImage ? (
                      <div className="w-16 h-16 relative overflow-hidden rounded-md">
                        <img
                          src={blog.headerImage.file_url || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">{blog.title}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {blog.isTrending && <Badge variant="secondary">Trending</Badge>}
                      {blog.isFeatured && <Badge>Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {blog.categories.map((category) => (
                        <Badge key={category} variant="outline" className="mb-1 whitespace-normal">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(blog.createdAt)}</TableCell>
                  <TableCell>{formatDate(blog.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        className="flex items-center gap-2 hover:bg-black hover:text-white cursor-pointer transition-all duration-200"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBlog(blog._id)}
                      >
                        <Pencil /> Edit
                      </Button>
                      <Button
                        className="flex items-center gap-2 hover:bg-red-500 hover:text-white cursor-pointer transition-all duration-200"
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(blog._id)}
                      >
                        <Trash /> Delete
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {/* <DropdownMenuItem onClick={() => openStatusDialog(blog)}>
                            Set Status (Trending/Featured)
                          </DropdownMenuItem> */}
                          <DropdownMenuItem onClick={() => handleEditBlog(blog._id)}>Edit Blog</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(blog._id)}>
                            Delete Blog
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={isDeleting} onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={handleDeleteBlog}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Blog Status</DialogTitle>
            <DialogDescription>Set the visibility status for this blog.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup
              value={blogStatus}
              onValueChange={(value) => setBlogStatus(value as "none" | "trending" | "featured")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trending" id="trending" />
                <Label htmlFor="trending">Trending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="featured" id="featured" />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
