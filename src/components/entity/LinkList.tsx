import Link from "next/link";
import { Fragment } from "react";

import type { EntityRef } from "@/lib/entity-list";

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-accent";

type LinkListProps = {
  items: readonly EntityRef[];
};

/**
 * Links em texto corrido ("Merlot, Cabernet Sauvignon"): cabe numa linha da ficha e deixa a nota
 * da fonte logo depois do último nome.
 */
export function LinkList({ items }: LinkListProps) {
  return items.map((item, index) => (
    <Fragment key={item.href}>
      {index > 0 && ", "}
      <Link href={item.href} className={linkClass}>
        {item.name}
      </Link>
    </Fragment>
  ));
}
