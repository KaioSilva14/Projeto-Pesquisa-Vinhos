import { cva, type VariantProps } from "class-variance-authority";
import { useId, type ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { Container } from "./Container";

// Ritmo vertical entre seções (DESIGN.md §4.1): catálogo é mais denso, editorial mais arejado
const sectionVariants = cva("", {
  variants: {
    rhythm: {
      catalog: "py-12 md:py-16",
      editorial: "py-16 md:py-24 lg:py-32",
    },
  },
  defaultVariants: { rhythm: "catalog" },
});

type SectionProps = Omit<ComponentProps<"section">, "title"> &
  VariantProps<typeof sectionVariants> & {
    /** Título da seção (<h2>), que também dá nome à região para leitores de tela. */
    title: string;
    description?: string;
  };

export function Section({
  title,
  description,
  rhythm,
  className,
  children,
  ...props
}: SectionProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={cn(sectionVariants({ rhythm }), className)}
      {...props}
    >
      <Container>
        <header className="mb-6 grid gap-2 md:mb-8">
          <h2 id={titleId} className="font-serif text-h2 text-balance">
            {title}
          </h2>
          {description && <p className="max-w-prose text-body text-text-muted">{description}</p>}
        </header>
        {children}
      </Container>
    </section>
  );
}
