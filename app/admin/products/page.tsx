import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function AdminProducts() {
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

  // Get all products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">
              Product Management
            </h1>
            <p className="text-amber-700">Manage your tea collection</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product.id}
                className="bg-white shadow-lg border-emerald-100"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-emerald-600 text-xs text-center">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-amber-700 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <Badge
                              className={
                                product.category === "hormonal_balance"
                                  ? "bg-rose-100 text-rose-700"
                                  : product.category === "energy"
                                    ? "bg-amber-100 text-amber-700"
                                    : product.category === "sleep"
                                      ? "bg-indigo-100 text-indigo-700"
                                      : "bg-emerald-100 text-emerald-700"
                              }
                            >
                              {product.category.replace("_", " ")}
                            </Badge>
                            <span className="text-sm text-amber-600">
                              Stock: {product.stock_quantity}
                            </span>
                            <Badge
                              variant={
                                product.is_active ? "default" : "secondary"
                              }
                            >
                              {product.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-800 mb-2">
                            ${Number.parseFloat(product.price).toFixed(2)}
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-600 text-emerald-600 bg-transparent"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-600 text-amber-600 bg-transparent"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-600 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white shadow-lg border-emerald-100">
              <CardContent className="p-12 text-center">
                <p className="text-amber-700 text-lg mb-4">No products yet</p>
                <Link href="/admin/products/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
