"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

interface NavigationProps {
  pages: {
    id: string
    title: string
    slug: string
    published: boolean
  }[]
}

export function Navigation({ pages }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const publishedPages = pages.filter((page) => page.published)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ModernCMS</span>
        </Link>

        {/* Mobile menu button */}
        <button className="block md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {publishedPages.map((page) => (
            <Link
              key={page.id}
              href={page.slug === "home" ? "/" : `/${page.slug}`}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {page.title}
            </Link>
          ))}
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 border-b bg-background p-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              {publishedPages.map((page) => (
                <Link
                  key={page.id}
                  href={page.slug === "home" ? "/" : `/${page.slug}`}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {page.title}
                </Link>
              ))}
              <Button asChild variant="outline" size="sm">
                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

