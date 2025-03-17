"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../auth-provider"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FormSubmission {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

export default function SubmissionsAdmin() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        const { data, error } = await supabase
          .from("form_submissions")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setSubmissions(data || [])
      } catch (error) {
        console.error("Error fetching submissions:", error)
        toast({
          title: "Error",
          description: "Failed to load form submissions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingSubmissions(false)
      }
    }

    if (user) {
      fetchSubmissions()
    }
  }, [user, toast])

  const deleteSubmission = async (id: string) => {
    try {
      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.from("form_submissions").delete().eq("id", id)

      if (error) throw error

      // Update local state
      setSubmissions(submissions.filter((submission) => submission.id !== id))

      toast({
        title: "Success",
        description: "Submission deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting submission:", error)
      toast({
        title: "Error",
        description: "Failed to delete submission. Please try again.",
        variant: "destructive",
      })
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.from("form_submissions").update({ read: true }).eq("id", id)

      if (error) throw error

      // Update local state
      setSubmissions(
        submissions.map((submission) => (submission.id === id ? { ...submission, read: true } : submission)),
      )
    } catch (error) {
      console.error("Error marking submission as read:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',\
      day: 'numeric\',  {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const viewSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    if (!submission.read) {
      markAsRead(submission.id)
    }
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Form Submissions</h1>
        <p className="text-muted-foreground">View and manage contact form submissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>View and manage all contact form submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSubmissions ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No form submissions yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{formatDate(submission.created_at)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            submission.read ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {submission.read ? "Read" : "Unread"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => viewSubmission(submission)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => deleteSubmission(submission.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
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

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        {selectedSubmission && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Message from {selectedSubmission.name}</DialogTitle>
              <DialogDescription>Received on {formatDate(selectedSubmission.created_at)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm">{selectedSubmission.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Message</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => {
                  deleteSubmission(selectedSubmission.id)
                  setSelectedSubmission(null)
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

