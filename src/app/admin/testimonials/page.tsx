'use client';
import Image from "next/image"
import { MoreHorizontal, PlusCircle, Trash2, SquarePen } from "lucide-react" // Added Trash2 and SquarePen
import { useState } from 'react';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog" // All AlertDialog components are already imported.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { createSupabaseClient } from "@/lib/supabase-client";
import TestimonialDialog from "@/components/TestimonialDialog";
import { revalidateTestimonials, deleteTestimonial } from './actions'; // Import deleteTestimonial
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Define a type for the testimonial data fetched from Supabase
interface Testimonial {
  id: string;
  created_at: string;
  author_name: string;
  author_title: string | null;
  content: string;
  rating: number | null;
  avatar_url: string | null;
  is_approved: boolean;
}

export default async function AdminTestimonialsPage() {
  const supabase = createSupabaseClient();
  const { data: testimonials, error } = await supabase.from('testimonials').select('*');
  const { toast } = useToast(); // Initialize toast

  if (error) {
    console.error('Error fetching testimonials:', error.message);
    toast({
      title: 'Error',
      description: `Failed to load testimonials: ${error.message}`,
      variant: 'destructive',
    });
  }

  const fetchedTestimonials: Testimonial[] = testimonials || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controls the TestimonialDialog visibility
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null); // State to hold testimonial being edited

  // Moved handleDelete to be a client-side function to work with AlertDialog
  const handleDelete = async (id: string) => {
    try {
      // Call the server action directly
      await deleteTestimonial(id);
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully.',
      });
      // The revalidation is handled within deleteTestimonial server action
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to delete testimonial: ${err.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTestimonial(null); // Clear editing testimonial when dialog closes
    }
    setIsDialogOpen(open);
  };

  const handleTestimonialOperationSuccess = () => {
    revalidateTestimonials(); // This will trigger a server-side revalidation
    setIsDialogOpen(false); // Close the dialog after the action
    setEditingTestimonial(null); // Clear editing testimonial after successful op
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Testimonials</h1>
        <TestimonialDialog
          isOpen={isDialogOpen}
          onOpenChange={handleDialogClose} // Use the combined close handler
          initialData={editingTestimonial} // Pass initialData for editing
          onTestimonialAdded={handleTestimonialOperationSuccess}
        >
          <Button size="sm" className="h-8 gap-1" onClick={() => {
            setEditingTestimonial(null); // Ensure no initial data when opening for add
            setIsDialogOpen(true);
          }}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Testimonial
            </span>
          </Button>
        </TestimonialDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer Testimonials</CardTitle>
          <CardDescription>
            Manage what your customers are saying about you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[64px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden md:table-cell">
                  Testimonial
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetchedTestimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                    <TableCell className="hidden sm:table-cell">
                    <Image
                        alt={testimonial.author_name}
                        className="aspect-square rounded-full object-cover"
                        height="40"
                        src={testimonial.avatar_url || '/img/placeholder-avatar.jpg'} // Provide a fallback avatar
                        width="40"
                    />
                    </TableCell>
                    <TableCell className="font-medium">{testimonial.author_name}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-0.5">
                            {/* Assuming rating is 1-5 */}
                            {Array(testimonial.rating || 0).fill(0).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent fill-accent" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            ))}
                             {Array(5 - (testimonial.rating || 0)).fill(0).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {testimonial.content}
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        {/* Edit Testimonial button - now directly in DropdownMenuContent */}
                        <button
                            onClick={() => handleEditClick(testimonial)}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                            <SquarePen className="mr-2 h-4 w-4" />Edit
                        </button>

                        {/* Delete Confirmation Dialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-destructive-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />Delete
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this testimonial.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(testimonial.id)}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}