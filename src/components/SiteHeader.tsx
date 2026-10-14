import Link from "next/link";
import { Suspense } from "react";
import { NavTabs, NavTabsFallback } from "./NavTabs";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center rounded-md text-lg font-semibold tracking-tight text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          Corev
        </Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<NavTabsFallback />}>
          <NavTabs />
        </Suspense>
      </div>
    </header>
  );
}
