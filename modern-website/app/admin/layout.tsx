import type React from "react"
import { AuthProvider } from "./auth-provider"
import { AdminSidebar } from "@/components/admin/sidebar"

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your website content and design",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </AuthProvider>
  )
}

