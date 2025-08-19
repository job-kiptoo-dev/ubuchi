import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProductForm from "@/components/admin/product-form";

export default async function NewProduct() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">
            Add New Product
          </h1>
          <p className="text-amber-700">
            Create a new tea product for your collection
          </p>
        </div>

        <ProductForm />
      </div>
    </div>
  );
}
