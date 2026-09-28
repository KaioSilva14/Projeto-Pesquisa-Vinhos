"use client";

// Client Component: o ícone do item atual fica preenchido, o que depende da URL.

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CompassIcon, HeartIcon, HouseIcon, MagnifyingGlassIcon } from "@/components/ui/icons";
import { BOTTOM_NAV, isActivePath } from "@/config/nav";

const items = [
  { ...BOTTOM_NAV.home, Icon: HouseIcon },
  { ...BOTTOM_NAV.search, Icon: MagnifyingGlassIcon },
  { ...BOTTOM_NAV.explore, Icon: CompassIcon },
  { ...BOTTOM_NAV.favorites, Icon: HeartIcon },
];

/** Barra de navegação do celular (< 768 px), acima da área segura do iPhone (DESIGN.md §7.6). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-16 grid-cols-4">
        {items.map(({ label, href, Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex h-full flex-col items-center justify-center gap-1 text-caption text-text-muted aria-[current=page]:text-accent"
              >
                <Icon aria-hidden weight={active ? "fill" : "regular"} className="size-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
