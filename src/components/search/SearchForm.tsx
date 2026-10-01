import { Button } from "@/components/ui/Button";

import { SearchCombobox } from "./SearchCombobox";

type SearchFormProps = {
  /** Texto já pesquisado, para o visitante ajustar a busca. */
  query: string;
  /** Foca o campo quando a busca está vazia (página de pesquisa). Na home, não. */
  focusWhenEmpty?: boolean;
};

/** Formulário GET comum: funciona sem JavaScript e deixa a busca na URL. */
export function SearchForm({ query, focusWhenEmpty = true }: SearchFormProps) {
  return (
    <form action="/pesquisa" role="search" className="flex max-w-2xl gap-2">
      <SearchCombobox
        // Recria o campo quando a busca muda, para mostrar o texto novo
        key={query}
        label="Pesquisar vinhos, uvas, regiões, países e produtores"
        placeholder="Vinho, uva, região ou produtor"
        defaultValue={query}
        // Quem chega sem busca (ex.: "Pesquisar" da barra inferior) já pode digitar
        focusOnMount={focusWhenEmpty && !query}
        className="flex-1"
        // Sugestões com a largura do formulário inteiro (campo + botão)
        popupClassName="left-0 w-[min(42rem,calc(100vw-2rem))]"
      />
      <Button type="submit" size="lg">
        Pesquisar
      </Button>
    </form>
  );
}
