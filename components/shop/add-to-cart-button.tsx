"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"

interface AddToCartButtonProps {
  productId: string
  disabled?: boolean
  inStock?: boolean
  quantity?: number
  className?: string
}

export default function AddToCartButton({
  productId,
  disabled = false,
  inStock = true,
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(productId, quantity)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  if (justAdded) {
    return (
      <Button className={`bg-green-600 hover:bg-green-700 ${className}`} disabled>
        <Check className="h-4 w-4 mr-2" />
        Added!
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={`bg-emerald-600 hover:bg-emerald-700 ${className}`}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isAdding ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
    </Button>
  )
}
