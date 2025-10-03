import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { teas } from "@/lib/Links/teas";

export default function ProductSection() {
  return (
    <section id="products" className="py-20 bg-neutral-50" aria-labelledby="products-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-amber-200 text-amber-800 font-medium">
            Our Collection
          </Badge>
          <h2 id="products-heading" className="text-3xl sm:text-4xl font-serif mb-2 text-neutral-900">
            The Art of Wellness in Every Cup
          </h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-4" aria-hidden="true" />
          <p className="text-lg sm:text-xl text-neutral-600 font-light max-w-2xl mx-auto">
            Discover teas thoughtfully composed to awaken energy, calm the mind, and restore inner harmony
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {teas.map((tea) => (
            <Card
              key={tea.name}
              className="overflow-hidden transition-all duration-200 border border-neutral-200 bg-white rounded-xl shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-square">
                <Image
                  src={tea.image}
                  alt={tea.name}
                  fill
                  className="object-cover rounded-t-xl"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <Badge
                  className={`absolute top-4 left-4 text-xs ${tea.badgeColor}`}
                >
                  {tea.badge}
                </Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-serif text-neutral-900 mb-2">{tea.name}</h3>
                <p className="text-sm text-neutral-600 mb-4">{tea.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-emerald-700">{tea.price}</span>
                  <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href={`/products?category=${tea.category}`}>
                      Shop Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

  )
}
