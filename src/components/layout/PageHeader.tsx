import type { ReactNode } from "react";

import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";
import { Container } from "./Container";

type PageHeaderProps = {
  /** Título da página: o único <h1> dela. */
  title: string;
  description?: string;
  breadcrumbs?: readonly BreadcrumbItem[];
  /** Conteúdo extra abaixo do título (ex.: badges, ações). */
  children?: ReactNode;
};

/** Abertura das páginas internas: trilha, título e resumo curto. */
export function PageHeader({ title, description, breadcrumbs, children }: PageHeaderProps) {
  return (
    <Container className="grid gap-4 pt-6 pb-8 md:pt-10 md:pb-12">
      {breadcrumbs && breadcrumbs.length > 1 && <Breadcrumbs items={breadcrumbs} />}
      <h1 className="font-serif text-h1 text-balance">{title}</h1>
      {description && <p className="max-w-lead text-lead text-text-muted">{description}</p>}
      {children}
    </Container>
  );
}
