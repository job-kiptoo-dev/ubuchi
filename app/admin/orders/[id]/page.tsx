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
  Award,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  // Fetch order, order_items, products, sizes, and customer profile
  const [orderResult, orderItemsResult, productsResult, sizesResult, profilesResult] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id),
    supabase
      .from("products")
      .select("id, name, description, price, category, image_url"),
    supabase
      .from("product_sizes")
      .select("id, size_grams, price"),
    supabase
      .from("profiles")
      .select("id, email, full_name")
  ]);

  const order = orderResult.data;

  if (!order) {
    notFound();
  }

  // Create lookup maps
  const productsMap = new Map(
    productsResult.data?.map(p => [p.id, p]) || []
  );
  const sizesMap = new Map(
    sizesResult.data?.map(s => [s.id, s]) || []
  );
  const profilesMap = new Map(
    profilesResult.data?.map(p => [p.id, p]) || []
  );

  const customerProfile = profilesMap.get(order.user_id);

  // Merge order items with products and sizes
  const orderItems = orderItemsResult.data?.map(item => ({
    ...item,
    products: productsMap.get(item.product_id),
    product_sizes: item.size_id ? sizesMap.get(item.size_id) : null
  })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700";
      case "shipped":
        return "bg-amber-100 text-amber-700";
      case "paid":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
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
      case "paid":
      case "pending":
        return <Package className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "tea":
        return "bg-emerald-100 text-emerald-700";
      case "coffee":
        return "bg-amber-100 text-amber-700";
      case "chocolate":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "tea":
        return <Leaf className="h-5 w-5 text-emerald-600" />;
      case "coffee":
        return <Award className="h-5 w-5 text-amber-600" />;
      case "chocolate":
        return <Heart className="h-5 w-5 text-rose-600" />;
      default:
        return <Package className="h-5 w-5 text-neutral-600" />;
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-emerald-700 hover:text-emerald-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 text-2xl font-serif">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`${getStatusColor(order.status)} flex items-center gap-2 px-3 py-1`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    {order.mpesa_receipt && (
                      <p className="text-xs text-gray-500 mt-2">
                        M-Pesa: {order.mpesa_receipt}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Customer Info */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 font-serif">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {customerProfile?.full_name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {customerProfile?.email || "N/A"}
                  </p>
                  {order.shipping_address?.phoneNumber && (
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {order.shipping_address.phoneNumber}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 font-serif">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.map((item: any) => {
                  const sizeGrams = item.product_sizes?.size_grams || 50;
                  const itemTotal = Number(item.price) * item.quantity;
                  
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.products?.image_url && 
                         item.products.image_url !== 'https://example.com/tea.jpg' && 
                         item.products.image_url !== 'https://example.com/coffee.jpg' && 
                         item.products.image_url !== 'https://example.com/chocolate.jpg' ? (
                          <Image
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-full h-full object-cover"
                            width={80}
                            height={80}
                          />
                        ) : (
                          getCategoryIcon(item.products?.category)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge
                          className={`mb-2 ${getCategoryColor(item.products?.category)}`}
                        >
                          {item.products?.category}
                        </Badge>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {item.products?.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Size: {sizeGrams}g</span>
                          <span>Qty: {item.quantity}</span>
                          <span>KSh {Number(item.price).toFixed(2)} each</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Total: {item.grams_ordered}g ({item.quantity} × {sizeGrams}g)
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-serif text-lg text-gray-900">
                          KSh {itemTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-serif">
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 space-y-1">
                    <p className="font-medium">
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

          {/* Order Summary & Actions */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm border border-gray-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-gray-900 font-serif">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({orderItems.length} items)</span>
                    <span>KSh {Number(order.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-serif text-gray-900">
                      <span>Total</span>
                      <span>KSh {Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                  {/* You can add status update buttons here */}
                  <p className="text-sm text-gray-600">
                    Current status: <span className="font-medium">{order.status}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}