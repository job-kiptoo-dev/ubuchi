import { Leaf } from "lucide-react";
import Link from "next/link";
import AuthNav from "./auth-nav";
import { createClient } from "@/lib/supabase/server";


export default async function NavBar() {

  const supabase = await createClient();

  // Await the params Promise

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

  return (
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

  )
}
