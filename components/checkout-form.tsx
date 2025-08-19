"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface CheckoutFormProps {
  cartItems: any[]
  total: number
}

export default function CheckoutForm({ cartItems, total }: CheckoutFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_amount: total,
            status: "pending",
            shipping_address: formData,
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price: Number.parseFloat(item.products.price),
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (cartError) throw cartError

      // Redirect to success page
      router.push(`/orders/${order.id}?success=true`)
    } catch (error) {
      console.error("Error processing order:", error)
      alert("Error processing order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white shadow-lg border-emerald-100">
      <CardHeader>
        <CardTitle className="text-emerald-800">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-emerald-700">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-emerald-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-emerald-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-emerald-700">
              Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-emerald-700">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-emerald-700">
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-emerald-700">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-amber-800 mb-2">Payment Information</h4>
            <p className="text-sm text-amber-700">
              This is a demo checkout. In a real implementation, you would integrate with a payment processor like
              Stripe.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Place Order - ${total.toFixed(2)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
