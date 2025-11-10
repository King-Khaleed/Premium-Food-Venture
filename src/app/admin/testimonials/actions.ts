// src/app/admin/testimonials/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase-client';

export async function revalidateTestimonials() {
  revalidatePath('/admin/testimonials');
}

export async function deleteTestimonial(testimonialId: string) {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', testimonialId);

  if (error) {
    console.error('Error deleting testimonial:', error);
    // You might want to throw the error or return a status here
    // based on how you want to handle it in the UI.
    throw new Error(`Failed to delete testimonial: ${error.message}`);
  }

  revalidatePath('/admin/testimonials');
}

export async function updateTestimonial(
  id: string,
  updatedFields: {
    author_name?: string;
    author_title?: string;
    content?: string;
    rating?: number;
    avatar_url?: string;
    is_approved?: boolean;
  }
) {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from('testimonials')
    .update(updatedFields)
    .eq('id', id);

  if (error) {
    console.error('Error updating testimonial:', error);
    throw new Error(`Failed to update testimonial: ${error.message}`);
  }

  revalidatePath('/admin/testimonials');
}