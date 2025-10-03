import { JourneyData } from "@/lib/Links/journeyLink"
import Image from "next/image"

export default function JourneySection() {
  return (
    <section id="journey" className="py-20 bg-stone-100" aria-labelledby="journey-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="journey-heading" className="text-3xl sm:text-4xl font-serif mb-4 text-neutral-900">
            From Farm to Cup
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 font-light max-w-2xl mx-auto">
            Follow the journey of our teas from the hands of Kenyan women
            farmers to your wellness ritual.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {JourneyData.map((item) => (
            <div key={item.step} className="text-center">
              <div className="relative mb-6">
                <div className="relative aspect-square">
                  <Image
                    src="/placeholder.svg"
                    alt={item.alt}
                    fill
                    className="rounded-lg shadow-lg border border-neutral-200 object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  {item.step}
                </div>
              </div>
              <h3 className="text-lg font-serif mb-2 text-neutral-900">
                {item.title}
              </h3>
              <p className="text-neutral-600 font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

  )
}
