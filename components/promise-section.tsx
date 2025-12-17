import Link from "next/link"
import { Button } from "./ui/button"

export default function PromiseSection() {
  return (
    <section className="py-16 sm:py-24 bg-neutral-50" aria-labelledby="promise-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 id="promise-heading" className="text-4xl sm:text-4xl font-serif text-neutral-900 mb-4">
            Our Promise to You
          </h2>
        </div>

        {/* Promises List */}
        <div className="space-y-8 mb-16">
          <div>
            <h3 className="text-lg sm:text-xl font-serif text-neutral-900 mb-2">Pure Ingredients, Nothing Else</h3>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              Whole-leaf, clean, and intentional — no fillers, no shortcuts, just tea that honors your body.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-serif text-neutral-900 mb-2">Consciously Crafted, Always</h3>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              Hand-selected and mindfully blended, with growers who respect the earth and packaging that respects the
              planet.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-serif text-neutral-900 mb-2">Honest From Leaf to Cup</h3>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              Clear sourcing, transparent labels, and no wellness buzzword fluff, just the truth, beautifully delivered.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-serif text-neutral-900 mb-2">Shaped With You in Mind</h3>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              We're building this journey together. Your ideas, feedback, and curiosity help us grow and craft better
              blends for you.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center border-t border-neutral-200 pt-12">
          <h3 className="text-xl sm:text-2xl font-serif text-neutral-900 mb-3">Have ideas or suggestions?</h3>
          <p className="text-sm sm:text-base text-neutral-600 font-light mb-6 max-w-2xl mx-auto">
            We're here to listen. If you have thoughts or feedback that can help us grow, we're open — truly. Ubuchi is
            still evolving, and your insight helps shape where we go next.
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-neutral-700 text-white font-medium px-8 py-3 rounded-sm">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

