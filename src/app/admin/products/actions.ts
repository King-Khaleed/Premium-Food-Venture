
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function revalidateProducts() {
    revalidatePath('/admin/products');
    revalidatePath('/');
}

export async function createProduct(formData: any) {
    const supabase = createSupabaseServerClient();
    const { name, description, image_url, category, is_featured } = formData;
    
    // Price is removed, so we don't include it in the object to be inserted.
    const productData = {
        name,
        description,
        image_url,
        category,
        is_featured,
        // price: null, // Explicitly set price to null if the column still exists and is nullable
    };

    const { data, error } = await supabase.from('products').insert([productData]);

    if (error) {
        console.error('Error creating product:', error);
        return { error: { message: 'Failed to create product.' } };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { data, error: null };
}


export async function updateProduct(id: string, formData: any) {
    const supabase = createSupabaseServerClient();
    const { name, description, image_url, category, is_featured } = formData;
    
    // Price is removed, so we don't include it in the update object.
    const productData = {
        name,
        description,
        image_url,
        category,
        is_featured,
    };
    
    const { data, error } = await supabase.from('products').update(productData).eq('id', id);

    if (error) {
        console.error('Error updating product:', error);
        return { error: { message: 'Failed to update product.' } };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { data, error: null };
}


export async function deleteProduct(id: string) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        return { error: { message: 'Failed to delete product.' } };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { data, error: null };
}
