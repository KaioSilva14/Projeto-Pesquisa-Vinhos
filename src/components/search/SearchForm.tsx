import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { MAX_QUERY_LENGTH } from "@/lib/search/search";

type SearchFormProps = {
  /** Texto já pesquisado, para o visitante ajustar a busca. */
  query: string;
};

/** Formulário GET comum: funciona sem JavaScript e deixa a busca na URL. */
export function SearchForm({ query }: SearchFormProps) {
  return (
    <form action="/pesquisa" role="search" className="flex max-w-2xl gap-2">
      <SearchInput
        // Recria o campo quando a busca muda, para mostrar o texto novo
        key={query}
        name="q"
        label="Pesquisar vinhos, uvas, regiões, países e produtores"
        placeholder="Vinho, uva, região ou produtor"
        defaultValue={query}
        maxLength={MAX_QUERY_LENGTH}
        className="flex-1"
      />
      <Button type="submit" size="lg">
        Pesquisar
      </Button>
    </form>
  );
}
