import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package, Leaf } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOrders() {
  const supabase = await createClient();

  // Get user with error handling
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth error:", userError);
    redirect("/auth/login");
  }

  // Check if user is admin with error handling
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    redirect("/");
  }

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  // Fetch orders, profiles, and order_items separately
  const [ordersResult, profilesResult, orderItemsResult] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, email, full_name"),
    supabase
      .from("order_items")
      .select("order_id, product_id, size_id, quantity, price, grams_ordered")
  ]);

  if (ordersResult.error) {
    console.error("Orders fetch error:", ordersResult.error);
  }

  // Create lookup maps
  const profilesMap = new Map(
    profilesResult.data?.map(p => [p.id, p]) || []
  );

  // Group order items by order_id
  const orderItemsMap = new Map();
  orderItemsResult.data?.forEach(item => {
    if (!orderItemsMap.has(item.order_id)) {
      orderItemsMap.set(item.order_id, []);
    }
    orderItemsMap.get(item.order_id).push(item);
  });

  // Merge the data
  const orders = ordersResult.data?.map(order => ({
    ...order,
    profiles: profilesMap.get(order.user_id),
    order_items: orderItemsMap.get(order.id) || []
  })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "paid":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-serif text-emerald-800">
                Úbūchi Admin
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/products"
                className="text-amber-700 hover:text-emerald-800 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="text-emerald-800 font-medium"
              >
                Orders
              </Link>
              <Link
                href="/"
                className="text-amber-700 hover:text-emerald-800 transition-colors"
              >
                Store
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-emerald-800 mb-2">
            Order Management
          </h1>
          <p className="text-amber-700">Track and manage customer orders</p>
          <p className="text-sm text-emerald-600 mt-1">
            Logged in as: {user.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-emerald-100">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-serif text-emerald-800">
                {orders.length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-blue-100">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-serif text-blue-800">
                {orders.filter(o => o.status === 'paid').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-amber-100">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-serif text-amber-800">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-emerald-100">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-serif text-emerald-800">
                KSh {orders.reduce((sum, o) => sum + Number(o.total_amount), 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Card
                key={order.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-serif text-gray-900">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <Badge
                          className={getStatusColor(order.status)}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        {order.mpesa_receipt && (
                          <Badge variant="outline" className="text-xs">
                            M-Pesa: {order.mpesa_receipt}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="mb-1">
                            <span className="font-medium text-gray-700">Customer:</span>{" "}
                            {order.profiles?.full_name || order.profiles?.email || "N/A"}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium text-gray-700">Email:</span>{" "}
                            {order.profiles?.email || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1">
                            <span className="font-medium text-gray-700">Order Date:</span>{" "}
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium text-gray-700">Items:</span>{" "}
                            {order.order_items.length} product(s)
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-2xl font-serif text-emerald-800 mb-3">
                        KSh {Number(order.total_amount).toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white shadow-lg border-emerald-100">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <p className="text-amber-700 text-lg mb-2">No orders yet</p>
                <p className="text-gray-600">
                  Orders will appear here when customers make purchases
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}