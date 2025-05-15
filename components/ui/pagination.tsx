"use client"

import type React from "react"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) return null

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate range of pages to show around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push("ellipsis1")
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis2")
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="h-8 w-8 border-border"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis1" || page === "ellipsis2") {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="outline"
                size="icon"
                disabled
                className="h-8 w-8 border-border"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More Pages</span>
              </Button>
            )
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page as number)}
              className="h-8 w-8 border-border"
            >
              {page}
              <span className="sr-only">Page {page}</span>
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="h-8 w-8 border-border"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  )
}

export const PaginationContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center space-x-2">{children}</div>
}

export const PaginationItem = ({ active, children }: { active?: boolean; children: React.ReactNode }) => {
  return (
    <Button variant={active ? "default" : "outline"} size="icon" className="h-8 w-8 border-border">
      {children}
    </Button>
  )
}

export const PaginationLink = ({
  children,
  href,
  onClick,
}: { children: React.ReactNode; href: string; onClick: (e: any) => void }) => {
  return (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  )
}

export const PaginationEllipsis = () => {
  return (
    <Button variant="outline" size="icon" disabled className="h-8 w-8 border-border">
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More Pages</span>
    </Button>
  )
}

export const PaginationPrevious = ({
  href,
  onClick,
  disabled,
}: { href: string; onClick: (e: any) => void; disabled: boolean }) => {
  return (
    <Button variant="outline" size="icon" onClick={onClick} disabled={disabled} className="h-8 w-8 border-border">
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous Page</span>
    </Button>
  )
}

export const PaginationNext = ({
  href,
  onClick,
  disabled,
}: { href: string; onClick: (e: any) => void; disabled: boolean }) => {
  return (
    <Button variant="outline" size="icon" onClick={onClick} disabled={disabled} className="h-8 w-8 border-border">
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next Page</span>
    </Button>
  )
}
