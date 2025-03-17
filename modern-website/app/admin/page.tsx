"use client"

import { useAuth } from "./auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { FileText, Mail, Eye } from "lucide-react"

export default function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    pageCount: 0,
    submissionCount: 0,
    totalViews: 0,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createBrowserSupabaseClient()

        // Get page count
        const { count: pageCount } = await supabase.from("pages").select("*", { count: "exact", head: true })

        // Get submission count
        const { count: submissionCount } = await supabase
          .from("form_submissions")
          .select("*", { count: "exact", head: true })

        // Get total views
        const { data: analytics } = await supabase.from("analytics").select("view_count")

        const totalViews = analytics?.reduce((sum, item) => sum + item.view_count, 0) || 0

        setStats({
          pageCount: pageCount || 0,
          submissionCount: submissionCount || 0,
          totalViews,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your website admin dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats.pageCount}</div>
            <p className="text-xs text-muted-foreground">Pages on your website</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Submissions</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats.submissionCount}</div>
            <p className="text-xs text-muted-foreground">Contact form submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">Page views across your site</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <a href="/admin/pages">Manage Pages</a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/admin/design">Customize Design</a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/admin/submissions">View Form Submissions</a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview Website</CardTitle>
            <CardDescription>View your website as visitors will see it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/" target="_blank" rel="noopener noreferrer">
                Open Website
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

