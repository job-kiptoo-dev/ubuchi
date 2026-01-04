"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Leaf, Award, Heart } from "lucide-react"

export default function ProductSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        
        // Fetch products and sizes separately
        const [productsResult, sizesResult] = await Promise.all([
          supabase
            .from("products")
            .select("id, name, description, price, category, image_url, stock_quantity, is_active")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("product_sizes")
            .select("id, product_id, size_grams, price, stock_quantity")
        ])

        if (productsResult.error) throw productsResult.error

        // Group sizes by product_id
        const sizesMap = new Map<string, any[]>()
        if (sizesResult.data) {
          sizesResult.data.forEach(size => {
            if (!sizesMap.has(size.product_id)) {
              sizesMap.set(size.product_id, [])
            }
            sizesMap.get(size.product_id)!.push(size)
          })
        }

        // Merge product_sizes into products
        const productsWithSizes = productsResult.data?.map(product => ({
          ...product,
          product_sizes: sizesMap.get(product.id) || []
        }))

        if (productsWithSizes) {
          setProducts(productsWithSizes)
        }
      } catch (err: any) {
        console.error("Error fetching products:", err)
        setError("Failed to load products.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "tea":
        return <Leaf className="h-5 w-5 text-emerald-600" />
      case "coffee":
        return <Award className="h-5 w-5 text-amber-600" />
      case "chocolate":
        return <Heart className="h-5 w-5 text-rose-600" />
      default:
        return <Leaf className="h-5 w-5 text-emerald-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "tea":
        return "bg-emerald-100 text-emerald-800"
      case "coffee":
        return "bg-amber-100 text-amber-800"
      case "chocolate":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-neutral-100 text-neutral-800"
    }
  }

  return (
    <section id="products" className="py-16 bg-white" aria-labelledby="products-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 id="products-heading" className="text-4xl font-serif text-neutral-900 mb-2">
            Featured Products
          </h2>
          <p className="text-neutral-600 font-light">
            Premium tea crafted with care
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-600">{error}</div>
          ) : products.length > 0 ? (
            products.map((product) => {
              // Get the smallest size price or fallback to base price
              const sizes = product.product_sizes || []
              const smallestSize = sizes.length > 0 
                ? sizes.reduce((min: any, size: any) => 
                    size.price < min.price ? size : min, sizes[0])
                : null
              
              const displayPrice = smallestSize ? smallestSize.price : product.price
              const displaySize = smallestSize ? `${smallestSize.size_grams}g` : 'base'

              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <Card className="overflow-hidden border border-neutral-200 bg-white rounded-lg shadow-none hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                    <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-emerald-50">
                      {product.image_url && 
                       product.image_url !== 'https://example.com/tea.jpg' && 
                       product.image_url !== 'https://example.com/coffee.jpg' && 
                       product.image_url !== 'https://example.com/chocolate.jpg' ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getCategoryIcon(product.category)}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <Badge className={`mb-3 w-fit ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </Badge>
                      <h3 className="text-lg font-serif text-neutral-900 mb-3">
                        {product.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-4 flex-grow line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-900">
                            KSh {displayPrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-neutral-500">
                            from {displaySize}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-md px-4 py-2"
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12 text-neutral-600">
              No products available
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/products">
          <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-800 rounded-md px-7 py-4">
           View All Products
          </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
