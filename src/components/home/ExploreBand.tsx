import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";

const LINKS = [
  { label: "Vinhos", href: "/vinhos" },
  { label: "Uvas", href: "/uvas" },
  { label: "Regiões", href: "/regioes" },
  { label: "Países", href: "/paises" },
  { label: "Produtores", href: "/produtores" },
  { label: "Harmonizações", href: "/harmonizacoes" },
] as const;

/** Fechamento da home: convite para explorar as seções do catálogo. */
export function ExploreBand() {
  return (
    <section aria-labelledby="explorar-titulo" className="py-16 md:py-24">
      <Container className="grid justify-items-start gap-6">
        <h2 id="explorar-titulo" className="font-serif text-h2">
          Continue explorando
        </h2>
        <ul className="flex flex-wrap gap-3">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={buttonVariants({ variant: "secondary" })}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
