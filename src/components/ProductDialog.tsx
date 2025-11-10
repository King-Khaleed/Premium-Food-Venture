'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { createSupabaseAnonClient } from '@/lib/supabase-client';
import { createProduct, updateProduct } from '@/app/admin/products/actions'; // Assuming these actions exist and handle image_url

// Define the type for a product to be used in initialData
export type Product = {
  id?: string;
  name: string;
  description: string;
  // price: number; // Removed as requested
  image_url: string; // Will be handled by upload
  category: string;
  is_featured: boolean;
};

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Product | null;
  onProductAddedOrUpdated: () => Promise<void>;
}

export function ProductDialog({
  isOpen,
  onOpenChange,
  initialData,
  onProductAddedOrUpdated,
}: ProductDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // const [price, setPrice] = useState<number | ''>(''); // Removed
  // const [imageUrl, setImageUrl] = useState(''); // Removed, replaced by imageFile
  const [imageFile, setImageFile] = useState<File | null>(null); // New state for file upload
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); // To display current image for edit
  const [category, setCategory] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      // setPrice(initialData.price); // Removed
      setCategory(initialData.category);
      setIsFeatured(initialData.is_featured);
      setCurrentImageUrl(initialData.image_url); // Set current image URL for display
      setImageFile(null); // Clear file input when editing
    } else {
      // Reset form when adding new product
      setName('');
      setDescription('');
      // setPrice(''); // Removed
      setCategory('');
      setIsFeatured(false);
      setCurrentImageUrl(null); // Clear current image URL
      setImageFile(null); // Clear file input
    }
  }, [initialData, isOpen]); // Reset or pre-fill when dialog opens or initialData changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !description || !category) { // price and imageUrl removed from validation
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required text fields.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    let productImageUrl = currentImageUrl; // Start with existing image URL if editing

    if (imageFile) {
      // If a new file is selected, upload it
      const supabase = createSupabaseAnonClient();
      const fileExtension = imageFile.name.split('.').pop();
      const filePath = `products/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        toast({
          title: 'Upload Error',
          description: `Failed to upload image: ${uploadError.message}`,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      productImageUrl = publicUrlData.publicUrl;

      // If updating and there was a previous image, delete the old one from storage
      if (initialData?.id && currentImageUrl && currentImageUrl !== productImageUrl) {
          const oldFilePath = currentImageUrl.split('/').pop(); // This extracts the filename from the URL
          if (oldFilePath) {
              const { error: deleteOldError } = await supabase.storage.from('products').remove([`products/${oldFilePath}`]);
              if (deleteOldError) {
                  console.error('Failed to delete old image from storage:', deleteOldError);
              }
          }
      }

    } else if (!initialData?.id) { // If it's a new product and no image file is provided
      toast({
        title: 'Validation Error',
        description: 'Image file is required for new products.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    if (!productImageUrl) {
        toast({
            title: 'Error',
            description: 'Image URL could not be determined.',
            variant: 'destructive',
        });
        setLoading(false);
        return;
    }

    const productData = {
      name,
      description,
      // price, // Removed
      image_url: productImageUrl,
      category,
      is_featured: isFeatured,
    };

    try {
      let error = null;
      if (initialData?.id) {
        // Update existing product
        const { error: updateError } = await updateProduct(initialData.id, productData);
        error = updateError;
      } else {
        // Insert new product
        const { error: insertError } = await createProduct(productData);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: `Product ${initialData?.id ? 'updated' : 'added'} successfully.`,
        variant: 'default',
      });

      await onProductAddedOrUpdated(); // Revalidate path and close dialog
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to ${initialData?.id ? 'update' : 'add'} product: ${error.message}`,
        variant: 'destructive',
      });
      console.error('Supabase operation error:', error);
    } finally {
      setLoading(false);
      onOpenChange(false); // Close dialog
    }
  };

  const dialogTitle = initialData?.id ? 'Edit Product' : 'Add Product';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 min-h-[80px]"
              required
            />
          </div>
          {/* Removed Price Input
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || '')}
              className="col-span-3"
              step="0.01"
              required
            />
          </div>
          */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageFile" className="text-right">
              Image
            </Label>
            <Input
              id="imageFile"
              type="file"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="col-span-3"
              accept="image/*"
            />
          </div>
          {currentImageUrl && !imageFile && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Current Image</Label>
              <img src={currentImageUrl} alt="Current Product" className="col-span-3 h-20 w-20 object-cover rounded" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isFeatured" className="text-right">
              Featured
            </Label>
            <Checkbox
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(Boolean(checked))}
              className="col-span-3 w-5 h-5"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
