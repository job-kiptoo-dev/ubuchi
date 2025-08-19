import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthCallback() {
  const supabase = await createClient();

  // The middleware should handle the code exchange, so just redirect
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  } else {
    redirect("/auth/login");
  }
}
