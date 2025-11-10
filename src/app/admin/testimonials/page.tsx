'use client';
import Image from "next/image"
import { MoreHorizontal, PlusCircle, Trash2, SquarePen } from "lucide-react"
import { useState, useEffect, useCallback } from 'react';

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
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { TestimonialDialog } from "@/components/TestimonialDialog";
import { deleteTestimonial, revalidateTestimonials } from './actions';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  created_at: string;
  author_name: string;
  content: string;
  rating: number | null;
  avatar_url: string | null;
  is_approved: boolean;
}

export default function AdminTestimonialsPage() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error.message);
      toast({
        title: 'Error',
        description: `Failed to load testimonials: ${error.message}`,
        variant: 'destructive',
      });
      setTestimonials([]);
    } else {
      setTestimonials(data as Testimonial[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (id: string) => {
    const { error } = await deleteTestimonial(id);
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to delete testimonial: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } else {
       toast({
        title: 'Success',
        description: 'Testimonial deleted successfully.',
      });
      await fetchTestimonials();
    }
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTestimonial(null);
    }
    setIsDialogOpen(open);
  };

  const handleTestimonialOperationSuccess = async () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
    await revalidateTestimonials();
    await fetchTestimonials(); // Refetch after add/update
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Testimonials</h1>
        <Button size="sm" className="h-8 gap-1" onClick={() => {
          setEditingTestimonial(null);
          setIsDialogOpen(true);
        }}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Testimonial
          </span>
        </Button>
      </div>

       <TestimonialDialog
          isOpen={isDialogOpen}
          onOpenChange={handleDialogClose}
          initialData={editingTestimonial}
          onTestimonialAdded={handleTestimonialOperationSuccess}
        />

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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                    <TableCell className="hidden sm:table-cell">
                    {testimonial.avatar_url ? (
                      <Image
                          alt={testimonial.author_name}
                          className="aspect-square rounded-full object-cover"
                          height="40"
                          src={testimonial.avatar_url}
                          width="40"
                      />
                    ) : (
                      <div className="aspect-square h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
                        N/A
                      </div>
                    )}
                    </TableCell>
                    <TableCell className="font-medium">{testimonial.author_name}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-0.5">
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
                          <DropdownMenuItem onSelect={() => handleEditClick(testimonial)}>
                              <SquarePen className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
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
