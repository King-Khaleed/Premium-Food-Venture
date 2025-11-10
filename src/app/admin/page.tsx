import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createSupabaseServerClient } from "@/lib/supabase-client";

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient();

  let productCount = 0;
  let galleryCount = 0;
  let testimonialCount = 0;

  // Fetch product count
  const { count: products_count, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact' });
  if (!productsError && products_count !== null) {
    productCount = products_count;
  } else if (productsError) {
    console.error("Error fetching product count:", productsError);
  }

  // Fetch gallery count
  const { count: gallery_count, error: galleryError } = await supabase
    .from('gallery')
    .select('*', { count: 'exact' });
  if (!galleryError && gallery_count !== null) {
    galleryCount = gallery_count;
  } else if (galleryError) {
    console.error("Error fetching gallery count:", galleryError);
  }

  // Fetch testimonial count
  const { count: testimonials_count, error: testimonialsError } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact' });
  if (!testimonialsError && testimonials_count !== null) {
    testimonialCount = testimonials_count;
  } else if (testimonialsError) {
    console.error("Error fetching testimonial count:", testimonialsError);
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
      >
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                <CardDescription>Total Products</CardDescription>
                <CardTitle className="text-4xl">{productCount}</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-xs text-muted-foreground">
                    {/* Dynamic 'from last month' data would require more complex logic */}
                    {/* For now, removing static text or indicating no change */}
                    No monthly change available
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                <CardDescription>Gallery Items</CardDescription>
                <CardTitle className="text-4xl">{galleryCount}</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-xs text-muted-foreground">
                    No monthly change available
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                <CardDescription>Total Testimonials</CardDescription>
                <CardTitle className="text-4xl">{testimonialCount}</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-xs text-muted-foreground">
                    No monthly change available
                </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  )
}