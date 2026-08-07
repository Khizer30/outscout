import { ROUTES } from "@shared/lib/routes";
import { MapPinOff } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MapPinOff className="size-10" strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
        <p className="text-lg font-medium text-foreground">This location isn&apos;t on the map</p>
        <p className="max-w-sm text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
      </div>

      <Link
        href={ROUTES.home}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to home
      </Link>
    </div>
  );
}
