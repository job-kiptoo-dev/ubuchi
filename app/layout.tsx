import type React from "react"
import type { Metadata } from "next"
import { Inter, Lora, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/navBar"
import { createClient } from "@/lib/supabase/server"
import { argv0 } from "process"
import { count } from "console"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const lora = Lora({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Ūbūchi - Tea Cultivated to Restore",
  description:
    "Wellness rituals rooted in African healing traditions. Handpicked in Kenya by women farmers with care and purpose.",
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;

  if (user) {
    const { data: cartItems } = await supabase
      .from("cart_items")
      .select("id", { count: "exact" })
      .eq("user_id", user.id);

    cartCount = cartItems?.length ?? 0;
  }
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="font-sans select-none ">
        {/* <NavBar /> */}
        {children}
        <Toaster />
      </body>
    </html>
  )
}
