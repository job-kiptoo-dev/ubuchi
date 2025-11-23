import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Award, Leaf, ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import AuthNav from "@/components/auth-nav"
import AddToCartButton from "@/components/add-to-cart-button"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "admin"
  }

  // Fetch product and sizes separately
  const [productResult, sizesResult] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("product_sizes").select("*").eq("product_id", id).order("size_grams", { ascending: true })
  ])

  const product = productResult.data
  const sizes = sizesResult.data || []

  if (!product || !product.is_active) {
    notFound()
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "tea":
        return <Leaf className="h-8 w-8 text-emerald-600" />
      case "coffee":
        return <Award className="h-8 w-8 text-amber-600" />
      case "chocolate":
        return <Heart className="h-8 w-8 text-rose-600" />
      default:
        return <Leaf className="h-8 w-8 text-emerald-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "tea":
        return "bg-emerald-100 text-emerald-700"
      case "coffee":
        return "bg-amber-100 text-amber-700"
      case "chocolate":
        return "bg-rose-100 text-rose-700"
      default:
        return "bg-neutral-100 text-neutral-700"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-serif text-neutral-900">Úbūchi</span>
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
            <div className="w-full aspect-square bg-gradient-to-br from-amber-50 to-emerald-50 rounded-lg flex items-center justify-center overflow-hidden">
              {product.image_url && 
               product.image_url !== 'https://example.com/tea.jpg' && 
               product.image_url !== 'https://example.com/coffee.jpg' && 
               product.image_url !== 'https://example.com/chocolate.jpg' ? (
                <Image
                  src={product.image_url}
                  width={600}
                  height={600}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  priority
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
                {product.category}
              </Badge>
              <h1 className="text-5xl font-serif text-gray-900 mb-6">{product.name}</h1>
              <div className="mb-4">
                <span className="text-3xl font-serif text-gray-900">
                  KSh {Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 ml-2">base price</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-base leading-relaxed text-gray-700 mb-4">{product.description}</p>
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-900 mb-4">
                  AVAILABLE SIZES
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map((size) => (
                    <div
                      key={size.id}
                      className="p-4 border border-gray-300 rounded-md hover:border-emerald-600 transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-600">
                          {size.size_grams}g
                        </span>
                        <span className="text-lg font-serif text-gray-900 mt-1">
                          KSh {Number(size.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {size.stock_quantity > 0 
                            ? `${size.stock_quantity} in stock` 
                            : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Information */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total Available:</span>
                <span className="text-sm font-medium text-gray-900">
                  {product.stock_quantity} units
                </span>
              </div>
              {sizes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Available in {sizes.length} different size{sizes.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            {user ? (
              <AddToCartButton product={product} sizes={sizes} />
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed py-6 text-base rounded-md">
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
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Leaf className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Premium Quality</p>
                    <p className="text-xs text-gray-600">Carefully sourced and packaged</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShoppingCart className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
                    <p className="text-xs text-gray-600">Usually ships within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 mb-3">
                PRODUCT DETAILS
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-gray-600">Category</dt>
                  <dd className="text-sm text-gray-900">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-600">Base Price</dt>
                  <dd className="text-sm text-gray-900">KSh {Number(product.price).toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-600">Available Sizes</dt>
                  <dd className="text-sm text-gray-900">
                    {sizes.length > 0 
                      ? sizes.map(s => `${s.size_grams}g`).join(', ')
                      : 'Standard'}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 mb-3">
                STORAGE
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Store in a cool, dry place away from direct sunlight. 
                Keep sealed to maintain freshness and aroma.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 mb-3">
                SHIPPING
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Free shipping on orders over KSh 2000. 
                Standard delivery within 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
