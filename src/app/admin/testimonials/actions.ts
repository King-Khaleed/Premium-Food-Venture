
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function createTestimonial(formData: FormData) {
    const supabase = createSupabaseServerClient();
    const rawFormData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        testimonial: formData.get('testimonial') as string,
        avatar_url: formData.get('avatar_url') as string,
    };
    const { data, error } = await supabase.from('testimonials').insert([rawFormData]);

    if (error) {
        console.error('Error creating testimonial:', error);
        return { error: 'Failed to create testimonial.' };
    }

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { data };
}

export async function updateTestimonial(id: string, formData: FormData) {
    const supabase = createSupabaseServerClient();
    const rawFormData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        testimonial: formData.get('testimonial') as string,
        avatar_url: formData.get('avatar_url') as string,
    };
    const { data, error } = await supabase.from('testimonials').update(rawFormData).eq('id', id);

    if (error) {
        console.error('Error updating testimonial:', error);
        return { error: 'Failed to update testimonial.' };
    }

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { data };
}

export async function deleteTestimonial(id: string) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('testimonials').delete().eq('id', id);

    if (error) {
        console.error('Error deleting testimonial:', error);
        return { error: 'Failed to delete testimonial.' };
    }

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { data };
}
