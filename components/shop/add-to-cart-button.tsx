"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product, ProductSize } from "@/type/product"

interface AddToCartButtonProps {
  product: Product
  sizes?: ProductSize[]
}

export default function AddToCartButton({ product, sizes = [] }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(
    sizes.length > 0 ? sizes[0].id : null
  )

  const router = useRouter()

  const selectedSize = sizes.find(s => s.id === selectedSizeId) || null
  const maxStock = selectedSize ? selectedSize.stock_quantity : product.stock_quantity
  const isOutOfStock = maxStock === 0

  const currentPrice = selectedSize ? selectedSize.price : product.price
  const selectedGrams = selectedSize ? selectedSize.size_grams : 50

  const handleAddToCart = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if existing
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .eq("size_id", selectedSizeId)
        .maybeSingle()

      if (existingItem) {
        await supabase
          .from("cart_items")
          .update({
            grams_ordered: existingItem.grams_ordered + selectedGrams,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingItem.id)
      } else {
        await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: product.id,
          size_id: selectedSizeId,
          grams_ordered: selectedGrams
        })
      }

      toast.success(`Added ${product.name} to cart`)
    } catch (err) {
      console.error(err)
      toast.error("Could not add to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* SIZE SELECTION */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">SELECT SIZE</h3>

          <div className="grid grid-cols-2 gap-3">
            {sizes.map((size) => {
              const selected = size.id === selectedSizeId
              const out = size.stock_quantity === 0

              return (
                <button
                  key={size.id}
                  onClick={() => !out && setSelectedSizeId(size.id)}
                  disabled={out}
                  className={`p-4 border rounded-md transition-all text-left ${
                    out
                      ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                      : selected
                      ? "border-emerald-600 bg-emerald-50 shadow-sm ring-2 ring-emerald-200"
                      : "border-gray-300 hover:border-emerald-400 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{size.size_grams}g</span>
                    {selected && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
                  </div>
                  <span className="text-lg font-serif">KSh {Number(size.price).toFixed(2)}</span>
                  <span className="text-xs text-gray-500">
                    {out ? "Out of stock" : `${size.stock_quantity} available`}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ADD TO CART BUTTON */}
      <Button
        disabled={loading || isOutOfStock}
        onClick={handleAddToCart}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-6"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" /> ADDING TO CART...
          </>
        ) : isOutOfStock ? (
          "OUT OF STOCK"
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            ADD TO CART - KSh {Number(currentPrice).toFixed(2)}
          </>
        )}
      </Button>

    </div>
  )
}
