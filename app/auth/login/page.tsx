import { createClient} from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";

export default async function LoginPage() {
  // If Supabase is not configured, show setup message directly
  // if (error) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold mb-4 text-emerald-800">
  //           Connect Supabase to get started
  //         </h1>
  //         <p className="text-emerald-600">
  //           Please configure your Supabase environment variables
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  try {
    // Check if user is already logged in
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    // Handle potential session errors
    if (error) {
      console.error("Session error:", error);
    }

    // If user is logged in, redirect to home page
    if (session) {
      redirect("/");
    }
  } catch (error) {
    console.error("Auth check error:", error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
