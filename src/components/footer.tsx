export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-6 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Premium Food Ventures. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
