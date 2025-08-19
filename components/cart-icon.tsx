"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface CartIconProps {
  userId?: string
}

export default function CartIcon({ userId }: CartIconProps) {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    const fetchCartCount = async () => {
      try {
        const { data } = await supabase.from("cart_items").select("quantity").eq("user_id", userId)

        const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0
        setItemCount(total)
      } catch (error) {
        console.error("Error fetching cart count:", error)
      }
    }

    fetchCartCount()

    // Subscribe to cart changes
    const channel = supabase
      .channel("cart_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchCartCount()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return (
    <Link href="/cart">
      <Button
        variant="ghost"
        size="icon"
        className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 relative"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-emerald-600 text-white text-xs">
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
