// lib/auth-actions.ts
"use server";

import { createActionClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Sign in server action
export async function signIn(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.toString())) {
    return { error: "Please enter a valid email address" };
  }

  // Validate password length
  if (password.toString().length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  const supabase = await createActionClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toString().trim(),
      password: password.toString(),
    });

    if (error) {
      console.error("Sign in error:", error);
      return { error: error.message };
    }

    if (data.user) {
      // Revalidate the layout to update the auth state
      revalidatePath("/", "layout");
      redirect("/dashboard"); // or wherever you want to redirect after login
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected login error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Sign up server action
export async function signUp(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" };
  }

  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.toString())) {
    return { error: "Please enter a valid email address" };
  }

  // Validate password length
  if (password.toString().length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  const supabase = await createActionClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString().trim(),
      password: password.toString(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        data: {
          full_name: fullName?.toString().trim() || "",
          display_name: fullName?.toString().trim() || "",
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error);

      // Handle specific error cases
      if (error.message.includes("User already registered")) {
        return {
          error:
            "An account with this email already exists. Please sign in instead.",
        };
      }

      return { error: error.message };
    }

    if (data.user) {
      // Check if email confirmation is required
      if (!data.session) {
        return {
          success:
            "Please check your email (including spam folder) to confirm your account. The confirmation link may take a few minutes to arrive.",
        };
      } else {
        // Auto-confirmed, redirect to dashboard
        revalidatePath("/", "layout");
        redirect("/dashboard");
      }
    }

    return { success: "Account created successfully!" };
  } catch (error) {
    console.error("Unexpected sign up error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Sign out server action
export async function signOut() {
  const supabase = await createActionClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }

    // Revalidate the layout to update the auth state
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error during sign out:", error);
    // Still redirect even if there's an error
  }

  redirect("/auth/login");
}

// Reset password server action
export async function resetPassword(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" };
  }

  const email = formData.get("email");

  if (!email) {
    return { error: "Email is required" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.toString())) {
    return { error: "Please enter a valid email address" };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toString().trim(),
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/reset-password`,
      },
    );

    if (error) {
      console.error("Reset password error:", error);
      return { error: error.message };
    }

    return {
      success:
        "Password reset email sent. Please check your email (including spam folder) for the reset link.",
    };
  } catch (error) {
    console.error("Unexpected reset password error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Update password server action (for use after reset)
export async function updatePassword(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" };
  }

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required" };
  }

  if (password.toString() !== confirmPassword.toString()) {
    return { error: "Passwords do not match" };
  }

  if (password.toString().length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: password.toString(),
    });

    if (error) {
      console.error("Update password error:", error);
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: "Password updated successfully!" };
  } catch (error) {
    console.error("Unexpected update password error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Resend confirmation email
export async function resendConfirmation(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" };
  }

  const email = formData.get("email");

  if (!email) {
    return { error: "Email is required" };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.toString().trim(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      console.error("Resend confirmation error:", error);
      return { error: error.message };
    }

    return {
      success:
        "Confirmation email resent. Please check your email (including spam folder).",
    };
  } catch (error) {
    console.error("Unexpected resend confirmation error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
