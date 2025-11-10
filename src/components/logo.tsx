import { cn } from '@/lib/utils';

type LogoProps = {
  isScrolled?: boolean;
  isFooter?: boolean;
};

export function Logo({ isScrolled = false, isFooter = false }: LogoProps) {
  return (
    <a href="/" className="flex items-center gap-2" aria-label="Premium Food Venture Home">
      <span 
        className={cn(
          "text-2xl font-bold font-headline transition-colors",
          isFooter ? 'text-white' : 'text-white'
        )}
      >
        PFV
      </span>
    </a>
  );
}
