import { createServerSupabaseClient } from "./supabase"
import { cache } from "react"

export const getPages = cache(async () => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("pages").select("*").order("order_index")

  if (error) {
    console.error("Error fetching pages:", error)
    return []
  }

  return data
})

export const getPageBySlug = cache(async (slug: string) => {
  const supabase = createServerSupabaseClient()
  const { data: page, error: pageError } = await supabase.from("pages").select("*").eq("slug", slug).single()

  if (pageError) {
    console.error(`Error fetching page with slug ${slug}:`, pageError)
    return null
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("order_index")

  if (sectionsError) {
    console.error(`Error fetching sections for page ${slug}:`, sectionsError)
    return { ...page, sections: [] }
  }

  return { ...page, sections }
})

export const getDesignSettings = cache(async () => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("design_settings").select("*")

  if (error) {
    console.error("Error fetching design settings:", error)
    return {}
  }

  // Convert array of settings to an object
  return data.reduce(
    (acc, setting) => {
      acc[setting.name] = setting.value
      return acc
    },
    {} as Record<string, any>,
  )
})

export const incrementPageView = async (slug: string) => {
  const supabase = createServerSupabaseClient()

  // Check if the page exists in analytics
  const { data, error } = await supabase.from("analytics").select("*").eq("page_slug", slug).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error(`Error checking analytics for page ${slug}:`, error)
    return
  }

  if (data) {
    // Update existing record
    await supabase
      .from("analytics")
      .update({
        view_count: data.view_count + 1,
        last_viewed_at: new Date().toISOString(),
      })
      .eq("id", data.id)
  } else {
    // Create new record
    await supabase.from("analytics").insert({
      page_slug: slug,
      view_count: 1,
    })
  }
}

