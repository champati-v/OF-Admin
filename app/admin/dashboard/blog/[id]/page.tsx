"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Bold, Italic, UnderlineIcon, List, ListOrdered, Palette, ArrowLeft } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import FontSize from "@tiptap/extension-font-size"
import Link from "@tiptap/extension-link"
import { EmojiPicker } from "./emoji-picker"
import { use } from "react"

// Predefined categories
const BLOG_CATEGORIES = [
  "Networking",
  "Marketing & Growth",
  "Business Development",
  "Fund Raising",
  "Go-to-Market",
  "Tokenomics",
  "Community",
  "User Engagement",
  "Legal and Regulations",
  "Industry Insights",
  "Best Practices",
  "Case Studies",
  "Product development",
  "Mental Health",
]

export default function BlogEditor({ params }: { params: Promise<{ id: string }> }) {
  const [title, setTitle] = useState("")
  const [headerImage, setHeaderImage] = useState<File | null>(null)
  const [headerImageSrc, setHeaderImageSrc] = useState<string>("")
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { id } = use(params)

  // Store original categories to track changes
  const originalCategoriesRef = useRef<string[]>([])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
      }),
      Underline,
      TextStyle,
      Color,
      FontSize.configure({
        types: ["textStyle"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog post...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[500px] p-4 border rounded-md focus:outline-none prose prose-sm max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      // This is just to ensure the editor updates properly
    },
  })

  // Fetch blog data if blogId is provided
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const response = await fetch(`https://onlyfounders.azurewebsites.net/api/blog/get-blog-by-id/${id}`, {
          headers: {
            user_id: "52525",
          },
        })

        if (response.ok) {
          const blogData = await response.json()
          const data = blogData.blog

          console.log("Fetched blog data:", data)

          // Set form fields with fetched data
          setTitle(data.title || "")
          setDescription(data.description || "")

          // Handle categories
          if (data.categories && Array.isArray(data.categories)) {
            // Process categories for checkbox selection
            const processedCategories = data.categories
              .map((cat: string) => cat.replace(/^"(.*)"$/, "$1").trim())
              .flatMap((cat: string) => cat.split(",").map((c) => c.trim()))
              .filter((cat: string) => cat !== "")

            setSelectedCategories(processedCategories)
            // Store original categories for comparison later
            originalCategoriesRef.current = [...processedCategories]
          }

          // Set editor content when editor is ready
          if (editor && data.content) {
            console.log("Setting editor content:", data.content)
            editor.commands.setContent(data.content)
          }

          // Handle header image if it exists
          if (data.headerImage && data.headerImage.file_url) {
            console.log("Setting header image:", data.headerImage.file_url)
            setHeaderImageSrc(data.headerImage.file_url)
          }

          setIsEditMode(true)
        } else {
          console.log("Failed to fetch blog data")
        }
      } catch (error) {
        console.error("Error fetching blog data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogData()
  }, [id])

  // Update editor content when editor becomes available
  useEffect(() => {
    const updateEditorContent = async () => {
      if (!editor || !id) return

      try {
        const response = await fetch(`https://onlyfounders.azurewebsites.net/api/blog/get-blog-by-id/${id}`, {
          headers: {
            user_id: "52525",
          },
        })

        if (response.ok) {
          const blogData = await response.json()
          const data = blogData.blog

          if (data.content) {
            console.log("Updating editor content:", data.content)
            editor.commands.setContent(data.content)
          }
        }
      } catch (error) {
        console.error("Error updating editor content:", error)
      }
    }

    updateEditorContent()
  }, [editor, id])

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeaderImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setHeaderImageSrc(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => {
        if (prev.includes(category)) return prev
        return [...prev, category]
      })
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category))
    }
  }

  const handleLinkSubmit = () => {
    if (editor && linkUrl) {
      if (linkText) {
        // If we have link text, insert it as a new link
        editor.chain().focus().insertContent(`<a href="${linkUrl}" target="_blank">${linkText}</a>`).run()
      } else {
        // Otherwise, convert the selected text to a link
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }

      // Reset and close dialog
      setLinkUrl("")
      setLinkText("")
      setLinkDialogOpen(false)
    }
  }

  const handleSubmit = async () => {
    if (!editor || !title) return

    setIsSubmitting(true)

    try {
      // Prepare form data
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)

      // Get unique categories to send to the backend
      const uniqueCategories = Array.from(new Set(selectedCategories))

      // Append each category to the form data
      uniqueCategories.forEach((category) => {
        formData.append("categories", category)
      })

      formData.append("content", editor.getHTML())
      if (headerImage) {
        formData.append("headerImage", headerImage)
      }

      console.log("Sending categories:", uniqueCategories)

      let response

      // Use PUT API for updating, POST for creating new
      if (isEditMode && id) {
        response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/edit-blog/${id}`, {
          method: "PUT",
          headers: {
            user_id: "62684",
          },
          body: formData,
        })
      } else {
        response = await fetch("https://onlyfounders.azurewebsites.net/api/admin/add-blog", {
          method: "POST",
          headers: {
            user_id: "62684",
          },
          body: formData,
        })
      }

      if (response.ok) {
        // Reset the form if not in edit mode
        if (!isEditMode) {
          setTitle("")
          setDescription("")
          setHeaderImage(null)
          setHeaderImageSrc("")
          setSelectedCategories([])
          editor.commands.clearContent()
        } else {
          // Update original categories reference after successful edit
          originalCategoriesRef.current = [...uniqueCategories]
        }
        setShowPreview(false)
        alert(isEditMode ? "Blog post updated successfully!" : "Blog post submitted successfully!")
      } else {
        alert(isEditMode ? "Failed to update blog post" : "Failed to submit blog post")
      }
    } catch (error) {
      console.error("Error submitting blog post:", error)
      alert("An error occurred while submitting the blog post")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-8 text-center">Loading blog data...</div>
  }

  if (!editor) {
    return null
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</h1>
        <a
          href="/admin/dashboard/blog"
          className="flex items-center gap-2 bg-black text-white hover:bg-black/80 transition-all duration-200 rounded-md px-2 py-1 "
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </a>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <Label htmlFor="title" className="block mb-2">
            Blog Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="header-image" className="block mb-2">
            Header Image
          </Label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Input
                id="header-image"
                type="file"
                accept="image/*"
                onChange={handleHeaderImageUpload}
                className="w-full"
              />
            </div>
            {headerImageSrc && (
              <div className="w-24 h-24 relative overflow-hidden rounded-md border">
                <img
                  src={headerImageSrc || "/placeholder.svg"}
                  alt="Header preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="block mb-2">
            Description
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter blog description"
            className="w-full min-h-[80px] p-2 border rounded-md"
          />
        </div>

        <div>
          <Label className="block mb-2">Categories</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border rounded-md p-3">
            {BLOG_CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 bg-white border rounded-md shadow-sm">
        <div className="flex flex-wrap items-center gap-1 p-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-black/10" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-black/10" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-black/10" : ""}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <span className="text-xs">Font Size</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="grid gap-1">
                {["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"].map((size) => (
                  <Button
                    key={size}
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setFontSize(size).run()}
                  >
                    <span style={{ fontSize: size }}>{size}</span>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-black/10" : ""}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-black/10" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-8 gap-1">
                {[
                  "#000000",
                  "#434343",
                  "#666666",
                  "#999999",
                  "#b7b7b7",
                  "#cccccc",
                  "#d9d9d9",
                  "#efefef",
                  "#f3f3f3",
                  "#ffffff",
                  "#980000",
                  "#ff0000",
                  "#ff9900",
                  "#ffff00",
                  "#00ff00",
                  "#00ffff",
                  "#4a86e8",
                  "#0000ff",
                  "#9900ff",
                  "#ff00ff",
                  "#e6b8af",
                  "#f4cccc",
                  "#fce5cd",
                  "#fff2cc",
                  "#d9ead3",
                  "#d0e0e3",
                  "#c9daf8",
                  "#cfe2f3",
                  "#d9d2e9",
                  "#ead1dc",
                  "#dd7e6b",
                  "#ea9999",
                  "#f9cb9c",
                  "#ffe599",
                  "#b6d7a8",
                  "#a2c4c9",
                  "#a4c2f4",
                  "#9fc5e8",
                  "#b4a7d6",
                  "#d5a6bd",
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-md border"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLinkDialogOpen(true)}
            className={editor.isActive("link") ? "bg-black/10" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-link"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <span className="text-lg">😊</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <EmojiPicker
                onEmojiSelect={(emoji) => {
                  editor.chain().focus().insertContent(emoji).run()
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <EditorContent editor={editor} />
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" className="mr-2" onClick={() => editor.commands.clearContent()}>
          Clear
        </Button>
        <Button onClick={() => setShowPreview(true)}>Preview</Button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title || "Untitled Blog Post"}</DialogTitle>
            <DialogDescription>Preview your blog post before submitting</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {headerImageSrc && (
              <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
                <img src={headerImageSrc || "/placeholder.svg"} alt="Header" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-2xl font-bold mb-2">{title || "Untitled Blog Post"}</h1>
            {description && <p className="text-gray-600 mb-4">{description}</p>}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map((category, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            )}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Continue Editing
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEditMode ? "Update Blog" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Add a URL and optional display text for your link.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="text">Display Text (optional)</Label>
              <Input
                id="text"
                placeholder="Click here"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Leave empty to use selected text</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkSubmit}>Insert Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
