"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface ProductFiltersProps {
  currentCategory?: string
}

export default function ProductFilters({ currentCategory }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categories = [
    { value: "hormonal_balance", label: "Hormonal Balance" },
    { value: "energy", label: "Energy" },
    { value: "sleep", label: "Sleep" },
    { value: "wellness", label: "Wellness" },
  ]

  const handleCategoryFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (currentCategory === category) {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/products")
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={currentCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryFilter(category.value)}
          className={
            currentCategory === category.value
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          }
        >
          {category.label}
        </Button>
      ))}
      {currentCategory && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-amber-600 hover:text-amber-700">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}
