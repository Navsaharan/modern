import { getPageBySlug, incrementPageView } from "@/lib/data"
import { SectionRenderer } from "@/components/section-renderer"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: page.title,
    description: page.meta_description || undefined,
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params

  // Don't allow accessing the home page via /home
  if (slug === "home") {
    notFound()
  }

  const page = await getPageBySlug(slug)

  if (!page || !page.published) {
    notFound()
  }

  // Increment page view
  await incrementPageView(slug)

  return (
    <>
      <SectionRenderer sections={page.sections} />
    </>
  )
}

