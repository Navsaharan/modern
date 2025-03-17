"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../auth-provider"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Pencil, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Page {
  id: string
  title: string
  slug: string
  published: boolean
  updated_at: string
}

export default function PagesAdmin() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [isLoadingPages, setIsLoadingPages] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        const { data, error } = await supabase.from("pages").select("*").order("order_index")

        if (error) throw error
        setPages(data || [])
      } catch (error) {
        console.error("Error fetching pages:", error)
        toast({
          title: "Error",
          description: "Failed to load pages. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingPages(false)
      }
    }

    if (user) {
      fetchPages()
    }
  }, [user, toast])

  const togglePagePublished = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.from("pages").update({ published: !currentStatus }).eq("id", id)

      if (error) throw error

      // Update local state
      setPages(pages.map((page) => (page.id === id ? { ...page, published: !currentStatus } : page)))

      toast({
        title: "Success",
        description: `Page ${currentStatus ? "unpublished" : "published"} successfully.`,
      })
    } catch (error) {
      console.error("Error toggling page published status:", error)
      toast({
        title: "Error",
        description: "Failed to update page status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">Manage the pages on your website.</p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" /> New Page
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
          <CardDescription>View and manage all pages on your website.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPages ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No pages found. Create your first page to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>{page.slug}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            page.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {page.published ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(page.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/${page.slug === "home" ? "" : page.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin/pages/${page.id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => togglePagePublished(page.id, page.published)}
                          >
                            <span className="sr-only">{page.published ? "Unpublish" : "Publish"}</span>
                            {page.published ? (
                              <span className="text-xs">Draft</span>
                            ) : (
                              <span className="text-xs">Publish</span>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

