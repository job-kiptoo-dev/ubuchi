"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, Heart, Moon, Award, Leaf } from "lucide-react"
// import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface CartItemsProps {
  cartItems: any[]
}

export default function CartItems({ cartItems }: CartItemsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return <Heart className="h-5 w-5" />
      case "energy":
        return <Award className="h-5 w-5" />
      case "sleep":
        return <Moon className="h-5 w-5" />
      default:
        return <Leaf className="h-5 w-5" />
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

  const updateQuantity = async (itemId: string, newQuantity: number, maxStock: number) => {
    if (newQuantity < 1 || newQuantity > maxStock) return

    setLoading(itemId)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", itemId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating quantity:", error)
      alert("Error updating quantity. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const removeItem = async (itemId: string) => {
    setLoading(itemId)
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error removing item:", error)
      alert("Error removing item. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <Card key={item.id} className="bg-white shadow-lg border-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {/* Product Image */}
              <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.products.image_url ? (
                  <img
                    src={item.products.image_url || "/placeholder.svg"}
                    alt={item.products.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-emerald-600">{getCategoryIcon(item.products.category)}</div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={`mb-2 ${getCategoryColor(item.products.category)}`}>
                      {item.products.category.replace("_", " ")}
                    </Badge>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-1">{item.products.name}</h3>
                    <p className="text-amber-700 text-sm mb-3 line-clamp-2">{item.products.description}</p>
                    <div className="text-lg font-bold text-emerald-800">
                      ${Number.parseFloat(item.products.price).toFixed(2)} each
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.products.stock_quantity)}
                        disabled={loading === item.id || item.quantity <= 1}
                        className="border-emerald-200 text-emerald-700 h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium text-emerald-800">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.products.stock_quantity)}
                        disabled={loading === item.id || item.quantity >= item.products.stock_quantity}
                        className="border-emerald-200 text-emerald-700 h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-lg font-bold text-emerald-800 mb-2">
                      ${(Number.parseFloat(item.products.price) * item.quantity).toFixed(2)}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={loading === item.id}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Stock Warning */}
                {item.products.stock_quantity <= 5 && (
                  <div className="mt-3 text-sm text-amber-600">Only {item.products.stock_quantity} left in stock</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
