import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Leaf, ShoppingBag } from "lucide-react";
import Link from "next/link";

import AuthNav from "@/components/auth-nav";
import { createClient } from "@/lib/supabase/server";

import CartItems from "@/components/cart-items";

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let isAdmin = false;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  isAdmin = profile?.role === "admin";

  // Fetch cart items, products, and sizes separately
  const [cartResult, productsResult, sizesResult] = await Promise.all([
    supabase
      .from("cart_items")
      .select("id, product_id, size_id, grams_ordered, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("id, name, price, image_url, description, category, is_active, stock_quantity"),
    supabase
      .from("product_sizes")
      .select("id, product_id, size_grams, price, stock_quantity")
  ]);

  if (cartResult.error) {
    console.error("Cart fetch error:", cartResult.error);
  }

  // Create lookup maps for products and sizes
  const productsMap = new Map(
    productsResult.data?.map(p => [p.id, p]) || []
  );
  const sizesMap = new Map(
    sizesResult.data?.map(s => [s.id, s]) || []
  );

  // Merge the data
  const cartItems = cartResult.data?.map(item => ({
    ...item,
    products: productsMap.get(item.product_id),
    product_sizes: item.size_id ? sizesMap.get(item.size_id) : null
  })) || [];

  // Filter out items with inactive products
  const validCartItems =
    cartItems?.filter((item) => item.products?.is_active) || [];

  // Calculate total based on size price or product price
  const total = validCartItems.reduce((sum, item) => {
    const sizePrice = item.product_sizes?.price || item.products?.price || 0;
    const sizeGrams = item.product_sizes?.size_grams || 50;
    const quantity = Math.floor(item.grams_ordered / sizeGrams);
    return sum + Number(sizePrice) * quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <ShoppingBag className="text-emerald-700 h-12 w-12" />
              <h1 className="text-4xl font-serif text-emerald-900 tracking-tight">
                Your Cart
              </h1>
            </div>
            <p className="text-amber-700 text-lg">
              Review your selection
            </p>
          </div>

          {validCartItems.length > 0 ? (
            <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
              {/* Cart Items */}
              <div className="space-y-6">
                <CartItems cartItems={validCartItems} />
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-white shadow-lg border border-emerald-100 sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-serif text-emerald-900">
                      Order Summary
                    </h2>

                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>KSh {total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping</span>
                        <span className="text-emerald-600">
                          {total >= 2000 ? "Free" : "KSh 200"}
                        </span>
                      </div>
                      {total < 2000 && (
                        <p className="text-sm text-amber-600">
                          Add KSh {(2000 - total).toFixed(2)} more for free shipping
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-xl font-serif text-emerald-900">
                        <span>Total</span>
                        <span>
                          KSh {(total + (total >= 2000 ? 0 : 200)).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg rounded-md">
                      <Link href="/checkout" className="w-full">
                      Proceed to Checkout
                      </Link>
                    </Button>

                    <div className="text-center">
                      <Link
                        href="/products"
                        className="text-sm text-emerald-700 hover:text-emerald-800 underline"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="bg-white shadow-lg rounded-2xl border-emerald-100 text-center py-20">
              <CardContent>
                <ShoppingBag className="h-20 w-20 text-emerald-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
                  Your cart is empty
                </h3>
                <p className="text-amber-700 mb-8">
                  Discover our collection to start your journey
                </p>
                <Link href="/products">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-6 py-3">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}