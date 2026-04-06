import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-bold tracking-tighter text-foreground sm:text-9xl">
        404
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Page not found. The page you're looking for doesn't exist or has been
        moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Go home
      </Link>
    </div>
  );
}
