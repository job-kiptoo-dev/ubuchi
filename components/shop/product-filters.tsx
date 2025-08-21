"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { useState } from "react"

const categories = [
  { value: "hormonal-balance", label: "Hormonal Balance" },
  { value: "energy", label: "Energy" },
  { value: "sleep", label: "Sleep" },
  { value: "wellness", label: "General Wellness" },
]

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const currentCategory = searchParams.get("category")

  const handleCategoryFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === currentCategory) {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/shop?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }
    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    router.push("/shop")
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search teas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={currentCategory === category.value ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentCategory === category.value
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleCategoryFilter(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {(currentCategory || searchParams.get("search")) && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
