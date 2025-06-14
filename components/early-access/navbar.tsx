"use client"

import Link from "next/link"
import Image from "next/image"

export function Navbar() {

  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/admin" className="font-semibold">
            <Image
              src="/onlyFounder_logo.svg"
              alt="OnlyFounders"
              width={60}
              height={60}
            />
          </Link>
          <nav className="flex items-center ml-[140px]">
            {/* <Link
              href="dashboard/early-access"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary mr-6",
                pathname.includes("/dashboard/early-access") ? "text-primary font-bold" : "text-muted-foreground",
              )}
            >
              Early Access
            </Link> */}

            {/* <Link
              href="/dashboard/users"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary mr-6",
                pathname.includes("/dashboard/users") ? "text-primary font-bold" : "text-muted-foreground",
              )}
            >
              Users
            </Link>
            <Link
              href="/dashboard/marketplace"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary mr-6",
                pathname.includes("/dashboard/marketplace") ? "text-primary font-bold" : "text-muted-foreground",
              )}
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard/campaigns"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.includes("/dashboard/campaigns") ? "text-primary font-bold" : "text-muted-foreground",
              )}
            >
              Campaigns
            </Link> */}
          </nav>
        </div>
        {/* <div className="flex items-center gap-4">
          <Button onClick={() => router.push('admin/dashboard')} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-300 transition-colors">
            <ArrowLeftSquare className="h-5 w-5" />
            <span>Back</span>
          </Button>
        </div> */}
      </div>
    </header>
  )
}

