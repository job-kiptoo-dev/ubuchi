// import { createClient } from "@/lib/supabase/serveVr";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Moon,
  Award,
  Leaf,
  ArrowLeft,
  ShoppingCart,
  Star,
} from "lucide-react";
import Link from "next/link";
import AuthNav from "@/components/auth-nav";
import AddToCartButton from "@/components/add-to-cart-button";
import { createClient } from "@/lib/supabase/client";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  // Get product details
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product || !product.is_active) {
    notFound();
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return <Heart className="h-8 w-8" />;
      case "energy":
        return <Award className="h-8 w-8" />;
      case "sleep":
        return <Moon className="h-8 w-8" />;
      default:
        return <Leaf className="h-8 w-8" />;
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

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return "from-rose-100 to-pink-100";
      case "energy":
        return "from-amber-100 to-orange-100";
      case "sleep":
        return "from-indigo-100 to-purple-100";
      default:
        return "from-emerald-100 to-teal-100";
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-emerald-700 hover:text-emerald-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div
              className={`aspect-square bg-gradient-to-br ${getCategoryGradient(product.category)} rounded-2xl flex items-center justify-center overflow-hidden shadow-lg`}
            >
              {product.image_url ? (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-emerald-600">
                  {getCategoryIcon(product.category)}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className={`mb-4 ${getCategoryColor(product.category)}`}>
                {product.category.replace("_", " ")}
              </Badge>
              <h1 className="text-4xl font-bold text-emerald-800 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-emerald-800">
                  ${Number.parseFloat(product.price).toFixed(2)}
                </span>
                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                  <Badge className="bg-amber-100 text-amber-700">
                    Only {product.stock_quantity} left
                  </Badge>
                )}
                {product.stock_quantity === 0 && (
                  <Badge className="bg-red-100 text-red-700">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            <div className="prose prose-emerald max-w-none">
              <p className="text-lg text-amber-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Benefits Section */}
            <Card className="bg-white shadow-lg border-emerald-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                  Wellness Benefits
                </h3>
                <div className="space-y-2">
                  {product.category === "hormonal_balance" && (
                    <>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Supports natural hormone balance
                      </div>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Promotes women's wellness
                      </div>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Traditional African herbs
                      </div>
                    </>
                  )}
                  {product.category === "energy" && (
                    <>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Natural energy boost
                      </div>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        No caffeine crash
                      </div>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Enhanced focus and vitality
                      </div>
                    </>
                  )}
                  {product.category === "sleep" && (
                    <>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Promotes restful sleep
                      </div>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Calming evening ritual
                      </div>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Natural relaxation
                      </div>
                    </>
                  )}
                  {product.category === "wellness" && (
                    <>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Overall health support
                      </div>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Antioxidant rich
                      </div>
                      <div className="flex items-center gap-2 text-amber-700">
                        <Star className="h-4 w-4 text-emerald-600" />
                        Immune system boost
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart */}
            <div className="space-y-4">
              {user ? (
                <AddToCartButton product={product} />
              ) : (
                <div className="space-y-2">
                  <Button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 cursor-not-allowed py-6 text-lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Sign in to Purchase
                  </Button>
                  <p className="text-sm text-amber-600 text-center">
                    <Link
                      href="/auth/login"
                      className="underline hover:text-emerald-700"
                    >
                      Sign in
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/auth/sign-up"
                      className="underline hover:text-emerald-700"
                    >
                      create an account
                    </Link>{" "}
                    to add items to your cart
                  </p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                  Product Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Category:</span>
                    <span className="text-emerald-800 font-medium">
                      {product.category.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Stock:</span>
                    <span className="text-emerald-800 font-medium">
                      {product.stock_quantity > 0
                        ? `${product.stock_quantity} available`
                        : "Out of stock"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Origin:</span>
                    <span className="text-emerald-800 font-medium">Kenya</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Farming:</span>
                    <span className="text-emerald-800 font-medium">
                      Women-owned farms
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
