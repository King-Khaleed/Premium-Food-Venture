'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/lib/supabase-client';

export async function revalidateGallery() {
  revalidatePath('/admin/gallery');
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
}) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('gallery')
    .insert([{ title, description, image_url, category }])
    .select();

  if (error) {
    console.error('Error creating gallery item:', error);
    throw new Error('Failed to create gallery item.');
  }

  revalidatePath('/admin/gallery');
  return data;
}

export async function updateGalleryItem(
  id: string,
  updatedFields: {
    title?: string;
    description?: string;
    image_url?: string;
    category?: string;
  }
) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('gallery')
    .update(updatedFields)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating gallery item:', error);
    throw new Error('Failed to update gallery item.');
  }

  revalidatePath('/admin/gallery');
  return data;
}

export async function deleteGalleryItem(galleryItemId: string) {
  const supabase = createSupabaseClient();

  // 1. Fetch the image_url first
  const { data: galleryItem, error: fetchError } = await supabase
    .from('gallery')
    .select('image_url')
    .eq('id', galleryItemId)
    .single();

  if (fetchError) {
    console.error('Error fetching gallery item for deletion:', fetchError);
    throw new Error('Failed to fetch gallery item for deletion.');
  }

  if (galleryItem?.image_url) {
    // 2. Extract image path/filename from the image_url
    // Assuming image_url format like: https://[project_id].supabase.co/storage/v1/object/public/gallery/path/to/image.jpg
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
        // Depending on requirements, you might still want to delete the DB entry
        // or re-throw after logging. For now, we'll just log and proceed.
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
    throw new Error('Failed to delete gallery item from database.');
  }

  revalidatePath('/admin/gallery');
}