import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card, CardLink } from "@/components/ui/Card";
import { ActiveFilterChip, FilterChip } from "@/components/ui/Chip";
import { IconButton } from "@/components/ui/IconButton";
import { MagnifyingGlassIcon, WarningCircleIcon, XIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";

import { Section } from "./Section";

const variants = ["primary", "secondary", "ghost", "link"] as const;

// Vitrine dos componentes de src/components/ui (F1-12). Textos neutros: nada aqui é dado real.
export function ComponentsShowcase() {
  return (
    <>
      <Section title="Trilha de navegação">
        <p className="mb-4 text-small text-text-muted">
          No celular aparece só o nível anterior; a partir de 768 px, a trilha completa.
        </p>
        <Breadcrumbs
          items={[
            { label: "Início", href: "/" },
            { label: "Seção", href: "/dev/design-system#secao" },
            { label: "Página atual", href: "/dev/design-system" },
          ]}
        />
      </Section>

      <Section title="Botões">
        <div className="grid gap-6">
          {variants.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <span className="w-full text-caption text-text-subtle md:w-24">{variant}</span>
              <Button variant={variant} size="sm">
                Pequeno
              </Button>
              <Button variant={variant}>Pesquisar</Button>
              <Button variant={variant} size="lg">
                Grande
              </Button>
              <Button variant={variant} disabled>
                Desabilitado
              </Button>
              <Button variant={variant} loading>
                Carregando
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-full text-caption text-text-subtle md:w-24">ícone</span>
            <IconButton aria-label="Fechar">
              <XIcon aria-hidden />
            </IconButton>
            <IconButton aria-label="Pesquisar" variant="secondary">
              <MagnifyingGlassIcon aria-hidden />
            </IconButton>
            <IconButton aria-label="Selecionado" aria-pressed>
              <XIcon aria-hidden />
            </IconButton>
            <a href="#campos" className={buttonVariants({ variant: "secondary" })}>
              Link com visual de botão
            </a>
          </div>
        </div>
      </Section>

      <Section title="Campos">
        <div id="campos" className="grid max-w-md gap-6">
          <SearchInput
            label="Pesquisar"
            placeholder="Vinho, uva, região ou produtor"
            shortcutHint="/"
          />
          <Input label="Campo com dica" hint="Texto de ajuda abaixo do campo." />
          <Input label="Campo com erro" defaultValue="abc" error="Mensagem de erro do campo." />
          <Input label="Campo desabilitado" disabled defaultValue="Não editável" />
        </div>
      </Section>

      <Section title="Chips e badges">
        <div className="flex flex-wrap gap-2">
          <FilterChip selected={false} count={12}>
            Opção
          </FilterChip>
          <FilterChip selected count={4}>
            Selecionada
          </FilterChip>
          <ActiveFilterChip label="Filtro aplicado" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>Neutro</Badge>
          <Badge variant="warning">
            <WarningCircleIcon aria-hidden />
            Dados de demonstração
          </Badge>
        </div>
      </Section>

      <Section title="Card e skeleton">
        <div className="grid items-start gap-6 md:grid-cols-3">
          <Card aria-labelledby="card-exemplo">
            <h3 id="card-exemplo" className="font-serif text-h3">
              <CardLink href="#campos">Entidade Exemplo</CardLink>
            </h3>
            <p className="text-small text-text-muted">
              Card inteiro clicável. Passe o mouse ou use Tab.
            </p>
            <div className="flex gap-2">
              <Badge>Categoria</Badge>
            </div>
          </Card>
          <div
            role="status"
            aria-busy="true"
            className="grid gap-3 rounded-sm border border-border p-4"
          >
            <span className="sr-only">Carregando</span>
            <Skeleton className="aspect-[4/3] w-full rounded-media" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </Section>
    </>
  );
}
