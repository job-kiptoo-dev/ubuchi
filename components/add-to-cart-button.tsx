"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: any;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase.from("cart_items").insert([
          {
            user_id: user.id,
            product_id: product.id,
            quantity: quantity,
          },
        ]);

        if (error) throw error;
      }

      // Show success message or redirect to cart
      toast.success(`Added ${quantity} × ${product.name} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Could not add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (product.stock_quantity === 0) {
    return (
      <Button
        disabled
        className="w-full bg-gray-300 text-gray-500 cursor-not-allowed py-6 text-lg"
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="space-y-4">
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
          <span className="w-12 text-center font-medium text-emerald-800">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setQuantity(Math.min(product.stock_quantity, quantity + 1))
            }
            className="border-emerald-200 text-emerald-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart - $
            {(Number.parseFloat(product.price) * quantity).toFixed(2)}
          </>
        )}
      </Button>
    </div>
  );
}
