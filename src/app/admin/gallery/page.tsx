'use client';
import Image from "next/image"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function AdminGalleryPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Gallery</h1>
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Item
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Add Gallery Item</DialogTitle>
                <DialogDescription>
                    Add a new image or video to your gallery.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                    Title
                    </Label>
                    <Input id="title" placeholder="e.g., Fresh Salmon" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                    Description
                    </Label>
                    <Textarea id="description" placeholder="A close-up of a fresh salmon fillet." className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                    Category
                    </Label>
                    <Input id="category" placeholder="fish, chicken, or dried-products" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                    Image
                    </Label>
                    <Input id="image" type="file" className="col-span-3" />
                </div>
                </div>
                <DialogFooter>
                <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gallery Items</CardTitle>
          <CardDescription>
            Manage the images and videos that appear on your gallery page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <Card key={image.id}>
                <CardContent className="p-0 relative">
                    <Image
                        alt={image.description}
                        className="aspect-square w-full rounded-t-lg object-cover"
                        height="200"
                        src={image.imageUrl}
                        width="200"
                    />
                    {image.category && <Badge className="absolute top-2 right-2">{image.category}</Badge>}
                </CardContent>
                <div className="p-4 text-sm">
                    <h3 className="font-medium leading-none">{image.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{image.description}</p>
                </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
