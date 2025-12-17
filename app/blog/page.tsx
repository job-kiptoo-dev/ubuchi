import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Leaf } from "lucide-react"
import Image from "next/image"

export const metadata = {
  title: "Blog - Úbūchi",
  description: "Wellness articles, tea rituals, and stories from our tea journey",
}

export default async function BlogPage() {
  const supabase = await createClient()

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      category,
      published_at,
      profiles:author_id (full_name)
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is admin
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "admin"
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
              {user ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link href="/blog/admin" className="text-sm text-emerald-600 hover:text-emerald-700">
                      Manage Blog
                    </Link>
                  )}
                  <span className="text-sm text-neutral-600">{user.email}</span>
                </div>
              ) : (
                <Link href="/auth/login" className="text-sm hover:text-emerald-600 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl mb-2">Wellness Journal</h1>
            <p className="text-neutral-600">Stories, rituals, and wisdom from our tea journey</p>
          </div>

          {isAdmin && (
            <Link
              href="/blog/admin"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Manage Articles
            </Link>
          )}
        </div>

        {/* Blog Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {post.cover_image_url && (
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={post.cover_image_url || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase tracking-wider text-emerald-600">
                      {post.category.replace("_", " ")}
                    </span>
                    {post.published_at && (
                      <span className="text-xs text-neutral-400">
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-xl mb-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && <p className="text-sm text-neutral-600 line-clamp-3">{post.excerpt}</p>}

                  {post.profiles?.full_name && (
                    <p className="text-xs text-neutral-500 mt-4">By {post.profiles.full_name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-600">No articles published yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Footer */}
    </div>
  )
}
