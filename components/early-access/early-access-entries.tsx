"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";

type EarlyAccessEntry = {
  _id: string;
  name: string;
  email: string;
  twitter: string;
  role: "Founder" | "Investor";
  walletAddress: string;
  createdAt: string;
  applicationStatus: "Pending" | "Accepted" | "Rejected";
};

export function EarlyAccessEntries() {
  const [entries, setEntries] = useState<EarlyAccessEntry[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://onlyfounders.azurewebsites.net/api/admin/get-early-access-users?userId=62684");
        const data = await response.json();
        setEntries(data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Accept User API Call
  const handleAccept = async (id: string) => {
    try {
      setStatusLoading(true);
      const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/accept-application/${id}?userId=62684`, {
        method: "POST",
      });

      if (response.ok) {
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry._id === id ? { ...entry, applicationStatus: "Accepted" } : entry
          )
        );
      }
    } catch (error) {
      console.error(`Error accepting user ${id}:`, error);
    }
    finally {
      setStatusLoading(false);
    }
  };

  // Reject User API Call
  const handleReject = async (id: string) => {
    try {
      setStatusLoading(true);
      const response = await fetch(`https://onlyfounders.azurewebsites.net/api/admin/reject-application/${id}?userId=62684`, {
        method: "POST",
      });

      if (response.ok) {
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry._id === id ? { ...entry, applicationStatus: "Rejected" } : entry
          )
        );
      }
    } catch (error) {
      console.error(`Error rejecting user ${id}:`, error);
    }
    finally {
      setStatusLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesRole = roleFilter === "all" || entry.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || entry.applicationStatus === statusFilter;
    const matchesSearch =
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-border"
        />
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px] border-border">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="founder">Founders</SelectItem>
              <SelectItem value="investor">Investors</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>X (Twitter)</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Wallet Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry._id} className="border-t border-border">
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>{entry.email}</TableCell>
                <TableCell>
                  <a
                    href={`https://twitter.com/${entry.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @{entry.twitter}
                  </a>
                </TableCell>
                <TableCell>{entry.role}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="truncate max-w-[120px] sm:max-w-[180px]">{entry.walletAddress}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-6 w-6 text-primary"
                      onClick={() => copyToClipboard(entry.walletAddress)}
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy wallet address</span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      entry.applicationStatus === "Accepted"
                        ? "outline"
                        : entry.applicationStatus === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                    className={`capitalize ${entry.applicationStatus === "Accepted" ? 'text-green-500 bg-green-200 border border-green-300' : entry.applicationStatus === "Rejected" ? 'text-red-500 bg-red-200 border border-red-300' : 'bg-gray-200 border border-gray-300'}`}
                  >
                    {entry.applicationStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer h-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                      onClick={() => handleAccept(entry._id)}
                      disabled={entry.applicationStatus !== "Pending"}
                    >
                      {statusLoading? (<LoaderCircle className="mr-1 h-3 w-3 animate-spin" />) :
                      (<CheckCircle className="mr-1 h-3 w-3" /> )}Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleReject(entry._id)}
                      disabled={entry.applicationStatus !== "Pending"}
                    >
                      {statusLoading? (<LoaderCircle className="mr-1 h-3 w-3 animate-spin" />) :
                      (<XCircle className="mr-1 h-3 w-3" /> )}
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
