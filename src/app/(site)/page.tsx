import { Container } from "@/components/layout/Container";
import { SITE } from "@/config/site";

// Home provisória: a versão editorial é a tarefa F5-01
export default function HomePage() {
  return (
    <Container className="py-16 md:py-24">
      <h1 className="font-serif text-display">{SITE.name}</h1>
      <p className="mt-6 max-w-lead text-lead text-text-muted">{SITE.description}</p>
    </Container>
  );
}
