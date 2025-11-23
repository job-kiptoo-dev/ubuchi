// "use client";
//
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ShoppingCart, Check } from "lucide-react";
//
// interface AddToCartButtonProps {
//   productId: string;
//   disabled?: boolean;
//   inStock?: boolean;
//   quantity?: number;
//   className?: string;
// }
//
// export default function AddToCartButton({
//   productId,
//   disabled = false,
//   inStock = true,
//   quantity = 1,
//   className = "",
// }: AddToCartButtonProps) {
//   const [isAdding, setIsAdding] = useState(false);
//   const [justAdded, setJustAdded] = useState(false);
//
//   const handleAddToCart = async () => {
//     setIsAdding(true);
//     try {
//       setJustAdded(true);
//       setTimeout(() => setJustAdded(false), 2000);
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     } finally {
//       setIsAdding(false);
//     }
//   };
//
//   if (justAdded) {
//     return (
//       <Button
//         className={`bg-green-600 hover:bg-green-700 ${className}`}
//         disabled
//       >
//         <Check className="h-4 w-4 mr-2" />
//         Added!
//       </Button>
//     );
//   }
//
//   return (
//     <Button
//       onClick={handleAddToCart}
//       disabled={disabled || isAdding}
//       className={`bg-emerald-600 hover:bg-emerald-700 ${className}`}
//     >
//       <ShoppingCart className="h-4 w-4 mr-2" />
//       {isAdding ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
//     </Button>
//   );
// }
//
//

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
  const [gramsOrdered, setGramsOrdered] = useState(50) // Default 50g
  const [loading, setLoading] = useState(false)
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(
    sizes.length > 0 ? sizes[0].id : null
  )

  const router = useRouter()

  // Get selected size details
  const selectedSize = sizes.find(s => s.id === selectedSizeId)
  const maxStock = selectedSize ? selectedSize.stock_quantity : product.stock_quantity
  const isOutOfStock = maxStock === 0
  
  // Calculate price based on grams ordered
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
        // Update grams_ordered
        const { error } = await supabase
          .from("cart_items")
          .update({ 
            grams_ordered: existingItem.grams_ordered + selectedGrams,
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
            grams_ordered: selectedGrams,
          },
        ])

        if (error) throw error
      }

      const sizeText = selectedSize ? ` (${selectedSize.size_grams}g)` : ''
      toast.success(`Added ${product.name}${sizeText} to cart`)
      
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Could not add item to cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-gray-900 mb-4">
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
                      : 'border-gray-300 hover:border-emerald-400 hover:shadow-sm'
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
          {selectedSize && (
            <p className="text-sm text-gray-600 mt-3">
              Selected: <span className="font-medium text-gray-900">{selectedSize.size_grams}g package</span>
            </p>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={loading || isOutOfStock}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 text-white py-6 text-base rounded-md font-medium tracking-wide transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ADDING TO CART...
          </>
        ) : isOutOfStock ? (
          'OUT OF STOCK'
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            ADD TO CART - KSh {Number(currentPrice).toFixed(2)}
          </>
        )}
      </Button>

      {/* Stock Info */}
      <div className="bg-gray-50 rounded-md p-4 space-y-2">
        {!isOutOfStock && maxStock <= 10 && (
          <p className="text-sm text-amber-600 font-medium">
            ⚠️ Only {maxStock} left in stock!
          </p>
        )}
        {selectedSize && (
          <div className="text-xs text-gray-600">
            <p>Package size: {selectedSize.size_grams}g</p>
            <p>Price per package: KSh {Number(selectedSize.price).toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
