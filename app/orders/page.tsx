import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, Package, Eye, ShoppingBag } from "lucide-react"
import Link from "next/link"
import AuthNav from "@/components/auth-nav"

export default async function OrdersPage() {
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

  // Get user's orders
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          image_url,
          category
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700"
      case "shipped":
        return "bg-amber-100 text-amber-700"
      case "processing":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

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
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">My Orders</h1>
          <p className="text-amber-700">Track your wellness tea orders</p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white shadow-lg border-emerald-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-emerald-800">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-amber-700 mt-1">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      <div className="text-lg font-bold text-emerald-800 mt-1">
                        ${Number.parseFloat(order.total_amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items Preview */}
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                      {order.order_items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.products.image_url ? (
                              <img
                                src={item.products.image_url || "/placeholder.svg"}
                                alt={item.products.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-emerald-800 truncate max-w-32">
                              {item.products.name}
                            </p>
                            <p className="text-xs text-amber-700">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.order_items.length > 3 && (
                        <div className="text-sm text-amber-700 flex-shrink-0">
                          +{order.order_items.length - 3} more items
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-emerald-100">
                      <Link href={`/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-600 text-emerald-600 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm" className="border-amber-600 text-amber-600 bg-transparent">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-lg border-emerald-100">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">No orders yet</h3>
              <p className="text-amber-700 mb-6">Start your wellness journey by placing your first order</p>
              <Link href="/products">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Shop Our Teas</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
