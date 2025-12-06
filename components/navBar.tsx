import { Leaf } from "lucide-react";
import Link from "next/link";
import AuthNav from "./auth-nav";
import { createClient } from "@/lib/supabase/server";
import { navLinks } from "@/lib/Links/navLinks";


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
      <nav className="fixed top-0 w-full bg-neutral-50/70 backdrop-blur-sm border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Leaf className="h-8 w-8 text-emerald-600" aria-hidden="true" />
              <span className="text-2xl font-serif text-neutral-900">
                Úbūchi
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
                >
                  {label}
                </Link>
              ))}

              {/* Auth Nav */}
              <AuthNav user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>





  )
}
