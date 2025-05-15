"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter } from "lucide-react"

export function CampaignFilters() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search campaigns..."
          className="w-[200px] sm:w-[300px] pl-8 border-border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="border-border">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] border-border">
          <DropdownMenuLabel>Campaign Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Live</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Closed</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Featured & Trending</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>Featured</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Trending</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Newest First</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Oldest First</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Target Amount (High to Low)</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Target Amount (Low to High)</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
