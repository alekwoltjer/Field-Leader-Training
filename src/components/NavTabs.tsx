"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  matches: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/library",
    label: "Training Library",
    shortLabel: "Library",
    matches: (p) => p.startsWith("/library"),
  },
  {
    href: "/veterans",
    label: "Veteran Experience Hub",
    shortLabel: "Veteran Hub",
    matches: (p) => p.startsWith("/veterans"),
  },
  {
    href: "/leaders",
    label: "Upcoming Leaders",
    shortLabel: "Upcoming Leaders",
    matches: (p) => p.startsWith("/leaders"),
  },
];

function Tabs({ items, activeHref }: { items: NavItem[]; activeHref?: string }) {
  return (
    <nav aria-label="Primary" className="scrollbar-none -mb-px flex gap-6 overflow-x-auto sm:gap-8">
      {items.map((item) => {
        const active = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black",
              active
                ? "border-neutral-950 text-neutral-950"
                : "border-transparent text-neutral-500 hover:text-neutral-950",
            )}
          >
            <span className="sm:hidden">{item.shortLabel}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function NavTabs() {
  const pathname = usePathname();
  const active = NAV_ITEMS.find((item) => item.matches(pathname));
  return <Tabs items={NAV_ITEMS} activeHref={active?.href} />;
}

export function NavTabsFallback() {
  return <Tabs items={NAV_ITEMS} />;
}
