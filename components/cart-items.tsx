"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, Heart, Award, Leaf } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { toast } from "sonner";

interface CartItemsProps {
  cartItems: any[];
}

export default function CartItems({ cartItems }: CartItemsProps) {
  const [items, setItems] = useState(cartItems);
  const supabase = createClient();

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "tea":
        return <Leaf className="h-5 w-5 text-emerald-600" />;
      case "coffee":
        return <Award className="h-5 w-5 text-amber-600" />;
      case "chocolate":
        return <Heart className="h-5 w-5 text-rose-600" />;
      default:
        return <Leaf className="h-5 w-5 text-emerald-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "tea":
        return "bg-emerald-100 text-emerald-700";
      case "coffee":
        return "bg-amber-100 text-amber-700";
      case "chocolate":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  // Update grams in cart by adding/subtracting the size grams
  const updateGrams = async (
    itemId: string,
    currentGrams: number,
    sizeGrams: number,
    operation: 'add' | 'subtract',
    maxStock: number
  ) => {
    const newGrams = operation === 'add' 
      ? currentGrams + sizeGrams 
      : currentGrams - sizeGrams;

    // Don't allow going below one package or exceeding stock
    if (newGrams < sizeGrams || newGrams > maxStock * sizeGrams) return;

    const prevItems = [...items];

    // Optimistic update
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, grams_ordered: newGrams }
          : item
      )
    );

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ 
          grams_ordered: newGrams,
          updated_at: new Date().toISOString()
        })
        .eq("id", itemId);

      if (error) throw error;
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Could not update quantity");
      setItems(prevItems);
      console.error(error);
    }
  };

  const removeItem = async (itemId: string) => {
    const prevItems = [...items];

    setItems((current) => current.filter((item) => item.id !== itemId));

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Could not remove item");
      setItems(prevItems);
      console.error(error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-16 w-16 text-emerald-600 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-serif text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        // Calculate quantity (how many packages) and get size info
        const sizeGrams = item.product_sizes?.size_grams || 50;
        const sizePrice = item.product_sizes?.price || item.products?.price || 0;
        const quantity = Math.floor(item.grams_ordered / sizeGrams);
        const maxStock = item.product_sizes?.stock_quantity || item.products?.stock_quantity || 0;
        const productName = item.products?.name || "Product";
        const productCategory = item.products?.category || "general";
        const productDescription = item.products?.description || "";
        const productImage = item.products?.image_url;

        return (
          <Card key={item.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {productImage && 
                   productImage !== 'https://example.com/tea.jpg' && 
                   productImage !== 'https://example.com/coffee.jpg' && 
                   productImage !== 'https://example.com/chocolate.jpg' ? (
                    <Image
                      src={productImage}
                      alt={productName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-emerald-600">
                      {getCategoryIcon(productCategory)}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Badge
                        className={`mb-2 ${getCategoryColor(productCategory)}`}
                      >
                        {productCategory}
                      </Badge>

                      <h3 className="text-lg font-serif text-gray-900 mb-1">
                        {productName}
                      </h3>

                      {item.product_sizes && (
                        <p className="text-sm text-gray-600 mb-2">
                          Size: <span className="font-medium">{sizeGrams}g</span>
                        </p>
                      )}

                      {productDescription && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {productDescription}
                        </p>
                      )}

                      <div className="text-base font-medium text-gray-900">
                        KSh {Number(sizePrice).toFixed(2)} per package
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateGrams(
                              item.id,
                              item.grams_ordered,
                              sizeGrams,
                              'subtract',
                              maxStock
                            )
                          }
                          disabled={quantity <= 1}
                          className="border-gray-300 hover:border-emerald-600 text-gray-700 h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-12 text-center font-medium text-gray-900">
                          {quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateGrams(
                              item.id,
                              item.grams_ordered,
                              sizeGrams,
                              'add',
                              maxStock
                            )
                          }
                          disabled={quantity >= maxStock}
                          className="border-gray-300 hover:border-emerald-600 text-gray-700 h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-lg font-serif text-gray-900 mb-3">
                        KSh {(Number(sizePrice) * quantity).toFixed(2)}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Stock Warning */}
                  {maxStock <= 5 && maxStock > 0 && (
                    <div className="mt-3 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                      ⚠️ Only {maxStock} left in stock
                    </div>
                  )}

                  {/* Total Grams Info */}
                  <div className="mt-3 text-xs text-gray-500">
                    Total: {item.grams_ordered}g ({quantity} × {sizeGrams}g packages)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}