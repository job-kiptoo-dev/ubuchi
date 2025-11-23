"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: any
  sizes?: any[]
}

export default function AddToCartButton({ product, sizes = [] }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(
    sizes.length > 0 ? sizes[0].id : null
  )

  const router = useRouter()

  // Get selected size details
  const selectedSize = sizes.find(s => s.id === selectedSizeId)
  const maxStock = selectedSize ? selectedSize.stock_quantity : product.stock_quantity
  const isOutOfStock = maxStock === 0
  
  // Calculate price based on selected size or product base price
  const currentPrice = selectedSize ? selectedSize.price : product.price
  const selectedGrams = selectedSize ? selectedSize.size_grams : 50

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if item with same product and size already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .eq("size_id", selectedSizeId)
        .single()

      if (existingItem) {
        // Update grams_ordered (multiply quantity by grams per package)
        const { error } = await supabase
          .from("cart_items")
          .update({ 
            grams_ordered: existingItem.grams_ordered + (selectedGrams * quantity),
            updated_at: new Date().toISOString()
          })
          .eq("id", existingItem.id)

        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase.from("cart_items").insert([
          {
            user_id: user.id,
            product_id: product.id,
            size_id: selectedSizeId,
            grams_ordered: selectedGrams * quantity,
          },
        ])

        if (error) throw error
      }

      const sizeText = selectedSize ? ` (${selectedSize.size_grams}g)` : ''
      toast.success(`Added ${quantity} × ${product.name}${sizeText} to cart`)
      
      // Reset quantity after adding
      setQuantity(1)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Could not add item to cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isOutOfStock) {
    return (
      <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed py-6 text-lg">
        Out of Stock
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-gray-900 mb-3">
            SELECT SIZE
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {sizes.map((size) => {
              const isSelected = selectedSizeId === size.id
              const isSizeOutOfStock = size.stock_quantity === 0
              
              return (
                <button
                  key={size.id}
                  onClick={() => !isSizeOutOfStock && setSelectedSizeId(size.id)}
                  disabled={isSizeOutOfStock}
                  className={`p-4 border rounded-md transition-all text-left ${
                    isSizeOutOfStock
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'border-emerald-600 bg-emerald-50 shadow-sm ring-2 ring-emerald-200'
                      : 'border-gray-300 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        isSelected ? 'text-emerald-700' : 'text-gray-900'
                      }`}>
                        {size.size_grams}g
                      </span>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                      )}
                    </div>
                    <span className={`text-lg font-serif mt-1 ${
                      isSelected ? 'text-emerald-900' : 'text-gray-900'
                    }`}>
                      KSh {Number(size.price).toFixed(2)}
                    </span>
                    <span className={`text-xs mt-1 ${
                      isSizeOutOfStock 
                        ? 'text-red-600 font-medium' 
                        : isSelected 
                        ? 'text-emerald-600' 
                        : 'text-gray-500'
                    }`}>
                      {isSizeOutOfStock 
                        ? 'Out of stock' 
                        : `${size.stock_quantity} available`}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-emerald-800 font-medium">Quantity:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="border-emerald-200 text-emerald-700"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium text-emerald-800">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
            className="border-emerald-200 text-emerald-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg rounded-md"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart - KSh {(Number(currentPrice) * quantity).toFixed(2)}
          </>
        )}
      </Button>
    </div>
  )
}