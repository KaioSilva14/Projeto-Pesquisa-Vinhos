import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { ImageCredit } from "@/components/media/ImageCredit";
import { SITE } from "@/config/site";
import { catalogService } from "@/services";

const DESCRIPTION =
  "O que é o Vinum, de onde vêm as informações, os créditos de todas as imagens e o aviso de consumo responsável.";

export const metadata: Metadata = {
  title: "Sobre o Vinum",
  description: DESCRIPTION,
  alternates: { canonical: "/sobre" },
};

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-accent";

/** Sobre (F5-02): o projeto, a política de fontes, todos os créditos de imagens e o aviso 18+. */
export default async function AboutPage() {
  const credits = await catalogService.getImageCredits();
  const issuesUrl = `${SITE.repositoryUrl}/issues`;

  return (
    <>
      <PageHeader
        title="Sobre o Vinum"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Sobre", href: "/sobre" },
        ]}
      />
      <Container className="pb-16">
        <div className="grid max-w-3xl gap-14">
          <ContentSection title="O que é">
            <p>
              O Vinum é um projeto de estudo: uma plataforma de pesquisa, descoberta e consulta de
              vinhos. Não vende nada, não tem publicidade e não pede cadastro para navegar.
            </p>
          </ContentSection>

          <ContentSection title="De onde vêm as informações">
            <p>
              Cada informação sobre um vinho, uva, região ou produtor mostra um número que leva à
              fonte, listada no fim da página com a data de consulta. Usamos, nesta ordem de
              preferência, fichas técnicas e páginas oficiais dos produtores, regulamentos e órgãos
              oficiais das regiões e o catálogo internacional de variedades de uva (VIVC).
            </p>
            <p>
              Quando a fonte não informa um dado, ele simplesmente não aparece: nada é estimado nem
              preenchido por aproximação. Os textos são escritos com palavras próprias, a partir das
              fontes citadas.
            </p>
          </ContentSection>

          <ContentSection title="Créditos das imagens" id="creditos">
            <p>
              As fotos pertencem aos seus autores e instituições. As do Wikimedia Commons e do
              Instituto Nacional de Vitivinicultura (Argentina) têm licença livre; as do catálogo
              VIVC têm permissão de reprodução com citação. As fotos tiradas dos sites oficiais dos
              produtores e dos importadores oficiais não têm licença livre: são usadas com crédito,
              só enquanto este for um projeto de estudo sem fins comerciais.
            </p>
            {credits.map((group) => (
              <div key={group.title} className="grid gap-3">
                <h3 className="font-semibold">{group.title}</h3>
                <ul className="grid gap-3">
                  {group.items.map((item) => (
                    <li key={item.image.id} className="grid gap-0.5">
                      <Link href={item.href} className={`${linkClass} justify-self-start`}>
                        {item.subjectName}
                      </Link>
                      <ImageCredit image={item.image} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ContentSection>

          <ContentSection title="Consumo responsável">
            <p>
              Bebidas alcoólicas são proibidas para menores de 18 anos. O Vinum é informativo e não
              incentiva o consumo. Se beber, faça com moderação e não dirija.
            </p>
          </ContentSection>

          <ContentSection title="Correções e remoção de imagens">
            <p>
              Encontrou uma informação errada ou é detentor dos direitos de alguma imagem e quer a
              remoção?{" "}
              <a href={issuesUrl} rel="noopener noreferrer" className={linkClass}>
                Abra uma issue no repositório do projeto
              </a>
              . A imagem é retirada a pedido.
            </p>
          </ContentSection>
        </div>
      </Container>
    </>
  );
}
