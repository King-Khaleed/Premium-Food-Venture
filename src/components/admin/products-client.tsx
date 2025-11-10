// src/components/admin/products-client.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, SquarePen } from 'lucide-react';
import { ProductDialog } from '@/components/ProductDialog'; // Assuming named export
import { useToast } from '@/hooks/use-toast';
import { deleteProduct, revalidateProducts } from '@/app/admin/products/actions'; // Import server actions for CRUD


// Define the Product type here or import it if it's in a shared types file
export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  is_featured: boolean | null;
  created_at: string;
};

type ProductsClientProps = {
  initialProducts: Product[];
};

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleProductAddedOrUpdated = () => {
    setIsDialogOpen(false);
    setEditingProduct(null); // Clear editing product after success
    revalidateProducts(); // Trigger revalidation of the server component data
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await deleteProduct(productId);
      if (error) {
        throw new Error(error.message);
      }
      toast({
        title: 'Success!',
        description: 'Product deleted successfully.',
        variant: 'default',
      });
      revalidateProducts(); // Revalidate after deletion
    } catch (error: any) {
      toast({
        title: 'Error deleting product',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}>
          Add Product
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} width={60} height={60} className="object-cover rounded-md" />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Image</div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price?.toFixed(2) || 'N/A'}</TableCell>
              <TableCell>{product.is_featured ? 'Yes' : 'No'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsDialogOpen(true);
                    }}
                  >
                    <SquarePen className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product &quot;{product.name}&quot;
                          from your database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingProduct}
        onProductAddedOrUpdated={handleProductAddedOrUpdated}
      />
    </>
  );
}