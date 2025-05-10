"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InvestmentFormProps {
  initialData: any | null
  onSubmit: (data: any) => void
  onCancel: () => void
  mode: "new" | "edit" | "update"
}

export function InvestmentForm({ initialData, onSubmit, onCancel, mode }: InvestmentFormProps) {
  // Update the formData state to include date
  const [formData, setFormData] = useState({
    name: "",
    telegram: "",
    email: "",
    walletAddress: "",
    nationality: "",
    amountInvested: "",
    secondWallet: "",
    twitterHandle: "",
    date: new Date().toISOString().split("T")[0], // Add default date as today
  })

  // Update the useEffect to include date when editing
  useEffect(() => {
    if (initialData && (mode === "edit" || mode === "update")) {
      setFormData({
        name: initialData.investorName || "",
        telegram: initialData.telegram || "",
        email: initialData.email || "",
        walletAddress: initialData.walletAddress || "",
        nationality: initialData.nationality || "",
        amountInvested: mode === "update" ? "" : initialData.amountInvested || "",
        secondWallet: initialData.secondWallet || "",
        twitterHandle: initialData.twitterHandle || "",
        date: initialData.date || new Date().toISOString().split("T")[0], // Add date from initialData
      })
    }
  }, [initialData, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // List of countries for nationality dropdown
  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
    "India",
    "Brazil",
    "Singapore",
    "South Korea",
    "Russia",
    "South Africa",
    "United Arab Emirates",
    "Other",
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telegram">Telegram</Label>
          <Input
            id="telegram"
            name="telegram"
            value={formData.telegram}
            onChange={handleChange}
            placeholder="@username"
            className="border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitterHandle">Twitter Handle</Label>
          <Input
            id="twitterHandle"
            name="twitterHandle"
            value={formData.twitterHandle}
            onChange={handleChange}
            placeholder="@username"
            className="border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="walletAddress">Wallet Address</Label>
        <Input
          id="walletAddress"
          name="walletAddress"
          value={formData.walletAddress}
          onChange={handleChange}
          required
          className="border-border"
        />
      </div>

      {/* Add the date field to the form, after the amount invested field */}
      {/* Find the grid with amount invested and add the date field there */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Select value={formData.nationality} onValueChange={(value) => handleSelectChange("nationality", value)}>
            <SelectTrigger className="border-border">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amountInvested">Amount Invested</Label>
          <Input
            id="amountInvested"
            name="amountInvested"
            value={formData.amountInvested}
            onChange={handleChange}
            placeholder="$0.00"
            required
            className="border-border"
          />
        </div>
      </div>

      {/* Add date field */}
      <div className="space-y-2">
        <Label htmlFor="date">Date of Investment</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondWallet">Second Wallet to Receive Allocation (Optional)</Label>
        <Input
          id="secondWallet"
          name="secondWallet"
          value={formData.secondWallet}
          onChange={handleChange}
          className="border-border"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-border">
          Cancel
        </Button>
        <Button type="submit">
          {mode === "new" ? "Add Investment" : mode === "edit" ? "Save Changes" : "Add Update"}
        </Button>
      </div>
    </form>
  )
}
