'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";

export async function handleSignIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Could not authenticate user' };
  }

  revalidatePath('/', 'layout');
  return { error: null, success: true };
}

export async function handleSignOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
}