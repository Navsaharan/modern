import { getPageBySlug, incrementPageView } from "@/lib/data"
import { SectionRenderer } from "@/components/section-renderer"
import { notFound } from "next/navigation"

export default async function HomePage() {
  const page = await getPageBySlug("home")

  if (!page) {
    notFound()
  }

  // Increment page view
  await incrementPageView("home")

  return (
    <>
      <SectionRenderer sections={page.sections} />
    </>
  )
}

