import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Heart, Moon, Users, MapPin, Award } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthNav from "@/components/auth-nav";

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
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-foreground">Ūbūchi</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/products"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop
              </Link>
              <Link
                href="#journey"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Our Journey
              </Link>
              <Link
                href="#blog"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <AuthNav user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Tea Cultivated to <span className="text-emerald-400">Restore</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Wellness rituals rooted in African healing traditions. Handpicked in
            Kenya by women farmers with care and purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-4"
              >
                Shop Our Teas
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4 bg-transparent"
            >
              Learn Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Science-Backed Wellness
              </h3>
              <p className="text-muted-foreground">
                Hormone balance, vitality, and sleep support through carefully
                selected botanicals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rooted in Africa</h3>
              <p className="text-muted-foreground">
                Sourced from small farms in Kenya with respect for traditional
                knowledge and sustainability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Powered by Women</h3>
              <p className="text-muted-foreground">
                Grown, harvested, and sorted by women farmers. Empowerment
                through agriculture and wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">The Spirit of Ūbūchi</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Ūbūchi draws its name from two powerful concepts:{" "}
                <strong>Ubuntu</strong> - the South African philosophy of
                collective humanity, and <strong>Chi</strong> - the spiritual
                life force understood as divine energy in many African and Asian
                cultures.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our teas connect ancient African healing traditions with modern
                wellness science. Each cup is a ritual of restoration, carefully
                crafted to support hormone balance, enhance vitality, and
                promote restful sleep.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                From the fertile highlands of Kenya to your cup, every leaf
                tells a story of empowerment, sustainability, and the healing
                power of nature.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Discover Our Story
              </Button>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=600&width=500"
                alt="Kenyan tea farmer"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Farm-to-Cup Journey */}
      <section id="journey" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">From Farm to Cup</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow the journey of our teas from the hands of Kenyan women
              farmers to your wellness ritual.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Handpicking tea leaves"
                  className="rounded-lg shadow-lg mx-auto"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Handpicked with Care
              </h3>
              <p className="text-muted-foreground">
                Women farmers carefully select the finest tea leaves at peak
                freshness.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Sun drying tea"
                  className="rounded-lg shadow-lg mx-auto"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Sun-Dried Naturally
              </h3>
              <p className="text-muted-foreground">
                Traditional sun-drying methods preserve the natural essence and
                healing properties.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Sorting and packaging"
                  className="rounded-lg shadow-lg mx-auto"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sorted & Packaged</h3>
              <p className="text-muted-foreground">
                Each batch is carefully sorted and packaged with attention to
                quality and purity.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Shipped with care"
                  className="rounded-lg shadow-lg mx-auto"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Shipped with Love</h3>
              <p className="text-muted-foreground">
                Your wellness ritual arrives fresh, carrying the spirit of
                Ubuntu and Chi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Wellness Teas for Every Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our collection of carefully crafted teas designed to
              support your wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                <Heart className="h-16 w-16 text-rose-500" />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-2 bg-rose-100 text-rose-700">
                  Hormonal Balance
                </Badge>
                <h3 className="text-xl font-semibold mb-2">Harmony Blend</h3>
                <p className="text-muted-foreground mb-4">
                  Support your natural rhythm with this carefully crafted blend
                  for hormonal wellness.
                </p>
                <Link href="/products?category=hormonal_balance">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Award className="h-16 w-16 text-amber-500" />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-2 bg-amber-100 text-amber-700">
                  Energy
                </Badge>
                <h3 className="text-xl font-semibold mb-2">Vitality Boost</h3>
                <p className="text-muted-foreground mb-4">
                  Natural energy enhancement without the crash, powered by
                  African botanicals.
                </p>
                <Link href="/products?category=energy">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Moon className="h-16 w-16 text-indigo-500" />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-2 bg-indigo-100 text-indigo-700">
                  Sleep
                </Badge>
                <h3 className="text-xl font-semibold mb-2">Restful Dreams</h3>
                <p className="text-muted-foreground mb-4">
                  Gentle evening blend to prepare your body and mind for
                  restorative sleep.
                </p>
                <Link href="/products?category=sleep">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Join the Ūbūchi Community
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Be the first to know about new blends, wellness tips, and stories
            from our farmers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-emerald-300"
            />
            <Button className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-8 w-8 text-emerald-600" />
                <span className="text-2xl font-bold">Ūbūchi</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Tea cultivated to restore. Rooted in African traditions, powered
                by women farmers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    All Teas
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Hormonal Balance
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Energy Boost
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Sleep Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Farm Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Wellness Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Tea Rituals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    YouTube
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    TikTok
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>
              &copy; 2025 Ūbūchi. All rights reserved. Made with Ubuntu and Chi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
