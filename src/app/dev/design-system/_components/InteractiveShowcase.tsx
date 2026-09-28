import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { IconButton } from "@/components/ui/IconButton";
import { InfoIcon } from "@/components/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Select } from "@/components/ui/Select";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";

import { Section } from "./Section";

const sortOptions = [
  { value: "relevancia", label: "Relevância" },
  { value: "nome", label: "Nome (A a Z)" },
];

// Vitrine dos componentes sobre Radix (F1-13). Textos neutros: nada aqui é dado real.
export function InteractiveShowcase() {
  return (
    <Section title="Componentes interativos">
      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Abrir diálogo</Button>
            </DialogTrigger>
            <DialogContent
              title="Título do diálogo"
              description="Esc fecha; o foco volta ao botão."
            >
              <p className="text-body text-text-muted">Conteúdo do diálogo.</p>
              <DialogClose asChild>
                <Button className="justify-self-end">Entendi</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Abrir painel inferior</Button>
            </SheetTrigger>
            <SheetContent
              title="Filtros"
              footer={
                <>
                  <Button variant="secondary" className="flex-1">
                    Limpar
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1">Ver resultados</Button>
                  </SheetClose>
                </>
              }
            >
              <Checkbox label="Opção de filtro" count={12} />
              <Checkbox label="Outra opção" count={4} defaultChecked />
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">Abrir popover</Button>
            </PopoverTrigger>
            <PopoverContent>Conteúdo complementar, ancorado no botão.</PopoverContent>
          </Popover>

          <Tooltip content="Dica curta, também no foco">
            <IconButton aria-label="Mais informações">
              <InfoIcon aria-hidden />
            </IconButton>
          </Tooltip>
        </div>

        <div className="grid gap-4">
          <Select label="Ordenar por" options={sortOptions} defaultValue="relevancia" />
          <div>
            <Checkbox label="Caixa de seleção" count={8} />
            <Checkbox label="Marcada" defaultChecked />
            <Checkbox label="Desabilitada" disabled />
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="um">
            <AccordionTrigger>Primeira seção</AccordionTrigger>
            <AccordionContent>Conteúdo que abre e fecha pela altura.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="dois">
            <AccordionTrigger>Segunda seção</AccordionTrigger>
            <AccordionContent>Outro conteúdo.</AccordionContent>
          </AccordionItem>
        </Accordion>

        <Tabs defaultValue="um">
          <TabsList aria-label="Exemplo de abas">
            <TabsTrigger value="um">Resumo</TabsTrigger>
            <TabsTrigger value="dois">Ficha técnica</TabsTrigger>
            <TabsTrigger value="tres">Fontes</TabsTrigger>
          </TabsList>
          <TabsContent value="um">Conteúdo da primeira aba.</TabsContent>
          <TabsContent value="dois">Conteúdo da segunda aba.</TabsContent>
          <TabsContent value="tres">Conteúdo da terceira aba.</TabsContent>
        </Tabs>
      </div>
    </Section>
  );
}
