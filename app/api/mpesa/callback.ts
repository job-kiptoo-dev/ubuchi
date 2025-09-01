import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function POST(request: NextRequest, { params }: { params: { securityKey: string } }) {
  const data = await request.json();
  const supabase = createClient();
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
    // ignore the requets
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

  try {

    // save transaction
    const { data: payment, error } = await supabase.from("payments")
      .update({
        amount,
        phone_number: phoneNumber,
        mpesa_receipt_number: mpesaCode,
        transaction_status: "paid",
        callback_metadata: body,
      })
      .eq("checkout_request_id", data.Body.stkCallback.CheckoutRequestID);



    if (error) {
      console.error("DB Error:", error.message);
      return NextResponse.json(
        { message: "Failed to save transaction" },
        { status: 500 }
      );
    }

    console.log("✅ Saved:", payment);
    return NextResponse.json({ message: "Transaction Saved" }, { status: 200 });

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

