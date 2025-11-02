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

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
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
    `)
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
              <span className="text-2xl font-semibold text-emerald-800">
                Úbūchi
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
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <ShoppingBag className="text-emerald-700 h-20 w-20," />
              <h1 className="text-4xl font-bold text-emerald-900 tracking-tight">
                Your Cart
              </h1>
            </div>
            <p className="text-amber-700 text-lg">
              Review your wellness tea selection
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
                {/* ...order summary card... */}
              </div>
            </div>
          ) : (
            <Card className="bg-white shadow-lg rounded-2xl border-emerald-100 text-center py-20">
              <CardContent>
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
    </div>
  );
}

