'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createSupabaseClient } from '@/lib/supabase-client';
import { v4 as uuidv4 } from 'uuid';

// Define a type for the gallery item that matches our Supabase schema
interface GalleryItem {
  id?: string; // Optional for new items
  title: string;
  description: string;
  image_url: string;
  category: string;
}

interface GalleryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: GalleryItem | null;
  onGalleryItemAddedOrUpdated: () => Promise<void>;
}

export function GalleryDialog({
  isOpen,
  onOpenChange,
  initialData,
  onGalleryItemAddedOrUpdated,
}: GalleryDialogProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState(initialData?.category || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
      // Do not set imageFile from initialData.image_url, as it's a file input
    } else {
      // Reset form for new item
      setTitle('');
      setDescription('');
      setImageFile(null);
      setCategory('');
    }
  }, [initialData, isOpen]); // Reset when dialog opens or initialData changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = initialData?.image_url || ''; // Use existing URL if editing and no new file

    try {
      if (imageFile) {
        // Handle image upload to Supabase Storage
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `gallery/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery') // Assuming you have a 'gallery' bucket
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false, // Do not upsert, we want a new file
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        if (publicUrlData) {
          imageUrl = publicUrlData.publicUrl;
        } else {
          throw new Error('Could not get public URL for uploaded image.');
        }
      } else if (!initialData?.image_url) {
        // If no file uploaded and not editing an existing image, image_url is required for new entries
        throw new Error('Image file is required for new gallery items.');
      }

      if (initialData?.id) {
        // Update existing gallery item
        const { error } = await supabase
          .from('gallery')
          .update({
            title,
            description,
            image_url: imageUrl,
            category,
          })
          .eq('id', initialData.id);

        if (error) throw error;
        toast({
          title: 'Success!',
          description: 'Gallery item updated successfully.',
        });
      } else {
        // Insert new gallery item
        const { error } = await supabase.from('gallery').insert({
          title,
          description,
          image_url: imageUrl,
          category,
        });

        if (error) throw error;
        toast({
          title: 'Success!',
          description: 'Gallery item added successfully.',
        });
      }

      await onGalleryItemAddedOrUpdated(); // Revalidate and close
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to save gallery item: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageFile" className="text-right">
              Image
            </Label>
            <Input
              id="imageFile"
              type="file"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="col-span-3"
            />
            {initialData?.image_url && !imageFile && (
              <span className="col-span-4 text-sm text-muted-foreground text-center">
                Current Image: <a href={initialData.image_url} target="_blank" rel="noopener noreferrer" className="underline">View</a>
              </span>
            )}
          </div>
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