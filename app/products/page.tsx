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

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.log("Auth error:", authError);
    } else {
      user = authUser;
    }

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

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

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

  if (!supabase) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Leaf className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <h1 className="text-2xl font-serif text-neutral-900 mb-4">
              Service Unavailable
            </h1>
            <p className="text-neutral-600 font-light">
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
        return <Heart className="h-6 w-6 text-emerald-600" />;
      case "energy":
        return <Award className="h-6 w-6 text-amber-600" />;
      case "sleep":
        return <Moon className="h-6 w-6 text-emerald-600" />;
      default:
        return <Leaf className="h-6 w-6 text-emerald-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hormonal_balance":
        return "bg-amber-200 text-amber-800";
      case "energy":
        return "bg-amber-200 text-amber-800";
      case "sleep":
        return "bg-amber-200 text-amber-800";
      default:
        return "bg-amber-200 text-amber-800";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-serif text-neutral-900">
                Ūbūchi
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
              >
                Shop
              </Link>
              <AuthNav user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">
            Our Tea Collection
          </h1>
          <p className="text-xl text-neutral-600 font-light max-w-2xl mx-auto">
            Discover wellness teas crafted with African traditions and modern
            science
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 flex-shrink-0">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters
                  currentCategory={resolvedSearchParams.category}
                />
              </Suspense>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif text-neutral-900">
                  {resolvedSearchParams.category
                    ? `${resolvedSearchParams.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Teas`
                    : resolvedSearchParams.search
                      ? `Search Results for "${resolvedSearchParams.search}"`
                      : "All Teas"}
                </h2>
                <p className="text-neutral-600 font-light">
                  {products?.length || 0} products
                </p>
              </div>

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

              <Suspense fallback={<div>Loading products...</div>}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <Card
                        key={product.id}
                        className="bg-neutral-50 shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow overflow-hidden"
                      >
                        <div className="aspect-square bg-amber-200 flex items-center justify-center relative">
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
                              <Badge className="absolute top-2 right-2 bg-amber-200 text-amber-800">
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
                          <h3 className="text-xl font-serif text-neutral-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-neutral-600 font-light mb-4 line-clamp-3">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-serif text-neutral-900">
                              ${Number.parseFloat(product.price).toFixed(2)}
                            </span>
                            <Link href={`/products/${product.id}`}>
                              <Button className="bg-emerald-600 hover:bg-emerald-700 font-medium transition-transform hover:scale-105">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : !error ? (
                    <div className="col-span-full text-center py-12">
                      <Leaf className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                      <h3 className="text-xl font-serif text-neutral-900 mb-2">
                        No products found
                      </h3>
                      <p className="text-neutral-600 font-light">
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

        {!error &&
          !resolvedSearchParams.search &&
          !resolvedSearchParams.category && (
            <div className="mt-16 bg-neutral-50 rounded-2xl shadow-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-serif text-neutral-900 text-center mb-8">
                Shop by Wellness Goal
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <Link
                  href="/products?category=hormonal_balance"
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-300 transition-colors">
                    <Heart className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-neutral-900 mb-2">
                    Hormonal Balance
                  </h3>
                  <p className="text-sm text-neutral-600 font-light">
                    Support your natural rhythm
                  </p>
                </Link>
                <Link
                  href="/products?category=energy"
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-300 transition-colors">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-serif text-neutral-900 mb-2">
                    Energy Boost
                  </h3>
                  <p className="text-sm text-neutral-600 font-light">
                    Natural vitality enhancement
                  </p>
                </Link>
                <Link
                  href="/products?category=sleep"
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-300 transition-colors">
                    <Moon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-neutral-900 mb-2">
                    Sleep Support
                  </h3>
                  <p className="text-sm text-neutral-600 font-light">
                    Restful evening rituals
                  </p>
                </Link>
                <Link
                  href="/products?category=wellness"
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-300 transition-colors">
                    <Leaf className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-neutral-900 mb-2">
                    General Wellness
                  </h3>
                  <p className="text-sm text-neutral-600 font-light">
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
