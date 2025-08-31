import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Heart, Moon, Users, MapPin, Award } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthNav from "@/components/auth-nav";
import Image from "next/image";

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
    <div className="min-h-screen bg-neutral-50">
      <nav className="fixed top-0 w-full bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-serif text-neutral-900">Ūbūchi</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#about"
                className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="/products"
                className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
              >
                Shop
              </Link>
              <Link
                href="#journey"
                className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
              >
                Our Journey
              </Link>
              <Link
                href="#blog"
                className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
              >
                Blog
              </Link>
              <AuthNav user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          }}
        >
          <div className="absolute inset-0 bg-neutral-900/50"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            Tea Cultivated to <span className="text-emerald-400">Restore</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-neutral-200 font-light max-w-2xl mx-auto">
            Wellness rituals rooted in African healing traditions. Handpicked in
            Kenya by women farmers with care and purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-4 font-medium transition-transform hover:scale-105"
              >
                Shop Our Teas
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-neutral-200 text-neutral-200 hover:bg-neutral-200 hover:text-neutral-900 text-lg px-8 py-4 bg-transparent font-medium transition-transform hover:scale-105"
            >
              Learn Our Story
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-neutral-900">
                Science-Backed Wellness
              </h3>
              <p className="text-neutral-600 font-light">
                Hormone balance, vitality, and sleep support through carefully
                selected botanicals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-neutral-900">
                Rooted in Africa
              </h3>
              <p className="text-neutral-600 font-light">
                Sourced from small farms in Kenya with respect for traditional
                knowledge and sustainability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-neutral-900">
                Powered by Women
              </h3>
              <p className="text-neutral-600 font-light">
                Grown, harvested, and sorted by women farmers. Empowerment
                through agriculture and wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif mb-6 text-neutral-900">
                The Spirit of Ūbūchi
              </h2>
              <p className="text-lg text-neutral-600 font-light mb-6">
                Ūbūchi draws its name from two powerful concepts:{" "}
                <strong>Ubuntu</strong> - the South African philosophy of
                collective humanity, and <strong>Chi</strong> - the spiritual
                life force understood as divine energy in many African and Asian
                cultures.
              </p>
              <p className="text-lg text-neutral-600 font-light mb-6">
                Our teas connect ancient African healing traditions with modern
                wellness science. Each cup is a ritual of restoration, carefully
                crafted to support hormone balance, enhance vitality, and
                promote restful sleep.
              </p>
              <p className="text-lg text-neutral-600 font-light mb-8">
                From the fertile highlands of Kenya to your cup, every leaf
                tells a story of empowerment, sustainability, and the healing
                power of nature.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 font-medium transition-transform hover:scale-105">
                Discover Our Story
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg"
                height={600}
                width={500}
                alt="Kenyan tea farmer"
                className="rounded-lg shadow-2xl border border-neutral-200"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4 text-neutral-900">
              From Farm to Cup
            </h2>
            <p className="text-xl text-neutral-600 font-light max-w-2xl mx-auto">
              Follow the journey of our teas from the hands of Kenyan women
              farmers to your wellness ritual.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <Image
                  src="/placeholder.svg"
                  height={300}
                  width={300}
                  alt="Handpicking tea leaves"
                  className="rounded-lg shadow-lg mx-auto border border-neutral-200"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-lg font-serif mb-2 text-neutral-900">
                Handpicked with Care
              </h3>
              <p className="text-neutral-600 font-light">
                Women farmers carefully select the finest tea leaves at peak
                freshness.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <Image
                  src="/placeholder.svg"
                  height={300}
                  width={300}
                  alt="Sun drying tea"
                  className="rounded-lg shadow-lg mx-auto border border-neutral-200"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-lg font-serif mb-2 text-neutral-900">
                Sun-Dried Naturally
              </h3>
              <p className="text-neutral-600 font-light">
                Traditional sun-drying methods preserve the natural essence and
                healing properties.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <Image
                  src="/placeholder.svg"
                  height={300}
                  width={300}
                  alt="Sorting and packaging"
                  className="rounded-lg shadow-lg mx-auto border border-neutral-200"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-lg font-serif mb-2 text-neutral-900">Sorted & Packaged</h3>
              <p className="text-neutral-600 font-light">
                Each batch is carefully sorted and packaged with attention to
                quality and purity.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <Image
                  src="/placeholder.svg"
                  height={300}
                  width={300}
                  alt="Shipped with care"
                  className="rounded-lg shadow-lg mx-auto border border-neutral-200"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <h3 className="text-lg font-serif mb-2 text-neutral-900">Shipped with Love</h3>
              <p className="text-neutral-600 font-light">
                Your wellness ritual arrives fresh, carrying the spirit of
                Ubuntu and Chi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-200 text-amber-800 font-medium">
              Our Collection
            </Badge>
            <h2 className="text-4xl font-serif mb-2 text-neutral-900">
              Wellness Teas for Every Need
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-4"></div>
            <p className="text-xl text-neutral-600 font-light max-w-2xl mx-auto">
              Discover our collection of carefully crafted teas designed to
              support your wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-neutral-200 bg-neutral-50">
              <div className="relative aspect-square">
                <Image
                  src="/images/harmony-blend.jpg"
                  alt="Harmony Blend"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <Badge className="absolute top-4 left-4 bg-amber-200 text-amber-800">
                  Hormonal Balance
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif mb-2 text-neutral-900">Harmony Blend</h3>
                <p className="text-neutral-600 font-light mb-3 line-clamp-2">
                  Support your natural rhythm with this carefully crafted blend
                  for hormonal wellness.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-emerald-700">$24.99</span>
                  <Link href="/products?category=hormonal_balance">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 font-medium transition-transform hover:scale-105">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-neutral-200 bg-neutral-50">
              <div className="relative aspect-square">
                <Image
                  src="/images/vitality-boost.jpg"
                  alt="Vitality Boost"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <Badge className="absolute top-4 left-4 bg-amber-200 text-amber-800">
                  Energy
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif mb-2 text-neutral-900">Vitality Boost</h3>
                <p className="text-neutral-600 font-light mb-3 line-clamp-2">
                  Natural energy enhancement without the crash, powered by
                  African botanicals.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-emerald-700">$22.99</span>
                  <Link href="/products?category=energy">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 font-medium transition-transform hover:scale-105">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-neutral-200 bg-neutral-50">
              <div className="relative aspect-square">
                <Image
                  src="/images/restful-dreams.jpg"
                  alt="Restful Dreams"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <Badge className="absolute top-4 left-4 bg-amber-200 text-amber-800">
                  Sleep
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif mb-2 text-neutral-900">Restful Dreams</h3>
                <p className="text-neutral-600 font-light mb-3 line-clamp-2">
                  Gentle evening blend to prepare your body and mind for
                  restorative sleep.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-emerald-700">$26.99</span>
                  <Link href="/products?category=sleep">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 font-medium transition-transform hover:scale-105">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-amber-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif text-white mb-4">
            Join the Ūbūchi Community
          </h2>
          <p className="text-xl text-neutral-200 mb-8 font-light">
            Be the first to know about new blends, wellness tips, and stories
            from our farmers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-neutral-200 bg-neutral-50 text-neutral-900 font-light"
            />
            <Button className="bg-neutral-50 text-neutral-900 hover:bg-neutral-200 px-8 py-3 font-medium transition-transform hover:scale-105">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-8 w-8 text-emerald-600" />
                <span className="text-2xl font-serif text-neutral-900">Ūbūchi</span>
              </div>
              <p className="text-neutral-600 font-light mb-4">
                Tea cultivated to restore. Rooted in African traditions, powered
                by women farmers.
              </p>
            </div>

            <div>
              <h4 className="font-serif mb-4 text-neutral-900">Shop</h4>
              <ul className="space-y-2 text-neutral-600 font-light">
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    All Teas
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Hormonal Balance
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Energy Boost
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Sleep Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif mb-4 text-neutral-900">Learn</h4>
              <ul className="space-y-2 text-neutral-600 font-light">
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Farm Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Wellness Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Tea Rituals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif mb-4 text-neutral-900">Connect</h4>
              <ul className="space-y-2 text-neutral-600 font-light">
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    YouTube
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    TikTok
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-200 mt-12 pt-8 text-center text-neutral-600 font-light">
            <p>
              &copy; 2025 Ūbūchi. All rights reserved. Made with Ubuntu and Chi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

