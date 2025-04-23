'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, LineChart, Loader } from "lucide-react"
import React, { useEffect } from "react"

export function UsersOverview() {
  
  const [founders, setFounders] = React.useState([])
  const [investors, setInvestors] = React.useState([])
  const [serviceProviders, setServiceProviders] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const stats = {
    founders: founders.length,
    investors: investors.length,
    serviceProviders: serviceProviders.length,
  }

  const API_URL = "https://onlyfounders.azurewebsites.net/api/admin/profiles/"

   useEffect(() => {
      const fetchFounders = async () => {
        try {
          const response = await fetch(API_URL+"Founder", {
            method: "GET",
            headers:{
              user_id: "62684",
            },
          })
          if (!response.ok) throw new Error("Failed to fetch data")
          const data = await response.json()
          setFounders(data.profiles || [])
        } catch (err) {
          setError((err as Error).message)
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
      fetchFounders()
    }, [])

    useEffect(() => {
      const fetchFounders = async () => {
        try {
          const response = await fetch(API_URL+"Investor", {
            method: "GET",
            headers:{
              user_id: "62684",
            },
          })
          if (!response.ok) throw new Error("Failed to fetch data")
          const data = await response.json()
          setServiceProviders(data.profiles || [])
        } catch (err) {
          setError((err as Error).message)
        } finally {
          setLoading(false)
        }
      }
      fetchFounders()
    }, [])

    useEffect(() => {
      const fetchFounders = async () => {
        try {
          const response = await fetch(API_URL+"ServiceProvider", {
            method: "GET",
            headers:{
              user_id: "62684",
            },
          })
          if (!response.ok) throw new Error("Failed to fetch data")
          const data = await response.json()
          setInvestors(data.profiles || [])
        } catch (err) {
          setError((err as Error).message)
        } finally {
          setLoading(false)
        }
      }
      fetchFounders()
    }, [])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Founders</CardTitle>
          <Briefcase className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            {loading ? (
            <div className="inline-block w-4 h-4"><Loader/></div>
            ) : (
            <div className="text-2xl font-bold">{stats.founders}</div>
            )}
          <p className="text-xs text-muted-foreground">Users who create startups and launch campaigns</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
          <LineChart className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
        {loading ? (
            <div className="inline-block w-4 h-4"><Loader/></div>
            ) : (
            <div className="text-2xl font-bold">{stats.investors}</div>
            )}
          <p className="text-xs text-muted-foreground">Users who browse startups but cannot invest</p>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investors</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.serviceProviders}</div>
          <p className="text-xs text-muted-foreground">Users who explore and invest in startups</p>
        </CardContent>
      </Card>
    </div>
  )
}

