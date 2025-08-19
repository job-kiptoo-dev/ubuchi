// lib/supabase/server.ts - Updated for Next.js 15
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// For Server Components - can't modify cookies
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // In Server Components, we can't modify cookies
          // The middleware will handle session refresh
          // This is safe to ignore as per Supabase documentation
        },
      },
    },
  );
}

// For Server Actions and Route Handlers - can modify cookies
export async function createActionClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error("Failed to set cookies in Server Action:", error);
            throw error;
          }
        },
      },
    },
  );
}

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Helper function to get current user on server (read-only)
export async function getCurrentUser() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Unexpected error getting user:", error);
    return null;
  }
}

// Helper function to get current session on server (read-only)
export async function getCurrentSession() {
  const supabase = await createClient();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Unexpected error getting session:", error);
    return null;
  }
}
