import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Moon, Award, Leaf } from "lucide-react";
import Link from "next/link";
import ProductFilters from "@/components/product-filters";
import AuthNav from "@/components/auth-nav";
import Image from "next/image";

interface SearchParams {
  category?: string;
  search?: string;
}

interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Await the searchParams Promise
  const resolvedSearchParams = await searchParams;

  let user = null;
  let isAdmin = false;
  let products = null;
  let error = null;
  const supabase = await createClient();

  try {
    if (!supabase) {
      throw new Error("Failed to create Supabase client");
    }

    // Get user authentication
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.log("Auth error:", authError);
    } else {
      user = authUser;
    }

    // Get user profile for admin check
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.log("Profile error:", profileError);
      } else {
        isAdmin = profile?.role === "admin";
      }
    }

    // Build and execute products query
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // Apply filters using resolved searchParams
    if (resolvedSearchParams.category) {
      query = query.eq("category", resolvedSearchParams.category);
    }

    if (resolvedSearchParams.search) {
      query = query.ilike("name", `%${resolvedSearchParams.search}%`);
    }

    const { data: productsData, error: productsError } = await query;

    if (productsError) {
      console.log("Products error:", productsError);
      error = "Failed to load products";
    } else {
      products = productsData;
    }
  } catch (catchError) {
    console.log("Error setting up Supabase:", catchError);
    error = "Service temporarily unavailable";
  }

  // If critical error, show error page
  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Leaf className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Service Unavailable
            </h1>
            <p className="text-gray-600">
              We're experiencing technical difficulties. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return <Heart className="h-6 w-6" />;
      case "energy":
        return <Award className="h-6 w-6" />;
      case "sleep":
        return <Moon className="h-6 w-6" />;
      default:
        return <Leaf className="h-6 w-6" />;
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
              <Link href="/products" className="text-emerald-800 font-medium">
                Shop
              </Link>
              <AuthNav user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            Our Tea Collection
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Discover wellness teas crafted with African traditions and modern
            science
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters
                  currentCategory={resolvedSearchParams.category}
                />
              </Suspense>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-emerald-800">
                  {resolvedSearchParams.category
                    ? `${resolvedSearchParams.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Teas`
                    : resolvedSearchParams.search
                      ? `Search Results for "${resolvedSearchParams.search}"`
                      : "All Teas"}
                </h2>
                <p className="text-amber-700">
                  {products?.length || 0} products
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-red-600">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <Suspense fallback={<div>Loading products...</div>}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <Card
                        key={product.id}
                        className="bg-white shadow-lg border-emerald-100 hover:shadow-xl transition-shadow overflow-hidden"
                      >
                        <div className="aspect-square bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center relative">
                          {product.image_url ? (
                            <Image
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-emerald-600">
                              {getCategoryIcon(product.category)}
                            </div>
                          )}
                          {product.stock_quantity <= 5 &&
                            product.stock_quantity > 0 && (
                              <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-700">
                                Low Stock
                              </Badge>
                            )}
                          {product.stock_quantity === 0 && (
                            <Badge className="absolute top-2 right-2 bg-red-100 text-red-700">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <Badge
                            className={`mb-3 ${getCategoryColor(product.category)}`}
                          >
                            {product.category.replace("_", " ")}
                          </Badge>
                          <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-amber-700 mb-4 line-clamp-3">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-emerald-800">
                              ${Number.parseFloat(product.price).toFixed(2)}
                            </span>
                            <Link href={`/products/${product.id}`}>
                              <Button className="bg-emerald-600 hover:bg-emerald-700">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : !error ? (
                    <div className="col-span-full text-center py-12">
                      <Leaf className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                        No products found
                      </h3>
                      <p className="text-amber-700">
                        {resolvedSearchParams.search
                          ? `No products match "${resolvedSearchParams.search}". Try a different search term.`
                          : "Try adjusting your search or filter criteria"}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Suspense>
            </div>
          </div>
        </div>

        {/* Categories Overview - Only show if no error and no active filters */}
        {!error &&
          !resolvedSearchParams.search &&
          !resolvedSearchParams.category && (
            <div className="mt-16 bg-white rounded-2xl shadow-lg border-emerald-100 p-8">
              <h2 className="text-2xl font-bold text-emerald-800 text-center mb-8">
                Shop by Wellness Goal
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <Link
                  href="/products?category=hormonal_balance"
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
                    <Heart className="h-8 w-8 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-emerald-800 mb-2">
                    Hormonal Balance
                  </h3>
                  <p className="text-sm text-amber-700">
                    Support your natural rhythm
                  </p>
                </Link>
                <Link
                  href="/products?category=energy"
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-emerald-800 mb-2">
                    Energy Boost
                  </h3>
                  <p className="text-sm text-amber-700">
                    Natural vitality enhancement
                  </p>
                </Link>
                <Link
                  href="/products?category=sleep"
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                    <Moon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-emerald-800 mb-2">
                    Sleep Support
                  </h3>
                  <p className="text-sm text-amber-700">
                    Restful evening rituals
                  </p>
                </Link>
                <Link
                  href="/products?category=wellness"
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                    <Leaf className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-emerald-800 mb-2">
                    General Wellness
                  </h3>
                  <p className="text-sm text-amber-700">
                    Overall health support
                  </p>
                </Link>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
