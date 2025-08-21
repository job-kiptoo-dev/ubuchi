import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import AddToCartButton from "./add-to-cart-button"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock_quantity: number
}

interface ProductGridProps {
  products: Product[]
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "hormonal-balance":
      return "bg-rose-100 text-rose-700"
    case "energy":
      return "bg-amber-100 text-amber-700"
    case "sleep":
      return "bg-indigo-100 text-indigo-700"
    case "wellness":
      return "bg-emerald-100 text-emerald-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getCategoryLabel = (category: string) => {
  return category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
          <Link href={`/shop/products/${product.id}`}>
            <div className="aspect-square bg-gray-100 overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-100">
                  <Package className="h-16 w-16 text-emerald-600" />
                </div>
              )}
            </div>
          </Link>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <Badge className={getCategoryColor(product.category)}>{getCategoryLabel(product.category)}</Badge>
              <span className="text-sm text-gray-600">
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
              </span>
            </div>
            <Link href={`/shop/products/${product.id}`}>
              <h3 className="font-semibold text-lg mb-2 hover:text-emerald-600 transition-colors">{product.name}</h3>
            </Link>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              <AddToCartButton
                productId={product.id}
                disabled={product.stock_quantity === 0}
                inStock={product.stock_quantity > 0}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
