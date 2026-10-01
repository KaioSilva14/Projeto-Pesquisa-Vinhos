import type { NavItem } from "./nav";

// Perguntas frequentes da home. Falam só do próprio site (nenhuma informação sobre vinhos):
// se o funcionamento mudar, atualize aqui.

export type FaqItem = {
  question: string;
  /** Texto simples: também vai para os dados estruturados (FAQPage). */
  answer: string;
  /** Link interno para saber mais. */
  link?: NavItem;
};

export const HOME_FAQ: readonly FaqItem[] = [
  {
    question: "O Vinum vende vinhos?",
    answer:
      "Não. O Vinum é uma plataforma de pesquisa e consulta: não tem loja, preços, carrinho nem publicidade.",
    link: { label: "Sobre o Vinum", href: "/sobre" },
  },
  {
    question: "De onde vêm as informações?",
    answer:
      "De fontes oficiais, como fichas técnicas e sites dos produtores, regulamentos das regiões e o catálogo internacional de variedades de uva (VIVC). Cada informação tem um número que leva à fonte, com a data de consulta.",
    link: { label: "Como escolhemos as fontes", href: "/sobre" },
  },
  {
    question: "Por que alguns vinhos têm menos informações que outros?",
    answer:
      "Porque só publicamos o que a fonte confirma. Se a ficha técnica não informa um dado, ele não aparece: nada é estimado nem preenchido por aproximação.",
  },
  {
    question: "Preciso criar uma conta?",
    answer:
      "Não. Tudo pode ser pesquisado sem cadastro. Os favoritos ficam guardados só no seu navegador e não são enviados a ninguém.",
    link: { label: "Política de privacidade", href: "/privacidade" },
  },
  {
    question: "Encontrei um erro. Como aviso?",
    answer:
      "Pela página Sugerir uma correção: conte o que está errado e, se puder, indique a fonte que confirma. Toda correção é conferida na fonte antes de entrar.",
    link: { label: "Sugerir uma correção", href: "/sugerir-correcao" },
  },
];
