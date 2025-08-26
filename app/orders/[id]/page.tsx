import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import AuthNav from "@/components/auth-nav";
import Image from "next/image";
import { Order, OrderItem } from "@/type/orderType";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const searchParamsResolved = await searchParams;

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

  // Get order details - use the resolved id
  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (
          id,
          name,
          description,
          price,
          category,
          image_url
        )
      )
    `,
    )
    .eq("id", id) // Use the resolved id here
    .eq("user_id", user.id)
    .single<Order>();

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700";
      case "shipped":
        return "bg-amber-100 text-amber-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "processing":
        return <Package className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return "bg-rose-100 text-rose-700";
      case "energy":
        return "bg-amber-100 text-amber-700";
      case "sleep":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-emerald-100 text-emerald-700";
    }
  };

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message - use resolved searchParams */}
        {searchParamsResolved?.success && (
          <Card className="bg-emerald-50 border-emerald-200 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-emerald-800">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-emerald-700">
                    Thank you for your order. We'll send you updates as it
                    progresses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <Link
          href="/orders"
          className="inline-flex items-center text-emerald-700 hover:text-emerald-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card className="bg-white shadow-lg border-emerald-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-emerald-800">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-amber-700 mt-1">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`${getStatusColor(order.status)} flex items-center gap-1`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Order Items */}
            <Card className="bg-white shadow-lg border-emerald-100">
              <CardHeader>
                <CardTitle className="text-emerald-800">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.order_items.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-4 border-b border-emerald-100 last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.products.image_url ? (
                        <Image
                          src={item.products.image_url || "/placeholder.svg"}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <Package className="h-6 w-6 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Badge
                        className={`mb-2 ${getCategoryColor(item.products.category)}`}
                      >
                        {item.products.category.replace("_", " ")}
                      </Badge>
                      <h4 className="font-semibold text-emerald-800">
                        {item.products.name}
                      </h4>
                      <p className="text-sm text-amber-700 line-clamp-2">
                        {item.products.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-amber-700">
                          Quantity: {item.quantity}
                        </span>
                        <span className="text-sm text-amber-700">
                          ${Number.parseFloat(item.price).toFixed(2)} each
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-800">
                        $
                        {(
                          Number.parseFloat(item.price) * item.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card className="bg-white shadow-lg border-emerald-100">
                <CardHeader>
                  <CardTitle className="text-emerald-800">
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-amber-700">
                    <p>
                      {order.shipping_address.firstName}{" "}
                      {order.shipping_address.lastName}
                    </p>
                    <p>{order.shipping_address.address}</p>
                    <p>
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.state}{" "}
                      {order.shipping_address.zipCode}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg border-emerald-100 sticky top-24">
              <CardHeader>
                <CardTitle className="text-emerald-800">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-amber-700">
                    <span>Subtotal ({order.order_items.length} items)</span>
                    <span>
                      ${Number.parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-emerald-100 pt-2">
                    <div className="flex justify-between text-lg font-semibold text-emerald-800">
                      <span>Total</span>
                      <span>
                        ${Number.parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div className="bg-emerald-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-emerald-800 mb-3">
                    Order Status
                  </h4>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 ${order.status === "pending" || order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? "text-emerald-700" : "text-gray-400"}`}
                    >
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Order Placed</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 ${order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? "text-emerald-700" : "text-gray-400"}`}
                    >
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Processing</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 ${order.status === "shipped" || order.status === "delivered" ? "text-emerald-700" : "text-gray-400"}`}
                    >
                      <Truck className="h-4 w-4" />
                      <span className="text-sm">Shipped</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 ${order.status === "delivered" ? "text-emerald-700" : "text-gray-400"}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4">
                  {order.status === "delivered" && (
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Reorder Items
                    </Button>
                  )}
                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 bg-transparent"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
