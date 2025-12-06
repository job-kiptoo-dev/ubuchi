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
import NavBar from "@/components/navBar";

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
      <NavBar/>
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
