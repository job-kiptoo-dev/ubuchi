import { Heart, MapPin, Users } from "lucide-react";

export default function FeatureSection() {
  return (

    <section className="py-20 bg-stone-100" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="features-heading" className="sr-only">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
              <Heart className="h-8 w-8 text-emerald-600" aria-hidden="true" />
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
              <MapPin className="h-8 w-8 text-amber-600" aria-hidden="true" />
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
              <Users className="h-8 w-8 text-emerald-600" aria-hidden="true" />
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
  )
}
