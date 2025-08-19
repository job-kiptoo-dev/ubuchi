import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  // Get dashboard stats
  const { data: products } = await supabase.from("products").select("*")
  const { data: orders } = await supabase.from("orders").select("*")
  const { data: users } = await supabase.from("profiles").select("*")

  const activeProducts = products?.filter((p) => p.is_active).length || 0
  const totalOrders = orders?.length || 0
  const totalUsers = users?.length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + Number.parseFloat(order.total_amount), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Admin Dashboard</h1>
          <p className="text-amber-700">Manage your Ūbūchi tea business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Active Products</CardTitle>
              <Package className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-800">{activeProducts}</div>
              <p className="text-xs text-amber-600">Products available for sale</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-800">{totalOrders}</div>
              <p className="text-xs text-amber-600">Orders received</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Customers</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-800">{totalUsers}</div>
              <p className="text-xs text-amber-600">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-800">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-amber-600">Total sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800">Product Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-amber-700 text-sm">Add new teas, update inventory, and manage your product catalog.</p>
              <div className="flex gap-2">
                <Link href="/admin/products">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">View Products</Button>
                </Link>
                <Link href="/admin/products/new">
                  <Button
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    Add Product
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800">Order Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-amber-700 text-sm">
                Process orders, update shipping status, and manage customer orders.
              </p>
              <Link href="/admin/orders">
                <Button className="bg-emerald-600 hover:bg-emerald-700">View Orders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800">Customer Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-amber-700 text-sm">View customer information and manage user accounts.</p>
              <Link href="/admin/customers">
                <Button className="bg-emerald-600 hover:bg-emerald-700">View Customers</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                      <div>
                        <p className="font-medium text-emerald-800">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-amber-700">${Number.parseFloat(order.total_amount).toFixed(2)}</p>
                      </div>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "shipped"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          order.status === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "shipped"
                              ? "bg-amber-100 text-amber-700"
                              : "border-emerald-200 text-emerald-600"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-700 text-center py-8">No orders yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
