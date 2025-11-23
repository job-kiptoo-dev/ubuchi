import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import Link from "next/link";
import AuthNav from "@/components/auth-nav";
import CheckoutForm from "@/components/checkout-form";
import Image from "next/image";

export default async function CheckoutPage() {
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

  const validCartItems = cartItems.filter((item) => item.products?.is_active) || [];

  if (validCartItems.length === 0) {
    redirect("/cart");
  }

  // Calculate total based on size price and quantity
  const total = validCartItems.reduce((sum, item) => {
    const sizePrice = item.product_sizes?.price || item.products?.price || 0;
    const sizeGrams = item.product_sizes?.size_grams || 50;
    const quantity = Math.floor(item.grams_ordered / sizeGrams);
    return sum + Number(sizePrice) * quantity;
  }, 0);

  const shippingCost = total >= 2000 ? 0 : 200;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-serif text-emerald-800">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-emerald-800 mb-2">Checkout</h1>
          <p className="text-amber-700">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card className="bg-white shadow-lg border-emerald-100">
              <CardHeader>
                <CardTitle className="text-emerald-800">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {validCartItems.map((item) => {
                  const sizeGrams = item.product_sizes?.size_grams || 50;
                  const sizePrice = item.product_sizes?.price || item.products?.price || 0;
                  const quantity = Math.floor(item.grams_ordered / sizeGrams);
                  const itemTotal = Number(sizePrice) * quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-2 border-b border-emerald-100 last:border-b-0"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.products?.image_url && 
                         item.products.image_url !== 'https://example.com/tea.jpg' && 
                         item.products.image_url !== 'https://example.com/coffee.jpg' && 
                         item.products.image_url !== 'https://example.com/chocolate.jpg' ? (
                          <Image
                            src={item.products.image_url}
                            alt={item.products.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Leaf className="h-6 w-6 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-emerald-800">
                          {item.products?.name}
                        </h4>
                        <p className="text-sm text-amber-700">
                          {quantity} × {sizeGrams}g
                        </p>
                      </div>
                      <div className="text-emerald-800 font-medium">
                        KSh {itemTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-amber-700">
                    <span>Subtotal</span>
                    <span>KSh {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-emerald-600 font-medium" : ""}>
                      {shippingCost === 0 ? "Free" : `KSh ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {total < 2000 && (
                    <p className="text-sm text-amber-600">
                      Add KSh {(2000 - total).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-emerald-100 pt-2">
                    <div className="flex justify-between text-lg font-serif text-emerald-800">
                      <span>Total</span>
                      <span>KSh {(total + shippingCost).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <CheckoutForm 
              cartItems={validCartItems} 
              total={total + shippingCost} 
              subtotal={total}
              shipping={shippingCost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}