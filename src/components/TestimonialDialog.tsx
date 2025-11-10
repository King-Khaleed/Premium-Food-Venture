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
import { createSupabaseAnonClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from './ui/checkbox';

// Define the Testimonial type based on your Supabase schema
interface Testimonial {
  id: string;
  author_name: string;
  content: string;
  rating?: number;
  avatar_url?: string;
  is_approved: boolean;
}

interface TestimonialDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTestimonialAdded: () => Promise<void>;
  initialData?: Testimonial | null; 
}

export function TestimonialDialog({ isOpen, onOpenChange, onTestimonialAdded, initialData }: TestimonialDialogProps) {
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [isApproved, setIsApproved] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) { 
      if (initialData) {
        setAuthorName(initialData.author_name || '');
        setContent(initialData.content || '');
        setRating(initialData.rating || '');
        setIsApproved(initialData.is_approved || false);
        setCurrentAvatarUrl(initialData.avatar_url || null);
        setAvatarFile(null);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setAuthorName('');
    setContent('');
    setRating('');
    setIsApproved(false);
    setAvatarFile(null);
    setCurrentAvatarUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const supabase = createSupabaseAnonClient();
    const isEditing = !!initialData?.id;
    let avatarUrl = currentAvatarUrl;

    try {
      if (avatarFile) {
        // Upload new avatar if one is selected
        const fileExtension = avatarFile.name.split('.').pop();
        const filePath = `public/${uuidv4()}.${fileExtension}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars') // Correct bucket name
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: isEditing,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('avatars') // Correct bucket name
          .getPublicUrl(filePath);
        
        avatarUrl = publicUrlData.publicUrl;
      }

      const testimonialData = {
        author_name: authorName,
        content: content,
        rating: typeof rating === 'number' ? rating : null,
        avatar_url: avatarUrl,
        is_approved: isApproved,
      };

      if (isEditing) {
        // UPDATE operation
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast({ title: 'Success!', description: 'Testimonial updated successfully.' });
      } else {
        // INSERT operation
        const { error } = await supabase.from('testimonials').insert(testimonialData);

        if (error) throw error;
        toast({ title: 'Success!', description: 'Testimonial added successfully.' });
        resetForm();
      }

      await onTestimonialAdded();
      onOpenChange(false);
    } catch (error: any) {
      console.error(`Error saving testimonial:`, error);
      toast({
        title: 'Error',
        description: `Failed to save testimonial: ${error.message || 'Unknown error'}`,
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
            <Label htmlFor="avatarFile" className="text-right">
              Avatar Image
            </Label>
            <Input
              id="avatarFile"
              type="file"
              onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
              className="col-span-3"
              accept="image/*"
            />
          </div>
           {currentAvatarUrl && !avatarFile && (
              <div className="col-span-4 text-sm text-muted-foreground text-center">
                Current Image: <a href={currentAvatarUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
              </div>
            )}
          <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isApproved" className="text-right">Approved</Label>
              <Checkbox
                id="isApproved"
                checked={isApproved}
                onCheckedChange={(checked) => setIsApproved(Boolean(checked))}
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
