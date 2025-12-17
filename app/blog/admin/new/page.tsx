// import { createClient } from "@/lib/supabase/client"
import { createClient } from "@/lib/supabase/server"

import { redirect } from "next/navigation"
import { BlogPostForm } from "@/components/blog-post-form"

export default async function NewBlogPostPage() {
  const supabase = await createClient()

  // Check authentication and admin role
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  console.log("User profile:", profile)

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return <BlogPostForm />
}
