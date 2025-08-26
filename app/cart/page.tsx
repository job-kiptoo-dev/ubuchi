import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Leaf, ShoppingBag, ArrowRight } from "lucide-react";
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

  // Get cart items with product details
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      products (
        id,
        name,
        description,
        price,
        category,
        image_url,
        stock_quantity,
        is_active
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const validCartItems =
    cartItems?.filter((item) => item.products?.is_active) || [];

  const total = validCartItems.reduce((sum, item) => {
    return sum + Number.parseFloat(item.products.price) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-800">
                Ūbūchi
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-amber-700 hover:text-emerald-800 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-amber-700 hover:text-emerald-800 transition-colors"
              >
                Shop
              </Link>
              <AuthNav user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            Your Cart
          </h1>
          <p className="text-amber-700 text-lg">
            Review your wellness tea selection
          </p>
        </div>

        {validCartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <CartItems cartItems={validCartItems} />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-xl rounded-2xl border border-emerald-100 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-xl">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-3 divide-y divide-emerald-100">
                    <div className="flex justify-between text-amber-700 pb-2">
                      <span>Subtotal ({validCartItems.length} items)</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-amber-700 pt-2 pb-2">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-emerald-800 pt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-amber-600 hover:opacity-90 py-6 text-lg rounded-xl transition">
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>

                  {/* Continue Shopping */}
                  <div className="text-center">
                    <Link
                      href="/products"
                      className="text-emerald-600 hover:text-emerald-700 text-sm underline"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Benefits */}
                  <div className="bg-emerald-50 rounded-xl p-5 mt-6">
                    <h4 className="font-semibold text-emerald-800 mb-3">
                      Your Benefits
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="text-emerald-600">✓</span>
                        <span>Free shipping on all orders</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-emerald-600">✓</span>
                        <span>30-day satisfaction guarantee</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-emerald-600">✓</span>
                        <span>Supporting women farmers in Kenya</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-emerald-600">✓</span>
                        <span>Sustainably sourced ingredients</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <Card className="bg-white shadow-lg rounded-2xl border-emerald-100">
            <CardContent className="p-16 text-center">
              <ShoppingBag className="h-20 w-20 text-emerald-400 mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
                Your cart is empty
              </h3>
              <p className="text-amber-700 mb-8">
                Discover our collection of wellness teas to start your journey
              </p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:opacity-90 rounded-xl px-6 py-3">
                  Shop Our Teas
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
