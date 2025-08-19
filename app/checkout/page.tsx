import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"
import Link from "next/link"
import AuthNav from "@/components/auth-nav"
import CheckoutForm from "@/components/checkout-form"

export default async function CheckoutPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let isAdmin = false
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  isAdmin = profile?.role === "admin"

  // Get cart items with product details
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
      *,
      products (
        id,
        name,
        price,
        category,
        image_url,
        stock_quantity,
        is_active
      )
    `)
    .eq("user_id", user.id)

  const validCartItems = cartItems?.filter((item) => item.products?.is_active) || []

  if (validCartItems.length === 0) {
    redirect("/cart")
  }

  const total = validCartItems.reduce((sum, item) => {
    return sum + Number.parseFloat(item.products.price) * item.quantity
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-800">Ūbūchi</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-amber-700 hover:text-emerald-800 transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-amber-700 hover:text-emerald-800 transition-colors">
                Shop
              </Link>
              <AuthNav user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Checkout</h1>
          <p className="text-amber-700">Complete your wellness tea order</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card className="bg-white shadow-lg border-emerald-100">
              <CardHeader>
                <CardTitle className="text-emerald-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {validCartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-2 border-b border-emerald-100 last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.products.image_url ? (
                        <img
                          src={item.products.image_url || "/placeholder.svg"}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Leaf className="h-6 w-6 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-emerald-800">{item.products.name}</h4>
                      <p className="text-sm text-amber-700">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-emerald-800 font-medium">
                      ${(Number.parseFloat(item.products.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-amber-700">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-emerald-100 pt-2">
                    <div className="flex justify-between text-lg font-semibold text-emerald-800">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <CheckoutForm cartItems={validCartItems} total={total} />
          </div>
        </div>
      </div>
    </div>
  )
}
