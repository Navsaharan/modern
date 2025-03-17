"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../auth-provider"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface PageAnalytics {
  id: string
  page_slug: string
  view_count: number
  last_viewed_at: string
}

export default function AnalyticsAdmin() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<PageAnalytics[]>([])
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        const { data, error } = await supabase.from("analytics").select("*").order("view_count", { ascending: false })

        if (error) throw error
        setAnalytics(data || [])
      } catch (error) {
        console.error("Error fetching analytics:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAnalytics(false)
      }
    }

    if (user) {
      fetchAnalytics()
    }
  }, [user, toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalViews = () => {
    return analytics.reduce((sum, item) => sum + item.view_count, 0)
  }

  const getChartData = () => {
    return analytics.map((item) => ({
      name: item.page_slug === "home" ? "Home" : item.page_slug,
      views: item.view_count,
    }))
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">View analytics data for your website.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>
              Total views across all pages: {isLoadingAnalytics ? "..." : getTotalViews()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ChartContainer
                config={{
                  views: {
                    label: "Views",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="var(--color-views)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Page Analytics</CardTitle>
            <CardDescription>Detailed view counts for each page.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead>Last Viewed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        No analytics data available yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    analytics.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.page_slug === "home" ? "Home" : item.page_slug}
                        </TableCell>
                        <TableCell className="text-right">{item.view_count}</TableCell>
                        <TableCell>{formatDate(item.last_viewed_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

