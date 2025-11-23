import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-10 w-48 mb-4 rounded-lg" />
          <Skeleton className="h-6 w-72 rounded-lg" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col h-full">
              {/* Card Container */}
              <div className="border border-border rounded-lg p-6 space-y-4">
                {/* Image Skeleton */}
                <Skeleton className="w-full h-48 rounded-lg" />

                {/* Title Skeleton */}
                <Skeleton className="h-6 w-full rounded-lg" />

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                </div>

                {/* Footer Skeleton (Price + Button) */}
                <div className="flex items-center justify-between pt-4">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
