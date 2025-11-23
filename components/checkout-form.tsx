"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { sendStkPush } from "@/actions/stkPush";
import { stkPushQuery } from "@/actions/stkPushQuery";

interface CheckoutFormProps {
  cartItems: any[];
  total: number;
  subtotal: number;
  shipping: number;
}

export default function CheckoutForm({ cartItems, total, subtotal, shipping }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stkQueryLoading, setStkQueryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Kenya",
  });

  let reqcount = 0;

  const stkPushQueryWithIntervals = (CheckoutRequestID: string) => {
    const timer = setInterval(async () => {
      reqcount += 1;

      if (reqcount === 15) {
        clearInterval(timer);
        setStkQueryLoading(false);
        setLoading(false);
        setErrorMessage("You took too long to pay");
      }

      const { data, error } = await stkPushQuery(CheckoutRequestID);

      if (error) {
        if (error.response.data.errorCode !== "500.001.1001") {
          setStkQueryLoading(false);
          setLoading(false);
          setErrorMessage(error?.response?.data?.errorMessage);
        }
      }

      if (data) {
        if (data.ResultCode === "0") {
          clearInterval(timer);
          setStkQueryLoading(false);
          setLoading(false);
          setSuccess(true);
        } else {
          clearInterval(timer);
          setStkQueryLoading(false);
          setLoading(false);
          setErrorMessage(data?.ResultDesc);
        }
      }
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      await toast.promise(
        (async () => {
          // 1️⃣ Create order
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
            .single();

          if (orderError) throw orderError;

          // 2️⃣ Create order items with correct data structure
          const orderItems = cartItems.map((item) => {
            const sizeGrams = item.product_sizes?.size_grams || 50;
            const sizePrice = item.product_sizes?.price || item.products?.price || 0;
            const quantity = Math.floor(item.grams_ordered / sizeGrams);

            return {
              order_id: order.id,
              product_id: item.products.id,
              size_id: item.size_id,
              quantity: quantity,
              price: Number(sizePrice),
              grams_ordered: item.grams_ordered,
            };
          });

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);
          if (itemsError) throw itemsError;

          // 3️⃣ Validate phone number
          const kenyanPhoneNumberRegex =
            /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/;

          if (!kenyanPhoneNumberRegex.test(formData.phoneNumber)) {
            throw new Error("Invalid M-Pesa phone number format.");
          }

          // 4️⃣ Send STK Push
          const { data: stkData, error: stkError } = await sendStkPush({
            mpesa_number: formData.phoneNumber,
            amount: total,
            order_id: order.id,
          });

          if (stkError) {
            throw new Error(stkError);
          }

          console.log("STK push response:", stkData);

          // If STK push has CheckoutRequestID, start query polling
          if (stkData?.CheckoutRequestID) {
            setStkQueryLoading(true);
            stkPushQueryWithIntervals(stkData.CheckoutRequestID);
          }

          // 5️⃣ Clear cart
          const { error: cartError } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id);
          if (cartError) throw cartError;

          // 6️⃣ Redirect to order success page
          router.push(`/orders/${order.id}?success=true`);
        })(),
        {
          loading: "Processing your order...",
          success:
            "Order placed successfully 🎉 Check your phone for M-Pesa prompt.",
          error: (err) => {
      console.error("CheckoutForm toast error:", err);
      return err?.message || "Something went wrong";
    },
        },
      );
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Unexpected error");
    } finally {
      if (!stkQueryLoading) {
        setLoading(false);
      }
    }
  };

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
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
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
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
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
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-emerald-700">
              M-Pesa Phone Number
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              placeholder="0712345678 or 254712345678"
              required
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="border-emerald-200 focus:border-emerald-500"
            />
            <p className="text-xs text-gray-500">
              Format: 07XXXXXXXX or 2547XXXXXXXX
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-emerald-700">
              Address
            </Label>
            <Input
              id="address"
              placeholder="Street address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
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
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-emerald-700">
                County/State
              </Label>
              <Input
                id="state"
                placeholder="County"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-emerald-700">
                Postal Code
              </Label>
              <Input
                id="zipCode"
                placeholder="00100"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-emerald-800 mb-2">
              M-Pesa Payment
            </h4>
            <p className="text-sm text-emerald-700 mb-2">
              You will receive an M-Pesa prompt on your phone to complete the payment of <span className="font-bold">KSh {total.toFixed(2)}</span>
            </p>
            <p className="text-xs text-gray-600">
              • Enter your M-Pesa PIN when prompted<br />
              • Payment must be completed within 60 seconds<br />
              • You'll receive a confirmation SMS from M-Pesa
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {stkQueryLoading && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700">
                Waiting for payment confirmation... Please check your phone.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || stkQueryLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg rounded-md"
          >
            {loading || stkQueryLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {stkQueryLoading ? "Waiting for Payment..." : "Processing Order..."}
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Pay KSh {total.toFixed(2)} via M-Pesa
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}