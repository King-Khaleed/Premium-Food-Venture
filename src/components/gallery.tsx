
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { GalleryClient, type GalleryImage } from './gallery-client';

export async function Gallery() {
  const supabase = createSupabaseServerClient();
  const { data: galleryItems, error } = await supabase.from('gallery').select('*');

  if (error) {
    console.error('Error fetching gallery items:', error);
    return <GalleryClient initialImages={[]} />;
  }

  // Directly pass the Supabase data, which already matches the GalleryImage type.
  // The GalleryImage type in gallery-client.tsx expects 'image_url', which is what Supabase provides.
  const initialImages: GalleryImage[] = galleryItems.map(item => ({
    id: item.id,
    title: item.title || null,
    description: item.description || null,
    image_url: item.image_url,
    category: item.category || null,
  }));

  return (
    <GalleryClient initialImages={initialImages} />
  );
}
