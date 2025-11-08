import { Fish } from 'lucide-react';

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2" aria-label="Premium Food Ventures Home">
      <Fish className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground font-headline">Premium Food Ventures</span>
    </a>
  );
}
