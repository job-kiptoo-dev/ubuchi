import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (

    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/green.jpg"
          alt="Kenyan tea fields"
          fill
          priority
          className="object-cover scale-105 animate-in fade-in zoom-in duration-1000"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/50 to-neutral-900/70" />
      </div>

      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-100 delay-75">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">Handpicked by 10,000+ wellness enthusiasts</span>
        </div>

        <h1 className="font-serif mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-balance leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          Tea Cultivated to{" "}
          <span className="text-emerald-400 inline-block  transition-transform duration-100">
            Restore
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl mb-10 text-neutral-100 font-light max-w-3xl mx-auto leading-relaxed text-pretty animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          Wellness rituals rooted in African healing traditions. Handpicked in Kenya by women farmers with care and
          purpose.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <Button
            asChild
            size="lg"
            className="group relative bg-white/40  hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white text-lg px-10 py-7 font-semibold shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-600/60 transition-all duration-300  hover:scale-105 border-0 backdrop-blur-sm "
          >
            <Link href="/products" className="flex items-center gap-2">
              Shop Our Teas
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="group relative border-2 border-white/80 text-white hover:bg-white hover:text-emerald-700 text-lg px-10 py-7 font-semibold transition-all duration-200 hover:-translate-y-1  hover:shadow-2xl hover:shadow-white/20 bg-white/5 backdrop-blur-sm"
          >
            <a href="#about" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Learn Our Story
            </a>
          </Button>
        </div>

        <p className="mt-10 text-sm text-neutral-300/90 font-light animate-in fade-in duration-700 delay-1000">
          Free shipping on orders over $50 • Sustainably sourced • Women-owned cooperative
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section >
  )
}
