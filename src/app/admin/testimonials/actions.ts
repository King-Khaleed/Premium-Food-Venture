
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function revalidateTestimonials() {
    revalidatePath('/admin/testimonials');
    revalidatePath('/');
}

export async function createTestimonial(formData: any) {
    const supabase = createSupabaseServerClient();
    // author_title is removed
    const { author_name, content, rating, avatar_url, is_approved } = formData;
    
    const testimonialData = {
        author_name,
        content,
        rating,
        avatar_url,
        is_approved
    };

    const { data, error } = await supabase.from('testimonials').insert([testimonialData]);

    if (error) {
        console.error('Error creating testimonial:', error);
        return { error: { message: 'Failed to create testimonial.' } };
    }

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { data, error: null };
}


export async function updateTestimonial(id: string, formData: any) {
    const supabase = createSupabaseServerClient();
    // author_title is removed
    const { author_name, content, rating, avatar_url, is_approved } = formData;
    
    const testimonialData = {
        author_name,
        content,
        rating,
        avatar_url,
        is_approved,
    };
    
    const { data, error } = await supabase.from('testimonials').update(testimonialData).eq('id', id);

    if (error) {
        console.error('Error updating testimonial:', error);
        return { error: { message: 'Failed to update testimonial.' } };
    }

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { data, error: null };
}


export async function deleteTestimonial(id: string) {
    const supabase = createSupabaseServerClient();

    // 1. Fetch avatar_url to delete from storage
    const { data: testimonial, error: fetchError } = await supabase
        .from('testimonials')
        .select('avatar_url')
        .eq('id', id)
        .single();

    if (fetchError) {
        console.error('Error fetching testimonial for deletion:', fetchError);
        // Don't block DB deletion if this fails, but log it.
    }

    // 2. Delete from database
    const { error: dbError } = await supabase.from('testimonials').delete().eq('id', id);

    if (dbError) {
        console.error('Error deleting testimonial from DB:', dbError);
        return { error: { message: 'Failed to delete testimonial.' } };
    }

    // 3. If DB deletion was successful, delete from storage
    if (testimonial?.avatar_url) {
        const urlParts = testimonial.avatar_url.split('/');
        const bucketName = 'avatars'; // Correct bucket name
        const filePathIndex = urlParts.indexOf(bucketName);
        
        if (filePathIndex > -1 && filePathIndex + 1 < urlParts.length) {
            const filePath = urlParts.slice(filePathIndex + 1).join('/');
            const { error: storageError } = await supabase.storage.from(bucketName).remove([filePath]);
            if (storageError) {
                console.error('Error deleting avatar from storage:', storageError);
                // Non-critical, so we don't return an error to the client
            }
        }
    }


    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { data: null, error: null };
}
