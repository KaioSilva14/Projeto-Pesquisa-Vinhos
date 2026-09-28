"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { CaretDownIcon } from "./icons";

/** Seções que abrem e fecham (grupos de filtro, perguntas frequentes). ANIMATIONS.md A11. */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-border", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    // O Radix envolve o botão num <h3>, mantendo a hierarquia de títulos
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex min-h-11 flex-1 items-center justify-between gap-4 py-3 text-left text-body font-medium hover:text-accent",
          className,
        )}
        {...props}
      >
        {children}
        <CaretDownIcon
          aria-hidden
          className="size-4 shrink-0 text-text-muted transition-transform duration-(--duration-base) ease-in-out group-data-[state=open]:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-4 text-body text-text-muted", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
