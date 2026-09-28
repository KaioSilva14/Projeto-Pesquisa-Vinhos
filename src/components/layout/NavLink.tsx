"use client";

// Client Component só para ler a URL atual (usePathname) e marcar o link ativo.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { isActivePath } from "@/config/nav";

type NavLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Link de menu que recebe aria-current="page" na seção atual (estilize com aria-[current=page]:). */
export function NavLink({ href, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);
  return <Link href={href} aria-current={active ? "page" : undefined} {...props} />;
}
