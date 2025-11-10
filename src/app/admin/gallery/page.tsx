'use client';

import Image from "next/image"
import { MoreHorizontal, PlusCircle, SquarePen, Trash2 } from "lucide-react"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { revalidateGallery, deleteGalleryItem } from "./actions"; // Assuming deleteGalleryItem will be added here

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

import { createSupabaseClient } from "@/lib/supabase-client";
import { GalleryDialog } from "@/components/GalleryDialog"; // Import the new dialog component

interface GalleryItem {
  id: string;
  created_at: string;
  title: string;
  image_url: string;
  description: string;
  category: string;
}

export default function AdminGalleryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const { toast } = useToast();

  // Fetching data inside a client component
  // This is a temporary setup. For production, you'd typically fetch data on the server
  // and pass it as props, or use a client-side data fetching library like SWR/React Query.
  // For now, to quickly get the CRUD UI working, we will re-fetch on the client.
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This effect will run once to fetch initial data and then whenever revalidation happens
  // We should ideally pass this from a Server Component that wraps this Client Component.
  // But for the sake of making this page interactive as per the request, we'll fetch here.
  useState(() => {
    async function fetchGalleryItems() {
      setIsLoading(true);
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from('gallery').select('*');

      if (error) {
        console.error("Error fetching gallery images:", error);
        toast({
          title: "Error",
          description: "Failed to load gallery items.",
          variant: "destructive",
        });
        setGalleryImages([]);
      } else {
        setGalleryImages(data as GalleryItem[]);
      }
      setIsLoading(false);
    }
    fetchGalleryItems();
  });


  const onGalleryItemAddedOrUpdated = async () => {
    setIsDialogOpen(false);
    setEditingGalleryItem(null); // Reset editing state
    // Trigger server action to revalidate data
    await revalidateGallery();
    // For immediate client-side update without full page reload,
    // we would ideally refetch the data here or pass a fresh prop.
    // Given the current structure, revalidateGallery() will make the server
    // component that renders this page re-fetch, but for this client component,
    // we need to trigger the fetch again or get updated props.
    // For now, re-running the initial fetch logic for demonstration.
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('gallery').select('*');
    if (error) {
      console.error("Error re-fetching gallery images:", error);
      toast({
        title: "Error",
        description: "Failed to refresh gallery items after update.",
        variant: "destructive",
      });
      setGalleryImages([]);
    } else {
      setGalleryImages(data as GalleryItem[]);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteGalleryItem(id); // Call the server action
    if (error) {
      toast({
        title: "Error",
        description: `Failed to delete gallery item: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Gallery item deleted successfully.",
      });
      await onGalleryItemAddedOrUpdated(); // Revalidate and refresh list
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Gallery</h1>
        <Button size="sm" className="h-8 gap-1" onClick={() => {
            setEditingGalleryItem(null); // Ensure no item is being edited
            setIsDialogOpen(true);
        }}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Item
          </span>
        </Button>
      </div>

      <GalleryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingGalleryItem}
        onGalleryItemAddedOrUpdated={onGalleryItemAddedOrUpdated}
      />

      <Card>
        <CardHeader>
          <CardTitle>Gallery Items</CardTitle>
          <CardDescription>
            Manage the images and videos that appear on your gallery page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <p>Loading gallery items...</p>
          ) : galleryImages.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">No gallery items found. Add one!</p>
          ) : (
            galleryImages.map((image) => (
              <Card key={image.id} className="group">
                <CardContent className="p-0 relative">
                  <Image
                    alt={image.description}
                    className="aspect-square w-full rounded-t-lg object-cover"
                    height="200"
                    src={image.image_url}
                    width="200"
                  />
                  {image.category && <Badge className="absolute top-2 right-2">{image.category}</Badge>}
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          className="bg-white/50 hover:bg-white/75 rounded-full h-8 w-8"
                        >
                          <MoreHorizontal className="h-4 w-4 text-black" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => {
                            setEditingGalleryItem(image);
                            setIsDialogOpen(true);
                        }}>
                          <SquarePen className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}> {/* Prevent dropdown closing immediately */}
                              <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the gallery item: &quot;{image.title}&quot;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(image.id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
                <div className="p-4 text-sm">
                  <h3 className="font-medium leading-none">{image.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{image.description}</p>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </>
  )
}