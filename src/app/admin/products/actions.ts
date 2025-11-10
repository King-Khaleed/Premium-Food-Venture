
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function createProduct(formData: FormData) {
    const supabase = createSupabaseServerClient();
    const rawFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        image_url: formData.get('image_url') as string,
    };
    const { data, error } = await supabase.from('products').insert([rawFormData]);

    if (error) {
        console.error('Error creating product:', error);
        return { error: 'Failed to create product.' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { data };
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = createSupabaseServerClient();
    const rawFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        image_url: formData.get('image_url') as string,
    };
    const { data, error } = await supabase.from('products').update(rawFormData).eq('id', id);

    if (error) {
        console.error('Error updating product:', error);
        return { error: 'Failed to update product.' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { data };
}

export async function deleteProduct(id: string) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        return { error: 'Failed to delete product.' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { data };
}
