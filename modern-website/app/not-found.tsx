import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Page Not Found</h1>
      <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
      <Button asChild className="mt-8">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}

