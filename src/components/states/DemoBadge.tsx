import { Badge } from "@/components/ui/Badge";
import { WarningCircleIcon } from "@/components/ui/icons";

/**
 * Selo obrigatório em toda entidade com isDemo: true (CLAUDE.md §2.1, RULES.md §1.1),
 * sempre visível no topo da entidade.
 */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <Badge variant="warning" className={className}>
      <WarningCircleIcon aria-hidden />
      Dados de demonstração
    </Badge>
  );
}
