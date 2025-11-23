"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  product?: any;
  isEdit?: boolean;
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category: product?.category || "",
    image_url: product?.image_url || "",
    stock_quantity: product?.stock_quantity?.toString() || "",
    is_active: product?.is_active ?? true,
  });

  // NEW: Manage product sizes dynamically
  const [sizes, setSizes] = useState<
    { size_grams: string; price: string; stock_quantity: string }[]
  >(product?.product_sizes || []);

  const addSize = () => {
    setSizes([...sizes, { size_grams: "", price: "", stock_quantity: "" }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: string, value: string) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name.trim()) throw new Error("Product name is required");
      if (!formData.price || isNaN(Number(formData.price)))
        throw new Error("Valid price is required");
      if (!formData.category) throw new Error("Category is required");

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        image_url: formData.image_url.trim() || null,
        stock_quantity: Number(formData.stock_quantity) || 0,
        is_active: formData.is_active,
      };

      let newProductId = product?.id;
      let result;

      if (isEdit && product?.id) {
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("products")
          .insert([productData])
          .select()
          .single();

        newProductId = result.data?.id;
      }

      if (result.error) throw result.error;

      // Handle size variants
      if (sizes.length > 0 && newProductId) {
        // Clean old sizes (only on edit)
        if (isEdit) {
          await supabase.from("product_sizes").delete().eq("product_id", newProductId);
        }

        const sizeInserts = sizes
          .filter(
            (s) =>
              s.size_grams &&
              !isNaN(Number(s.size_grams)) &&
              s.price &&
              !isNaN(Number(s.price))
          )
          .map((s) => ({
            product_id: newProductId,
            size_grams: Number(s.size_grams),
            price: Number(s.price),
            stock_quantity: Number(s.stock_quantity) || 0,
          }));

        if (sizeInserts.length > 0) {
          const { error: sizeError } = await supabase
            .from("product_sizes")
            .insert(sizeInserts);
          if (sizeError) throw sizeError;
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Error saving product:", err);
      alert(`Error saving product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg border-emerald-100">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle className="text-emerald-800">
            {isEdit ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core product info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Product Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ubuntu Harmony Blend"
              />
            </div>
            <div>
              <Label>Base Price ($) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="24.99"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the product..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => handleInputChange("category", val)}
              >
                <SelectTrigger>
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
            <div>
              <Label>Total Stock *</Label>
              <Input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Image URL</Label>
            <Input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* NEW: Product sizes section */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-emerald-700 font-semibold">Product Sizes (g)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSize}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Size
              </Button>
            </div>

            {sizes.length === 0 && (
              <p className="text-sm text-gray-500">No sizes added yet.</p>
            )}

            {sizes.map((size, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Grams (e.g., 10)"
                    value={size.size_grams}
                    onChange={(e) =>
                      updateSize(i, "size_grams", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={size.price}
                    onChange={(e) => updateSize(i, "price", e.target.value)}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={size.stock_quantity}
                    onChange={(e) =>
                      updateSize(i, "stock_quantity", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeSize(i)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
            <Label>Active (visible to customers)</Label>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 flex-1"
            >
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
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
