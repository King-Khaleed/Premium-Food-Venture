import { createSupabaseClient } from "@/lib/supabase-client";
import { ProductsClient } from "@/components/admin/products-client"; // Import the new ProductsClient component

// Define the Product type based on the Supabase schema
export type Product = { // Exported for use in ProductDialog and ProductsClient
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
  const supabase = createSupabaseClient();
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products:', error);
    // Handle error gracefully, perhaps return an empty array or show an error message
  }

  const fetchedProducts: Product[] = products || [];

  return (
    <ProductsClient initialProducts={fetchedProducts} />
  )
}