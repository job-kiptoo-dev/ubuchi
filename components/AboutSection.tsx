import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-neutral-50" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 id="about-heading" className="text-3xl sm:text-4xl font-serif mb-6 text-neutral-900">
              The Spirit of Úbūchi
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 font-light mb-6">
              Úbūchi is a name born from <strong>Ubuntu (community)</strong> and{" "}
              <strong>Chi (the life force within)</strong>. Our name reflects the powerful
              connection between self and others. After burnout from the corporate grind,
              I discovered healing and renewal in the quiet ritual of tea.
            </p>
            <p className="text-base sm:text-lg text-neutral-600 font-light mb-6">
              Every leaf is handpicked by resilient women farmers in Kenya, nurturing
              nature and community with care. From their hands to yours, Úbūchi is a
              journey of restoration. Rooted in tradition, sustained by ethical,
              traceable practices, Úbūchi is infused with the strength of community and
              the power of inner vitality.
            </p>
            <p className="text-base sm:text-lg text-neutral-600 font-light mb-8">
              From the fertile highlands of <strong>Kericho, Kenya</strong> to your cup,
              every leaf tells a story of empowerment, sustainability, and the healing
              power of nature.
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 font-medium">
              <Link href="#journey">Discover Our Story</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[600px]">
            <Image
              src="/placeholder.svg"
              alt="Kenyan tea farmer working in the fields"
              fill
              className="rounded-lg shadow-2xl border border-neutral-200 object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>

  )
}
