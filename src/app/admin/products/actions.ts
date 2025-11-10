// src/app/admin/products/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase-client';

export async function revalidateProducts() {
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function createProduct(productData: {
  name: string;
  description: string;
  image_url: string;
  category: string;
  is_featured: boolean;
}): Promise<{ data: any | null; error: Error | null }> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('products').insert([productData]).select(); // Added .select() to ensure data is returned

  if (error) {
    console.error('Error creating product:', error);
    return { data: null, error: new Error(`Failed to create product: ${error.message}`) };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  return { data, error: null };
}

export async function updateProduct(
  id: string,
  updatedFields: {
    name?: string;
    description?: string;
    image_url?: string;
    category?: string;
    is_featured?: boolean;
  }
): Promise<{ data: any | null; error: Error | null }> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .update(updatedFields)
    .eq('id', id)
    .select(); // Added .select() to ensure data is returned

  if (error) {
    console.error('Error updating product:', error);
    return { data: null, error: new Error(`Failed to update product: ${error.message}`) };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  return { data, error: null };
}

export async function deleteProduct(productId: string) {
  const supabase = createSupabaseClient();
  const { error } = await supabase.from('products').delete().eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  // No data to return for a successful delete operation
}