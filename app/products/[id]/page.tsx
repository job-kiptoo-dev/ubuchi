import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Moon, Award, Leaf, ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import AuthNav from "@/components/auth-nav"
import AddToCartButton from "@/components/add-to-cart-button"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { motion } from "framer-motion"


interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()

  // Await the params Promise
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "admin"
  }

  // Get product details
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single()

  if (!product || !product.is_active) {
    notFound()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return <Heart className="h-8 w-8" />
      case "energy":
        return <Award className="h-8 w-8" />
      case "sleep":
        return <Moon className="h-8 w-8" />
      default:
        return <Leaf className="h-8 w-8" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return "bg-rose-100 text-rose-700"
      case "energy":
        return "bg-amber-100 text-amber-700"
      case "sleep":
        return "bg-indigo-100 text-indigo-700"
      default:
        return "bg-emerald-100 text-emerald-700"
    }
  }

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return "from-rose-100 to-pink-100"
      case "energy":
        return "from-amber-100 to-orange-100"
      case "sleep":
        return "from-indigo-100 to-purple-100"
      default:
        return "from-emerald-100 to-teal-100"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-800">Ūbūchi</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/products" className="text-sm text-gray-700 hover:text-gray-900">
              Shop
            </Link>
            <AuthNav user={user} isAdmin={isAdmin} />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image - Left Side */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  width={600}
                  height={600}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 flex items-center justify-center">
                  {getCategoryIcon(product.category)}
                </div>
              )}
            </div>
          </div>

          {/* Product Details - Right Side */}
          <div className="space-y-8">
            {/* Title and Price */}
            <div>
              <Badge className={`mb-4 ${getCategoryColor(product.category)}`}>
                {product.category.replace("_", " ")}
              </Badge>
              <h1 className="text-5xl font-light text-gray-900 mb-6">{product.name}</h1>
              <div className="mb-4">
                <span className="text-2xl font-light text-gray-900">
                  {Number.parseFloat(product.price).toFixed(2)} usd
                </span>
              </div>
              {product.sku && <p className="text-xs tracking-wider text-gray-500">#{product.sku}</p>}
            </div>

            {/* Description */}
            <div>
              <p className="text-sm leading-relaxed text-gray-700 mb-4">{product.description}</p>
              {/* <button className="text-xs font-medium text-gray-900 tracking-wide hover:text-gray-600 transition-colors"> */}
              {/*   READ MORE */}
              {/* </button> */}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-900 mb-4">SIZE 50 GRAM</h3>
              <div className="flex gap-3">
                <button className="px-6 py-3 border border-gray-900 text-sm text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                  50 GRAM
                </button>
                <button className="px-6 py-3 border border-gray-300 text-sm text-gray-600 hover:border-gray-900 transition-colors">
                  1000 GRAM
                </button>
              </div>
            </div>

            {/* Packaging Selection */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-900 mb-4">PACKAGING BAG</h3>
              <div className="flex gap-3">
                <button className="px-6 py-3 border border-gray-900 text-sm text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                  BAG
                </button>
                <button className="px-6 py-3 border border-gray-300 text-sm text-gray-600 hover:border-gray-900 transition-colors">
                  BAG W/ STORAGE TIN
                </button>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {user ? (
              <AddToCartButton product={product} />
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed py-6 text-base">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Sign in to Purchase
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    <Link href="/auth/login" className="text-emerald-700 hover:text-emerald-800 underline">
                      Sign in
                    </Link>{" "}
                    or{" "}
                    <Link href="/auth/sign-up" className="text-emerald-700 hover:text-emerald-800 underline">
                      create an account
                    </Link>{" "}
                    to add items to your cart
                  </p>
                </div>
              </div>
            )}

            {/* Store Info */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-600 mb-2">Pickup available at Roskilde - Warehouse</p>
              <p className="text-xs text-gray-500 mb-4">Usually ready in 24 hours</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

