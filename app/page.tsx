import { Leaf } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthNav from "@/components/auth-nav";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import ProductSection from "@/components/ProductSection";
import JourneySection from "@/components/JourneySection";
import AboutSection from "@/components/AboutSection";
import FeatureSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import { navLinks } from "@/lib/Links/navLinks";

interface Profile {
  role: string;
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<Profile>();

    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
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

      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeatureSection />
      {/* About Section */}
      <AboutSection />
      {/* Journey Section */}
      <JourneySection />
      {/* Products Section */}
      <ProductSection />
      {/* Newsletter Section */}
      <Newsletter />
      {/* Footer */}
      <Footer />
    </div>
  );
}
