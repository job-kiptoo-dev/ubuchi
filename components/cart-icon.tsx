"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function CartIcon({ userId }: { userId?: string }) {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    const fetchCartCount = async () => {
      const { count, error } = await supabase
        .from("cart_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      if (!error) {
        setItemCount(count || 0)
      }
    }

    fetchCartCount()

    // REALTIME updates
    const channel = supabase
      .channel("cart_items_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchCartCount()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  return (
    <Link href="/cart">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
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
