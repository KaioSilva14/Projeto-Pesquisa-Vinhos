import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { SearchForm } from "@/components/search/SearchForm";
import { buttonVariants } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

export type CatalogCount = { label: string; count: number; href: string };

type HomeHeroProps = {
  /** Quantidades reais do catálogo, que viram atalhos. */
  counts: readonly CatalogCount[];
};

/**
 * Abertura da home (DESIGN.md §8): título de até 2 linhas, subtítulo curto, a busca e a chamada
 * para explorar (CTA). Os números vêm dos dados publicados, não de texto fixo.
 */
export function HomeHero({ counts }: HomeHeroProps) {
  return (
    <section aria-labelledby="home-titulo" className="pt-12 pb-16 md:pt-20 md:pb-24">
      <Container className="grid gap-8">
        <div className="grid max-w-3xl gap-6">
          <h1 id="home-titulo" className="font-serif text-display text-balance">
            Vinhos com fonte, do rótulo à região.
          </h1>
          <span aria-hidden className="h-px w-16 bg-detail" />
          <p className="max-w-lead text-lead text-text-muted">
            Pesquise vinhos, uvas, regiões e produtores. Cada informação diz de onde veio.
          </p>
        </div>
        <SearchForm query="" focusWhenEmpty={false} />
        <div className="flex flex-wrap gap-3">
          <Link href="/explorar" className={buttonVariants({ size: "lg" })}>
            Explorar o catálogo
            <ArrowRightIcon aria-hidden className="size-5" />
          </Link>
          <Link href="/vinhos" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Ver os vinhos
          </Link>
        </div>
        <nav aria-label="O que há no catálogo">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-small">
            {counts.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-baseline gap-1.5 text-text-muted underline-offset-4 hover:text-text hover:underline"
                >
                  <span className="font-serif text-h4 text-text tabular-nums">{item.count}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
