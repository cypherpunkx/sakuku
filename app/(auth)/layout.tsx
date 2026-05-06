export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased selection:bg-primary/30 selection:text-primary-foreground">
      {children}
    </div>
  );
}
