
import { createSupabaseAnonClient } from '@/lib/supabase-client';
import { GalleryClient } from './gallery-client';

interface ImagePlaceholder {
  id: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  title?: string;
  category?: string;
}

export async function Gallery() {
  const supabase = createSupabaseAnonClient();
  const { data: galleryItems, error } = await supabase.from('gallery').select('*');

  if (error) {
    console.error('Error fetching gallery items:', error);
    return <GalleryClient initialImages={[]} />;
  }

  const initialImages: ImagePlaceholder[] = galleryItems.map(item => ({
    id: item.id,
    description: item.description || '',
    imageUrl: item.image_url,
    title: item.title || '',
    category: item.category || '',
    imageHint: item.title || item.description || '', // Using title or description as hint
  }));

  return (
    <GalleryClient initialImages={initialImages} />
  );
}
