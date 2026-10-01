# ACCESSIBILITY — Requisitos de acessibilidade

> Versão 0.1 · Fase 0 · 2026-09-28
> Meta: **WCAG 2.2 nível AA** em todas as páginas. Ferramentas: axe (Playwright), `eslint-plugin-jsx-a11y` (incluído no `eslint-config-next`), Lighthouse, testes manuais com teclado e leitor de tela (NVDA no Windows).

---

## 1. Fundamentos

- `<html lang="pt-BR">`; HTML semântico (`header`, `nav`, `main`, `footer`, `article`, `section` com título, `dl` para fichas, `ol` para breadcrumbs).
- Um `<h1>` por página; títulos sem pular níveis.
- `SkipLink` "Pular para o conteúdo" como primeiro elemento focável.
- Landmarks nomeados quando repetidos (`nav aria-label="Principal"`, `nav aria-label="Trilha de navegação"`, `nav aria-label="Navegação inferior"`).
- Título da página (`<title>`) único e descritivo; mudança de rota anunciada (o Next já anuncia o título ao navegar).

## 2. Checklist WCAG 2.2 AA (itens mais relevantes para o Vinum)

### Perceptível
- [ ] **1.1.1** Imagens com `alt` descritivo; decorativas com `alt=""`; `ImageUnavailable` com texto real.
- [ ] **1.3.1** Estrutura por semântica (tabelas/`dl`/listas), não por aparência.
- [ ] **1.3.2** Ordem de leitura = ordem visual (atenção a layouts assimétricos com `order`).
- [ ] **1.4.1** Cor nunca é a única informação (estados com ícone/texto; perfil sensorial com valor textual).
- [ ] **1.4.3** Contraste de texto ≥ 4,5:1 (≥ 3:1 para texto ≥ 24 px ou ≥ 18,66 px negrito). Tokens validados em `DESIGN.md` §2.
- [ ] **1.4.4 / 1.4.10** Zoom 200% e reflow em 320 px sem rolagem horizontal.
- [ ] **1.4.11** Contraste de componentes e foco ≥ 3:1 (`--color-border-strong`, anel de foco).
- [ ] **1.4.12** Espaçamento de texto ajustável sem quebrar.
- [ ] **1.4.13** Tooltips/popovers: dispensáveis (`Esc`), hoveráveis, persistentes.

### Operável
- [ ] **2.1.1 / 2.1.2** Tudo operável por teclado; sem armadilhas (exceto foco preso intencional em modais, com `Esc`).
- [ ] **2.1.4** Atalho de uma tecla (`/`) só funciona quando o foco não está em campo de texto; pode ser ignorado pelo usuário (não dispara ações destrutivas).
- [ ] **2.2.2** Nada se move por mais de 5 s sem controle (sem carrosséis automáticos).
- [ ] **2.3.1** Nada pisca.
- [ ] **2.4.3** Ordem de foco lógica.
- [ ] **2.4.4** Links com texto que faz sentido ("Ver ficha do [vinho]", não "clique aqui").
- [ ] **2.4.7** Foco sempre visível (anel 2 px + offset).
- [ ] **2.4.11 (novo 2.2)** Foco não fica escondido atrás do header fixo/bottom nav (`scroll-padding-top`/`bottom`).
- [ ] **2.5.3** Nome acessível contém o texto visível.
- [ ] **2.5.7 (novo 2.2)** Arrastar nunca é a única forma (bottom sheet tem botão fechar; mapa tem botões de zoom).
- [ ] **2.5.8 (novo 2.2)** Alvos ≥ 24×24 px (nosso padrão é 44×44 px).

### Compreensível
- [ ] **3.1.1** Idioma da página; termos em outro idioma (nomes de regiões) com `lang` quando longos.
- [ ] **3.2.1 / 3.2.2** Foco e mudança de filtro não causam navegação inesperada (aplicar filtros no mobile via botão "Ver N vinhos"; no desktop, atualização imediata com anúncio da contagem).
- [ ] **3.2.6 (novo 2.2)** Ajuda/contato no mesmo lugar em todas as páginas (rodapé).
- [ ] **3.3.1 / 3.3.2** Campos com label e mensagens de erro claras.

### Robusto
- [ ] **4.1.2** Componentes customizados com role/estado corretos (Radix cobre a maioria).
- [ ] **4.1.3** Mensagens de status anunciadas sem mover o foco (`role="status"`/`aria-live="polite"`): contagem de resultados, "Adicionado aos favoritos", "Filtros limpos".

