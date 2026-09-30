import type { ReactNode } from "react";

import type { BreadcrumbItem } from "@/lib/seo/common";

import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";

type EntityLayoutProps = {
  breadcrumbs: readonly BreadcrumbItem[];
  /** Coluna da foto (fixa ao rolar no desktop). Sem ela, o conteúdo ocupa uma coluna só. */
  media?: ReactNode;
  children: ReactNode;
};

/** Esqueleto das páginas de entidade (DESIGN.md §8): trilha, coluna da foto e conteúdo. */
export function EntityLayout({ breadcrumbs, media, children }: EntityLayoutProps) {
  return (
    <>
      <Container className="pt-6 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </Container>
      <Container
        className={
          media
            ? "grid gap-10 pt-6 pb-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
            : "pt-6 pb-16"
        }
      >
        {media && <div className="lg:sticky lg:top-24 lg:self-start">{media}</div>}
        <div className={media ? "grid min-w-0 content-start gap-14" : "grid max-w-4xl gap-14"}>
          {children}
        </div>
      </Container>
    </>
  );
}
