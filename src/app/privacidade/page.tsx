import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE } from "@/config/site";
import { FAVORITES_STORAGE_KEY } from "@/lib/favorites/favorites";

const DESCRIPTION =
  "O que o Vinum guarda (só os favoritos, no seu navegador), o que não coleta e como apagar seus dados.";

/** Data da última mudança no texto: atualize junto com qualquer mudança no que o site guarda. */
const UPDATED_AT = "2026-10-01";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: DESCRIPTION,
  alternates: { canonical: "/privacidade" },
};

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-accent";

/**
 * Política de privacidade (SECURITY.md). Cada frase descreve o que o código faz de verdade:
 * se o site passar a guardar ou enviar algo novo, este texto muda junto.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Política de privacidade"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Privacidade", href: "/privacidade" },
        ]}
      >
        <p className="text-small text-text-subtle">
          Atualizada em <time dateTime={UPDATED_AT}>1º de outubro de 2026</time>.
        </p>
      </PageHeader>
      <Container className="pb-16">
        <div className="grid max-w-3xl gap-14">
          <ContentSection title="Em resumo">
            <ul className="grid list-disc gap-2 pl-5">
              <li>Você pesquisa e navega sem conta e sem cadastro.</li>
              <li>O Vinum não usa cookies, publicidade nem ferramentas de análise de visitas.</li>
              <li>
                Só os mapas das páginas de regiões e países vêm de outro serviço (OpenStreetMap).
              </li>
              <li>
                Os favoritos ficam só no seu navegador: não são enviados ao Vinum nem a ninguém.
              </li>
            </ul>
          </ContentSection>

          <ContentSection title="O que fica guardado no seu navegador">
            <p>
              Quando você salva um vinho, uma uva, uma região ou um produtor nos favoritos, a lista
              fica no armazenamento local do seu navegador (localStorage), com o nome{" "}
              <code className="rounded-sm bg-sunken px-1.5 py-0.5 text-small">
                {FAVORITES_STORAGE_KEY}
              </code>
              . Ela guarda só o tipo e o identificador de cada item e a data em que foi salvo.
            </p>
            <p>
              Para apagar: remova os itens na página{" "}
              <Link href="/favoritos" className={linkClass}>
                Favoritos
              </Link>{" "}
              ou limpe os dados deste site nas configurações do navegador. Em janela anônima, a
              lista some quando a janela é fechada.
            </p>
          </ContentSection>

          <ContentSection title="Pesquisas">
            <p>
              O que você digita na busca vai no endereço da página (por exemplo,{" "}
              <code className="rounded-sm bg-sunken px-1.5 py-0.5 text-small">
                /pesquisa?q=malbec
              </code>
              ) para mostrar os resultados. O Vinum não guarda um histórico das suas pesquisas.
            </p>
          </ContentSection>

          <ContentSection title="Hospedagem">
            <p>
              Como em qualquer site, o serviço de hospedagem pode registrar dados técnicos de cada
              acesso, como o endereço IP e a página pedida, para manter o site funcionando e seguro.
              Fotos e fontes de letra são servidas pelo próprio Vinum.
            </p>
          </ContentSection>

          <ContentSection title="Mapas">
            <p>
              Nas páginas de regiões e países, o mapa é montado com imagens do OpenStreetMap. Quando
              o mapa aparece na tela, seu navegador baixa essas imagens dos servidores da Fundação
              OpenStreetMap, que recebem dados técnicos do pedido, como o endereço IP e a página de
              origem. Nas outras páginas, abrir o Vinum não faz seu navegador contatar outros sites.
            </p>
          </ContentSection>

          <ContentSection title="Links para outros sites">
            <p>
              As fontes citadas levam a sites de produtores e instituições, que têm as próprias
              políticas de privacidade. Ao sair do Vinum, vale a política do site visitado.
            </p>
          </ContentSection>

          <ContentSection title="Sugestões de correção">
            <p>
              A página{" "}
              <Link href="/sugerir-correcao" className={linkClass}>
                Sugerir uma correção
              </Link>{" "}
              não envia nada ao Vinum: ela prepara uma mensagem pública no GitHub, que você revisa e
              envia por lá, com a sua conta do GitHub. O que for publicado fica visível para todos.
            </p>
          </ContentSection>

          <ContentSection title="Seus direitos e contato">
            <p>
              No Brasil, a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) garante o acesso, a
              correção e a eliminação dos seus dados pessoais. Como o Vinum não guarda dados
              pessoais em servidor, os seus ficam sob o seu controle, no seu navegador. Dúvidas
              sobre esta política podem ser enviadas pelas{" "}
              <a href={`${SITE.repositoryUrl}/issues`} className={linkClass}>
                issues do repositório do projeto
              </a>
              .
            </p>
          </ContentSection>
        </div>
      </Container>
    </>
  );
}
