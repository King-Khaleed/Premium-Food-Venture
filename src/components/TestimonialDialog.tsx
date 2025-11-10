'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createSupabaseClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

// Define the Testimonial type based on your Supabase schema
interface Testimonial {
  id: string;
  author_name: string;
  author_title?: string;
  content: string;
  rating?: number;
  avatar_url?: string;
}

interface TestimonialDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTestimonialAdded: () => Promise<void>;
  initialData?: Testimonial; // New prop for editing
}

export function TestimonialDialog({ isOpen, onOpenChange, onTestimonialAdded, initialData }: TestimonialDialogProps) {
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) { // Only reset or populate when dialog opens
      if (initialData) {
        // Populate form fields for editing
        setAuthorName(initialData.author_name || '');
        setAuthorTitle(initialData.author_title || '');
        setContent(initialData.content || '');
        setRating(initialData.rating || '');
        setAvatarUrl(initialData.avatar_url || '');
      } else {
        // Reset form for adding new
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setAuthorName('');
    setAuthorTitle('');
    setContent('');
    setRating('');
    setAvatarUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const supabase = createSupabaseClient();
    const isEditing = !!initialData?.id;
    const toastAction = isEditing ? 'update' : 'add';

    try {
      if (isEditing) {
        // UPDATE operation
        const { error } = await supabase
          .from('testimonials')
          .update({
            author_name: authorName,
            author_title: authorTitle,
            content: content,
            rating: typeof rating === 'number' ? rating : null,
            avatar_url: avatarUrl || null,
          })
          .eq('id', initialData.id);

        if (error) {
          throw error;
        }

        toast({
          title: 'Success!',
          description: 'Testimonial updated successfully.',
          variant: 'default',
        });
      } else {
        // INSERT operation
        const { data, error } = await supabase
          .from('testimonials')
          .insert({
            author_name: authorName,
            author_title: authorTitle,
            content: content,
            rating: typeof rating === 'number' ? rating : null,
            avatar_url: avatarUrl || null,
          });

        if (error) {
          throw error;
        }

        toast({
          title: 'Success!',
          description: 'Testimonial added successfully.',
          variant: 'default',
        });
        resetForm(); // Reset only on successful add, not on edit
      }

      await onTestimonialAdded(); // Call the revalidation action
      onOpenChange(false); // Close dialog
    } catch (error: any) {
      console.error(`Error ${toastAction}ing testimonial:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${toastAction} testimonial: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="authorName" className="text-right">
              Author Name
            </Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="authorTitle" className="text-right">
              Author Title
            </Label>
            <Input
              id="authorTitle"
              value={authorTitle}
              onChange={(e) => setAuthorTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Testimonial
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating (1-5)
            </Label>
            <Input
              id="rating"
              type="number"
              value={rating}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                if (typeof value === 'number') {
                    setRating(value > 5 ? 5 : (value < 1 ? 1 : value));
                } else {
                    setRating('');
                }
              }}
              min="1"
              max="5"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatarUrl" className="text-right">
              Avatar URL
            </Label>
            <Input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (initialData?.id ? 'Updating...' : 'Saving...') : (initialData?.id ? 'Save Changes' : 'Save Testimonial')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}