"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface ProductFormProps {
  product?: any
  isEdit?: boolean
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    image_url: product?.image_url || "",
    stock_quantity: product?.stock_quantity || "",
    is_active: product?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock_quantity: Number.parseInt(formData.stock_quantity),
      }

      let result
      if (isEdit && product) {
        result = await supabase.from("products").update(productData).eq("id", product.id)
      } else {
        result = await supabase.from("products").insert([productData])
      }

      if (result.error) {
        throw result.error
      }

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error saving product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white shadow-lg border-emerald-100">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle className="text-emerald-800">{isEdit ? "Edit Product" : "Add New Product"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-emerald-700">
                Product Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Ubuntu Harmony Blend"
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-emerald-700">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="24.99"
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-emerald-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the tea's benefits, ingredients, and unique qualities..."
              rows={4}
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-emerald-700">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hormonal_balance">Hormonal Balance</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity" className="text-emerald-700">
                Stock Quantity
              </Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                placeholder="50"
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-emerald-700">
              Image URL
            </Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="/placeholder.svg?height=400&width=400"
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active" className="text-emerald-700">
              Active (visible to customers)
            </Label>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEdit ? "Update Product" : "Create Product"}</>
              )}
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline" className="border-emerald-600 text-emerald-600 bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
