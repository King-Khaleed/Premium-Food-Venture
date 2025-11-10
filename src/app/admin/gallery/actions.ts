
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function revalidateGallery() {
  revalidatePath('/admin/gallery');
  revalidatePath('/'); // Revalidate the homepage
}

export async function createGalleryItem({
  title,
  description,
  image_url,
  category,
}: {
  title: string;
  description?: string;
  image_url: string;
  category?: string;
}): Promise<{ data: any | null; error: Error | null }> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('gallery')
    .insert([{ title, description, image_url, category }])
    .select();

  if (error) {
    console.error('Error creating gallery item:', error);
    return { data: null, error: new Error('Failed to create gallery item.') };
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/'); // Revalidate the homepage
  return { data, error: null };
}

export async function updateGalleryItem(
  id: string,
  updatedFields: {
    title?: string;
    description?: string;
    image_url?: string;
    category?: string;
  }
): Promise<{ data: any[] | null; error: Error | null }> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('gallery')
    .update(updatedFields)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating gallery item:', error);
    return { data: null, error: new Error('Failed to update gallery item.') };
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/'); // Revalidate the homepage
  return { data, error: null };
}

export async function deleteGalleryItem(galleryItemId: string): Promise<{ error: Error | null }> {
  const supabase = createSupabaseServerClient();

  // 1. Fetch the image_url first
  const { data: galleryItem, error: fetchError } = await supabase
    .from('gallery')
    .select('image_url')
    .eq('id', galleryItemId)
    .single();

  if (fetchError) {
    console.error('Error fetching gallery item for deletion:', fetchError);
    return { error: new Error('Failed to fetch gallery item for deletion.') };
  }

  if (galleryItem?.image_url) {
    // 2. Extract image path/filename from the image_url
    const urlParts = galleryItem.image_url.split('/');
    const bucketName = 'gallery'; // Your bucket name
    const filePathIndex = urlParts.indexOf(bucketName);
    
    if (filePathIndex > -1 && filePathIndex + 1 < urlParts.length) {
      const filePath = urlParts.slice(filePathIndex + 1).join('/');

      // 3. Delete the image from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Return error but don't stop the db deletion
        return { error: new Error('Failed to delete image from storage.') };
      }
    } else {
      console.warn('Could not extract file path from URL:', galleryItem.image_url);
    }
  }

  // 4. Delete the gallery item from the 'gallery' table
  const { error: dbError } = await supabase
    .from('gallery')
    .delete()
    .eq('id', galleryItemId);

  if (dbError) {
    console.error('Error deleting gallery item from database:', dbError);
    return { error: new Error('Failed to delete gallery item from database.') };
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/'); // Revalidate the homepage

  return { error: null };
}
