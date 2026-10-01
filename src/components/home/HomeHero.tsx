import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { SearchForm } from "@/components/search/SearchForm";
import { buttonVariants } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

export type CatalogCount = { label: string; count: number; href: string };

type HomeHeroProps = {
  /** Quantidades reais do catálogo, que viram atalhos. */
  counts: readonly CatalogCount[];
  /** Lado visual (foto + 3D), só em telas largas. */
  visual?: ReactNode;
};

/**
 * Abertura da home (DESIGN.md §8): título de até 2 linhas, subtítulo curto, a busca e a chamada
 * para explorar (CTA). Os números vêm dos dados publicados, não de texto fixo.
 */
export function HomeHero({ counts, visual }: HomeHeroProps) {
  return (
    <section aria-labelledby="home-titulo" className="pt-12 pb-16 md:pt-20 md:pb-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
        <div className="grid gap-8">
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
        </div>
        {/* No celular e no tablet, a abertura fica só com a busca e as chamadas */}
        {visual && <div className="hidden lg:block">{visual}</div>}
      </Container>
    </section>
  );
}
