import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Leaf } from "lucide-react";
import Link from "next/link";
import ProductFilters from "@/components/shop/product-filters";
import ProductGrid from "@/components/shop/product-grid";
import CartDrawer from "@/components/cart/cart-drawer";

interface SearchParams {
  category?: string;
  search?: string;
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Apply filters
  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`);
  }

  const { data: products } = await query;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-foreground">Ūbūchi</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link href="/shop" className="text-foreground font-medium">
                Shop
              </Link>
              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <CartDrawer />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-amber-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Wellness Teas for Every Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our collection of carefully crafted teas, each blend
              designed to support your unique wellness needs.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters />
              </Suspense>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchParams.category
                    ? `${searchParams.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Teas`
                    : "All Teas"}
                </h2>
                <p className="text-gray-600">
                  {products?.length || 0} products
                </p>
              </div>

              <Suspense fallback={<div>Loading products...</div>}>
                <ProductGrid products={products || []} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
