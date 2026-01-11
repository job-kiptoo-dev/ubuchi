import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Moon, Award, Leaf, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductFilters from "@/components/product-filters";
import AuthNav from "@/components/auth-nav";
import Image from "next/image";

interface SearchParams {
  tea?: string;
  search?: string;
}


interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

export const revalidate = 300;

async function getPageData(tea?: string, search?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!supabase) {
    return { user: null, isAdmin: false, products: null, error: "Service unavailable" };
  }

  try {
    const [authResult, productsResult, sizesResult] = await Promise.all([
      supabase.auth.getUser(),
      (async () => {
        let query = supabase
          .from('products')
          .select(`
            id, 
            name, 
            description, 
            price, 
            category, 
            image_url, 
            stock_quantity,
            is_active
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
       if (tea) {
  query = query.eq("tea_type", tea);
}


        if (search) {
          query = query.ilike("name", `%${search}%`);
        }

        return query;
      })(),
      supabase
        .from('product_sizes')
        .select('id, product_id, size_grams, price, stock_quantity')
    ]);

    const user = authResult.data?.user || null;
    let isAdmin = false;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      isAdmin = profile?.role === "admin";
    }

    if (productsResult.error) {
      console.error("Products error:", productsResult.error);
      return { user, isAdmin, products: null, error: "Failed to load products" };
    }

    return {
      user,
      isAdmin,
      products: productsResult.data,
      error: null
    };

  } catch (error) {
    console.error("Error:", error);
    return { user: null, isAdmin: false, products: null, error: "Service temporarily unavailable" };
  }
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { user, isAdmin, products, error } = await getPageData(
    resolvedSearchParams.tea,
    resolvedSearchParams.search
  );

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "tea":
        return <Leaf className="h-6 w-6 text-emerald-600" />;
      case "coffee":
        return <Award className="h-6 w-6 text-amber-600" />;
      case "chocolate":
        return <Heart className="h-6 w-6 text-rose-600" />;
      default:
        return <Leaf className="h-6 w-6 text-emerald-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "tea":
        return "bg-emerald-100 text-emerald-800";
      case "coffee":
        return "bg-amber-100 text-amber-800";
      case "chocolate":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  if (error && !products) {
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

  return (
    <div className="min-h-screen bg-neutral-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">
            Our Collection
          </h1>
          <p className="text-xl text-neutral-600 font-light max-w-2xl mx-auto">
            Premium tea, coffee, and chocolate crafted with care
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 flex-shrink-0">
              <Suspense fallback={<div>Loading filters...</div>}>
               <ProductFilters currentTea={resolvedSearchParams.tea} />

              </Suspense>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif text-neutral-900">
                  {resolvedSearchParams.tea
                    ? `${resolvedSearchParams.tea.charAt(0).toUpperCase() + resolvedSearchParams.tea.slice(1)} Tea`
                    : resolvedSearchParams.search
                      ? `Search Results for "${resolvedSearchParams.search}"`
                      : "All Products"}
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

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products && products.length > 0 ? (
                  products.map((product: any, index: number) => {
                    // Get the smallest size price or fallback to base price
                    const sizes = product.product_sizes || [];
                    const smallestSize = sizes.length > 0 
                      ? sizes.reduce((min: any, size: any) => 
                          size.price < min.price ? size : min, sizes[0])
                      : null;
                    
                    const displayPrice = smallestSize ? smallestSize.price : product.price;
                    const displaySize = smallestSize ? `${smallestSize.size_grams}g` : 'base size';
                    
                    // Calculate total stock across all sizes
                    const totalStock = sizes.reduce((sum: number, size: any) => 
                      sum + (size.stock_quantity || 0), 0) || product.stock_quantity;
                    
                    const lowStockThreshold = 100;
                    const isLowStock = totalStock > 0 && totalStock <= lowStockThreshold;
                    const isOutOfStock = totalStock === 0;
                    
                    return (
                      <Card
                        key={product.id}
                        className="bg-white rounded-lg border border-neutral-200 hover:shadow-lg transition-shadow overflow-hidden"
                      >
                        <div className="aspect-square bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center relative">
                          {product.image_url && product.image_url !== 'https://example.com/tea.jpg' && 
                           product.image_url !== 'https://example.com/coffee.jpg' && 
                           product.image_url !== 'https://example.com/chocolate.jpg' ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover"
                              priority={index < 3}
                              loading={index < 3 ? "eager" : "lazy"}
                            />
                          ) : (
                            <div className="text-center">
                              {getCategoryIcon(product.category)}
                              <p className="mt-2 text-neutral-400 text-sm">
                                {product.category}
                              </p>
                            </div>
                          )}
                          {isLowStock && (
                            <Badge className="absolute top-2 right-2 bg-amber-200 text-amber-800">
                              Low Stock
                            </Badge>
                          )}
                          {isOutOfStock && (
                            <Badge className="absolute top-2 right-2 bg-red-100 text-red-700">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <Badge
                            className={`mb-3 ${getCategoryColor(product.category)}`}
                          >
                            {product.category}
                          </Badge>
                          <h3 className="text-xl font-serif text-neutral-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-neutral-600 font-light mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-2xl font-serif text-neutral-900">
                                KSh {displayPrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-neutral-500">
                                from {displaySize}
                              </span>
                            </div>
                            <Link href={`/products/${product.id}`}>
                              <Button className="bg-emerald-600 rounded-md hover:bg-emerald-700 font-medium transition-colors">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
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
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
}
