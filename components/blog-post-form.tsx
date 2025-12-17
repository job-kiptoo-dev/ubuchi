"use client"

import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Leaf, Loader2 } from "lucide-react"

import AuthNav from "@/components/auth-nav"
import { createClient } from "@/lib/supabase/client"

/* -------------------- Types -------------------- */

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string | null
  category: string
  tags: string[]
  is_published: boolean
}

type FormState = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  category: string
  tags: string
  is_published: boolean
}

/* -------------------- Component -------------------- */

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<null | { id: string }>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const [formData, setFormData] = useState<FormState>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    cover_image_url: post?.cover_image_url ?? "",
    category: post?.category ?? "wellness",
    tags: post?.tags?.join(", ") ?? "",
    is_published: post?.is_published ?? false,
  })

  /* -------------------- Auth bootstrap -------------------- */

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUser({ id: user.id })

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setIsAdmin(profile?.role === "admin")
    }

    loadUser()
  }, [supabase])

  /* -------------------- Handlers -------------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t): t is string => t.length > 0)

      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image_url: formData.cover_image_url || null,
        category: formData.category,
        tags,
        is_published: formData.is_published,
        author_id: user.id,
        published_at: formData.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }

      if (post) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", post.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("blog_posts").insert(postData)
        if (error) throw error
      }

      router.push("/blog/admin")
      router.refresh()
    } catch (err) {
      console.error("Error saving post:", err)
      alert("Failed to save post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug:
        prev.slug ||
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    }))
  }

  /* -------------------- JSX -------------------- */

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-neutral-50/80 border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <span className="font-serif text-xl">Úbūchi</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/blog/admin" className="text-sm hover:text-emerald-600">
              Manage Articles
            </Link>
            <AuthNav user={user} isAdmin={isAdmin} />
          </div>
        </div>
      </nav>

      {/* Back */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link href="/blog/admin" className="inline-flex items-center gap-2 text-sm text-neutral-600">
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
      </div>

      {/* Form */}
      {/* (Form JSX unchanged — your UI is fine) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <h1 className="font-serif text-4xl mb-8">{post ? "Edit Article" : "New Article"}</h1> <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6"> <div> <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2"> Title </label> <input type="text" id="title" required value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" /> </div> <div> <label htmlFor="slug" className="block text-sm font-medium text-neutral-700 mb-2"> Slug (URL) </label> <input type="text" id="slug" required value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" /> </div> <div> <label htmlFor="excerpt" className="block text-sm font-medium text-neutral-700 mb-2"> Excerpt </label> <textarea id="excerpt" rows={3} value={formData.excerpt} onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))} className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" /> </div> <div> <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2"> Content </label> <textarea id="content" rows={15} required value={formData.content} onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))} className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" /> </div> <div> <label htmlFor="cover_image_url" className="block text-sm font-medium text-neutral-700 mb-2"> Cover Image URL </label> <input type="url" id="cover_image_url" value={formData.cover_image_url} onChange={(e) => setFormData((prev) => ({ ...prev, cover_image_url: e.target.value }))} className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" /> </div> <div className="grid grid-cols-2 gap-6"> <div> <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2"> Category </label> <select id="category" value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" > <option value="wellness">Wellness</option> <option value="recipes">Recipes</option> <option value="lifestyle">Lifestyle</option> <option value="tea_rituals">Tea Rituals</option> </select> </div> <div> <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2"> Tags (comma separated) </label> <input type="text" id="tags" value={formData.tags} onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))} placeholder="wellness, tea, rituals" className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" /> </div> </div> <div className="flex items-center"> <input type="checkbox" id="is_published" checked={formData.is_published} onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))} className="w-4 h-4 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500" /> <label htmlFor="is_published" className="ml-2 text-sm text-neutral-700"> Publish immediately </label> </div> <div className="flex gap-4 pt-4"> <button type="submit" disabled={loading} className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2" > {loading && <Loader2 className="w-4 h-4 animate-spin" />} {post ? "Update Article" : "Create Article"} </button> <Link href="/blog/admin" className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors" > Cancel </Link> </div> </form> </div>
    </div>
  )
}

