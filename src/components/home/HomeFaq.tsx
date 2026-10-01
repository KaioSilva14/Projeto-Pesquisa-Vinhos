import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { CaretDownIcon } from "@/components/ui/icons";
import type { FaqItem } from "@/config/faq";

type HomeFaqProps = { items: readonly FaqItem[] };

/**
 * Perguntas frequentes com <details>: abre e fecha com teclado e leitor de tela, e funciona
 * sem JavaScript.
 */
export function HomeFaq({ items }: HomeFaqProps) {
  return (
    <Section title="Perguntas frequentes" rhythm="editorial">
      <div className="grid max-w-3xl divide-y divide-border border-y border-border">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-h4 [&::-webkit-details-marker]:hidden">
              {item.question}
              <CaretDownIcon
                aria-hidden
                className="size-5 shrink-0 text-text-muted transition-transform duration-(--duration-fast) group-open:rotate-180"
              />
            </summary>
            <div className="grid justify-items-start gap-3 pb-6 text-text-muted">
              <p className="max-w-prose">{item.answer}</p>
              {item.link && (
                <Link
                  href={item.link.href}
                  className="inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
                >
                  {item.link.label}
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
