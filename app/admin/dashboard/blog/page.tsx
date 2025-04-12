"use client"

import type React from "react"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Image from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"
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
import { Bold, Italic, UnderlineIcon, List, ListOrdered, ImageIcon, YoutubeIcon, Palette } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import FontSize from "@tiptap/extension-font-size"
import Link from "@tiptap/extension-link"
import { EmojiPicker } from "./emoji-picker"

export default function BlogEditor() {
  const [title, setTitle] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

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
      Image,
      Youtube,
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
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && editor) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result && editor) {
          editor
            .chain()
            .focus()
            .setImage({ src: event.target.result as string })
            .run()
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleYoutubeEmbed = () => {
    if (editor) {
      const url = prompt("Enter YouTube URL")
      if (url) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run()
      }
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && editor) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)

      editor
        .chain()
        .focus()
        .insertContent(`
        <video controls width="100%">
          <source src="${url}" type="${file.type}">
          Your browser does not support the video tag.
        </video>
      `)
        .run()
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
      // Parse categories into an array
      const categoriesArray = categories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat !== "")

      // Prepare the data to be sent to the backend
      const blogData = {
        title,
        description,
        categories: categoriesArray,
        content: editor.getHTML(), // Store as HTML to preserve formatting
      }

      // Send the data to the backend
      const response = await fetch("http://localhost:5000/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      })

      if (response.ok) {
        // Reset the form
        setTitle("")
        setDescription("")
        setCategories("")
        editor.commands.clearContent()
        setShowPreview(false)
        alert("Blog post submitted successfully!")
      } else {
        alert("Failed to submit blog post")
      }
    } catch (error) {
      console.error("Error submitting blog post:", error)
      alert("An error occurred while submitting the blog post")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>

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
          <Label htmlFor="categories" className="block mb-2">
            Categories (comma separated)
          </Label>
          <Input
            id="categories"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="tech, news, tutorial"
            className="w-full"
          />
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

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => document.getElementById("video-upload")?.click()}
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
                className="lucide lucide-video"
              >
                <path d="m22 8-6 4 6 4V8Z"></path>
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
              </svg>
            </Button>
            <Input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
          </div>

          <Button variant="ghost" size="sm" onClick={handleYoutubeEmbed}>
            <YoutubeIcon className="h-4 w-4" />
          </Button>

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
            <h1 className="text-2xl font-bold mb-2">{title || "Untitled Blog Post"}</h1>
            {description && <p className="text-gray-600 mb-4">{description}</p>}
            {categories && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.split(",").map((category, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {category.trim()}
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
              {isSubmitting ? "Submitting..." : "Submit"}
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
