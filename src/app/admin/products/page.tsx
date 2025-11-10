
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductsClient } from "@/components/admin/products-client"; 

export type Product = {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    price: number | null;
    image_url: string | null;
    category: string | null;
    is_featured: boolean;
};

export default async function AdminProductsPage() {
  const supabase = createSupabaseServerClient();
  const { data: products, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    // Render an error state or return empty array
    return <ProductsClient initialProducts={[]} />;
  }

  const fetchedProducts: Product[] = products || [];

  return (
    <ProductsClient initialProducts={fetchedProducts} />
  )
}
