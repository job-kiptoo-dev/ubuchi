import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
// import { createClient } from "@/lib/supabase/client"
// import { createClient } from "@/lib/supabase/server"

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

  // Get all orders with user information
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles:user_id (
        email,
        full_name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Orders fetch error:", ordersError);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">
            Order Management
          </h1>
          <p className="text-amber-700">Track and manage customer orders</p>
          <p className="text-sm text-emerald-600">Logged in as: {user.email}</p>
        </div>

        <div className="space-y-6">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Card
                key={order.id}
                className="bg-white shadow-lg border-emerald-100"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-emerald-800">
                          Order #{order.id.slice(0, 8)}
                        </h3>
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
                      <div className="text-sm text-amber-700 space-y-1">
                        <p>
                          Customer:{" "}
                          {order.profiles?.full_name || order.profiles?.email}
                        </p>
                        <p>Email: {order.profiles?.email}</p>
                        <p>
                          Order Date:{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-800 mb-2">
                        ${Number.parseFloat(order.total_amount).toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-600 text-emerald-600 bg-transparent"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Update Status
                        </Button>
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
                <p className="text-amber-600">
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
