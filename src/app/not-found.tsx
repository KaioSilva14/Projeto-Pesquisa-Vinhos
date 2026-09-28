import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/states/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { MapTrifoldIcon } from "@/components/ui/icons";
import { SearchInput } from "@/components/ui/SearchInput";

// Sem `robots` aqui: o Next já marca a 404 como noindex (repetir gera duas tags)
export const metadata: Metadata = {
  title: "Página não encontrada",
};

// 404 útil: explica e oferece busca e caminho de volta (PRD RF18, SEO.md)
export default function NotFound() {
  return (
    <Container>
      <EmptyState
        headingLevel="h1"
        icon={<MapTrifoldIcon aria-hidden weight="light" />}
        title="Página não encontrada"
        description="O endereço pode ter mudado ou esta página ainda não existe. Pesquise o que procura ou volte ao início."
        action={
          <>
            <form action="/pesquisa" role="search" className="w-full">
              <SearchInput
                name="q"
                label="Pesquisar no Vinum"
                placeholder="Vinho, uva, região ou produtor"
                maxLength={100}
              />
            </form>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Ir para o início
            </Link>
          </>
        }
      />
    </Container>
  );
}
