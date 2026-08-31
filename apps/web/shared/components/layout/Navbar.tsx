"use client";
import logoDark from "@shared/assets/images/logo_dark.webp";
import logoLight from "@shared/assets/images/logo_light.webp";
import AppearanceControls from "@shared/components/layout/AppearanceControls";
import { ROUTES } from "@shared/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header dir="ltr" className="flex h-20 items-center justify-between px-16 py-4">
      <Link href={ROUTES.home}>
        <Image src={logoDark} alt="Outscout" className="h-14 w-auto dark:hidden" draggable={false} priority />
        <Image src={logoLight} alt="Outscout" className="hidden h-14 w-auto dark:block" draggable={false} priority />
      </Link>

      <AppearanceControls />
    </header>
  );
}