## 3. Padrões específicos

### 3.1 Busca (combobox — padrão WAI-ARIA APG)
- `input role="combobox"` com `aria-expanded`, `aria-controls` → `listbox`, `aria-activedescendant` para a opção ativa, `aria-autocomplete="list"`.
- Grupos (Vinhos, Uvas, Regiões…) com `role="group"` + `aria-label`.
- Teclas: `↓/↑` navegam, `Enter` abre, `Esc` fecha/limpa, `Tab` sai.
- Região live anunciando "N sugestões disponíveis" (com debounce).
- Label visível ou `aria-label` "Pesquisar vinhos, uvas, regiões e produtores".

### 3.2 Filtros
- Grupos com `fieldset` + `legend`; opções como checkboxes (múltipla escolha) ou radio (única).
- Contagem por opção incluída no nome acessível ("Itália, 12 vinhos").
- Chips ativos: botão "Remover filtro: Itália".
- Após remover o último chip, foco vai para o título dos resultados ou para "Filtros".
- Bottom sheet: `Dialog` com título "Filtros", foco inicial no primeiro controle, retorno do foco ao botão que abriu.

### 3.3 Perfil sensorial (gráfico)
- Visual com segmentos **+** texto visível do nível ("Médio +").
- Estrutura `dl`: `dt` "Corpo" / `dd` "Médio (3 de 5), segundo a ficha técnica do produtor".
- Segmentos decorativos com `aria-hidden="true"`.

### 3.4 Imagens e créditos
- Crédito é texto real (não imagem); links de licença com nome acessível ("Licença CC BY-SA 4.0").

### 3.5 Favoritos
- `button aria-pressed` com rótulo que muda ("Salvar [nome] nos favoritos" / "Remover [nome] dos favoritos").
- Confirmação via `role="status"`.

### 3.6 Mapas (fase 9)
- Mapa não é a única forma de acessar a informação: texto com o lugar marcado e link "Ver no OpenStreetMap"; nos países, a grade de regiões.
- Controles de zoom por botão ("Aproximar"/"Afastar"); o mapa recebe o foco depois de "Mostrar o mapa" e tem `aria-label` descritivo; arrastar nunca é necessário (ADR-033).

### 3.7 3D (fase 8): sem 3D no site (ADR-032)
- Canvas decorativo `aria-hidden="true"`; qualquer informação apresentada também existe em texto.

## 4. Movimento reduzido

- `@media (prefers-reduced-motion: reduce)`: transições de posição/escala desligadas; fades curtos (≤ 150 ms) permitidos; nada de parallax, rolagem suave forçada, autoplay ou 3D animado.
- Motion: `useReducedMotion()` / `MotionConfig reducedMotion="user"`.
- A experiência sem animação é **completa** (nenhum conteúdo só aparece via animação).

## 5. Testes

| Tipo | Ferramenta | Quando |
|---|---|---|
| Lint | `eslint-plugin-jsx-a11y` | Todo commit |
| Automatizado | `@axe-core/playwright` em todas as rotas principais, tema claro e escuro | CI (fase 3+) |
| Lighthouse | Acessibilidade ≥ 90 (meta interna: 100) | Fase 10 / CI |
| Manual — teclado | Percorrer busca, filtros, favoritos, modais só com teclado | Toda tarefa de UI |
| Manual — leitor de tela | NVDA + Chrome/Firefox (Windows); VoiceOver (iOS) se disponível | Fim de cada fase |
| Manual — zoom | 200% e 400% (reflow 320 px) | Fim de cada fase |
| Manual — movimento reduzido | Ativar no Windows (Configurações → Acessibilidade → Efeitos visuais → Efeitos de animação desligado) | Fase 7 |

### 5.1 Alertas conhecidos do axe (analisados)

| Alerta | Quando aparece | Análise | Decisão |
|---|---|---|---|
| `aria-hidden-focus` (sério) no `SkipLink` e no cabeçalho | Só com a lista do `Select` (Radix) **aberta** | O Radix marca o resto da página com `aria-hidden` enquanto a lista está aberta. O axe vê elementos focáveis dentro dessa área, mas o foco fica **preso na lista**: testado em 2026-09-28 no Chromium e no Firefox, Tab não sai da lista. Nenhuma barreira real | Aceito (falso positivo). Em testes E2E que abrem o `Select` e rodam axe nesse estado, desativar só essa regra, com comentário apontando para esta seção |
