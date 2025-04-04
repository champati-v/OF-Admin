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

export function MarketplaceFilters() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search startups..."
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
          <DropdownMenuLabel>Verification Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Verified</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Not Verified</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Blocked</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Featured & Trending</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>Featured</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Trending</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Funding Stage</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Ideation</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Prototype</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>MVP</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Public Beta</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Campaign Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Has Campaign</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>No Campaign</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

