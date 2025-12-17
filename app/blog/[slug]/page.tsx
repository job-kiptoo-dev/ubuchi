import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Leaf, ArrowLeft } from "lucide-react"
import AuthNav from "@/components/auth-nav"
import Footer from "@/components/Footer"
import Image from "next/image"
import { notFound } from "next/navigation"

/* -----------------------------
   Types
--------------------------------*/
type Profile = {
  full_name: string | null
}

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string
  cover_image_url: string | null
  published_at: string | null
  is_published: boolean
  tags: string[] | null
  profiles: Profile | null
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    isAdmin = profile?.role === "admin"
  }

  const { data: post } = await supabase
    .from("blog_posts")
    .select(
      `
        id,
        title,
        slug,
        content,
        excerpt,
        category,
        cover_image_url,
        published_at,
        is_published,
        tags,
        profiles:author_id (
          full_name
        )
      `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single<BlogPost>()

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-neutral-50/80 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span className="font-serif text-xl">Úbūchi</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-sm hover:text-emerald-600 transition-colors">
                Shop
              </Link>
              <Link href="/blog" className="text-sm hover:text-emerald-600 transition-colors">
                Blog
              </Link>
              <AuthNav user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>

      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm uppercase tracking-wider text-emerald-600">
              {post.category.replace("_", " ")}
            </span>

            {post.published_at && (
              <span className="text-sm text-neutral-400">
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="font-serif text-5xl mb-4">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-neutral-600 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.profiles?.full_name && (
            <p className="text-sm text-neutral-500 mt-6">
              By {post.profiles.full_name}
            </p>
          )}
        </header>

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-8">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content
            .split("\n")
            .filter((p: string) => p.trim() !== "")
            .map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  )
}

