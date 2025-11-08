import Image from 'next/image';
import { Fish, Beef, Shell } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const menuItems = [
    {
        icon: <Fish className="h-6 w-6 text-primary" />,
        name: "Fresh Atlantic Salmon",
        description: "Sustainably sourced, rich in Omega-3. Perfect for grilling or baking.",
        price: "$18.99/lb",
        imageId: "menu-fish"
    },
    {
        icon: <Beef className="h-6 w-6 text-primary" />,
        name: "Organic Free-Range Chicken",
        description: "Whole chickens, tender and juicy. No antibiotics or hormones.",
        price: "$7.49/lb",
        imageId: "menu-chicken"
    },
    {
        icon: <Shell className="h-6 w-6 text-primary" />,
        name: "Wild Caught King Prawns",
        description: "Large, succulent prawns, caught from the wild. Great for paella or BBQ.",
        price: "$25.00/lb",
        imageId: "menu-prawns"
    },
];

export function Menu() {
  return (
    <section id="menu" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Our Fresh Selection</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Discover our curated collection of premium meats and seafood, sourced for quality and taste.
                    </p>
                </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 mt-12">
                {menuItems.map((item) => {
                    const image = PlaceHolderImages.find(img => img.id === item.imageId);
                    return (
                        <Card key={item.name} className="h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-primary/10">
                            {image && (
                                <div className="relative w-full h-48">
                                    <Image
                                        src={image.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            )}
                            <CardHeader className="items-center text-center">
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <CardTitle className="font-headline">{item.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="text-center flex-grow flex flex-col justify-between">
                                <CardDescription className="mb-4">{item.description}</CardDescription>
                                <p className="text-lg font-semibold text-accent-foreground">{item.price}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    </section>
  );
}
