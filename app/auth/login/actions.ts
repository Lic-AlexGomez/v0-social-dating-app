"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Check if user has completed profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, date_of_birth")
      .eq("id", data.user.id)
      .single()

    revalidatePath("/", "layout")

    if (!profile?.username || !profile?.date_of_birth) {
      redirect("/onboarding")
    } else {
      redirect("/feed")
    }
  }

  return { error: "Login failed" }
}
