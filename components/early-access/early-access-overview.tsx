'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, CheckCircle, XCircle } from "lucide-react"
import { useState, useEffect } from "react";

type EarlyStats = {
  totalEntries: number;
  acceptedEntries: number;
  rejectedEntries: number;
}

export function EarlyAccessOverview() {

  const [stats, setStats] = useState<EarlyStats>()


 useEffect(() => {
     async function fetchData() {
       try {
         const response = await fetch("https://onlyfounders.azurewebsites.net/api/admin/get-earlyaccess-analytics?userId=62684");
         const data = await response.json();
         setStats(data);
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     }
 
     fetchData();
   }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          <ClipboardList className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalEntries ?? 0}</div>
          <p className="text-xs text-muted-foreground">Early access requests received</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accepted Entries</CardTitle>
          <CheckCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.acceptedEntries ?? 0}</div>
          <p className="text-xs text-muted-foreground">Approved early access requests</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected Entries</CardTitle>
          <XCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.rejectedEntries ?? 0}</div>
          <p className="text-xs text-muted-foreground">Declined early access requests</p>
        </CardContent>
      </Card>
    </div>
  )
}

