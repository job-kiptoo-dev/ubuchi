import { redirect } from "next/navigation";
import SignUpForm from "@/components/sign-up-form";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is logged in, redirect to home page
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignUpForm />
    </div>
  );
}
