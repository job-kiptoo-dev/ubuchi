import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // Changed from client to server

export async function POST(request: NextRequest, { params }: { params: { securityKey: string } }) {
  const data = await request.json();
  const supabase = await createClient(); // Add await
  const { securityKey } = params;
  
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr');
  const whitelist = [
    '196.201.214.200',
    '196.201.214.206',
    '196.201.213.114',
    '196.201.214.207',
    '196.201.214.208',
    '196.201.213.44',
    '196.201.212.127',
    '196.201.212.138',
    '196.201.212.129',
    '196.201.212.136',
    '196.201.212.74',
    '196.201.212.69'
  ];

  if (!clientIp || !whitelist.includes(clientIp)) {
    return NextResponse.json(
      { error: "IP not whitelisted" },
      { status: 403 }
    );
  }

  if (securityKey !== process.env.MPESA_CALLBACK_SECRET_KEY) {
    return NextResponse.json("ok saf");
  }

  if (!data.Body.stkCallback.CallbackMetadata) {
    console.log("Failed:", data.Body.stkCallback.ResultDesc);
    return NextResponse.json({ message: "Transaction Failed" }, { status: 200 });
  }

  const body = data.Body.stkCallback.CallbackMetadata;
  const amountObj = body.Item.find((obj: any) => obj.Name === "Amount");
  const amount = amountObj?.Value;
  
  const codeObj = body.Item.find((obj: any) => obj.Name === "MpesaReceiptNumber");
  const mpesaCode = codeObj?.Value;
  
  const phoneNumberObj = body.Item.find((obj: any) => obj.Name === "PhoneNumber");
  const phoneNumber = phoneNumberObj?.Value?.toString();

  const checkoutRequestID = data.Body.stkCallback.CheckoutRequestID;

  try {
    // 1️⃣ Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        amount,
        phone_number: phoneNumber,
        mpesa_receipt_number: mpesaCode,
        transaction_status: "paid",
        callback_metadata: body,
      })
      .eq("checkout_request_id", checkoutRequestID)
      .select()
      .single();

    if (paymentError) {
      console.error("Payment DB Error:", paymentError.message);
      return NextResponse.json(
        { message: "Failed to save payment" },
        { status: 500 }
      );
    }

    console.log("Payment saved:", payment);

    // 2️⃣ Find and update the corresponding order
    // You can link payment to order via phone number or add order_id to payment
    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id")
      .eq("total_amount", amount)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1);

    if (orders && orders.length > 0) {
      const order = orders[0];
      
      // Update order status to paid
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          mpesa_receipt: mpesaCode,
          payment_completed_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Order update error:", updateError.message);
      } else {
        console.log(" Order marked as paid:", order.id);
      }
    }

    return NextResponse.json({ message: "Transaction Saved" }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}