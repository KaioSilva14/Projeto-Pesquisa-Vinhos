# SECURITY — Requisitos de segurança

> Versão 0.1 · Fase 0 · 2026-09-28

---

## 1. Superfície de ataque (v1)

A v1 é um site majoritariamente **estático**, sem login, sem banco e sem formulários que gravem dados. A superfície é pequena:

| Superfície | Descrição |
|---|---|
| Parâmetros de URL | `?q=`, filtros em `/vinhos`, `/pesquisa` |
| `localStorage` | Favoritos (dado do próprio usuário, pode estar corrompido/manipulado) |
| Rotas de API | `/api/search-index` (estática, somente leitura) |
| Dados de conteúdo | Textos e URLs em `src/data/` (entrada humana/IA) |
| Links externos | Fontes e créditos |
| Dependências | Cadeia de suprimentos npm |
| Futuro | Mapas (tiles externos), backend de favoritos, CMS |

## 2. Ameaças e controles

| Ameaça | Controle |
|---|---|
| **XSS refletido** via `?q=` ou filtros | React escapa texto por padrão; parâmetros validados com Zod (tipo, tamanho máx. 100 caracteres para `q`, listas permitidas para filtros); nunca inserir parâmetro em `dangerouslySetInnerHTML`, `href` ou `style` |
| **XSS armazenado** via dados de conteúdo | Dados são texto puro (sem HTML). Se no futuro houver rich text: Markdown renderizado com lista branca de elementos, sem HTML cru |
| **XSS via JSON-LD** | `JSON.stringify(...).replace(/</g, '\\u003c')` |
| **URLs maliciosas** (`javascript:`) em fontes/créditos | Schema Zod exige `https://`; links externos com `rel="noopener noreferrer"` e `target="_blank"` apenas quando indicado |
| **Dados manipulados no `localStorage`** | Favoritos validados com Zod ao hidratar; entradas inválidas descartadas; ids resolvidos contra o catálogo (id inexistente é ignorado) |
| **Clickjacking** | `frame-ancestors 'none'` (CSP) + `X-Frame-Options: DENY` |
| **Injeção** (SQL/NoSQL) | Não há banco na v1. Futuro: ORM com consultas parametrizadas (Drizzle/Prisma), nunca concatenar SQL |
| **Exposição de segredos** | Nenhum segredo na v1. Futuro: somente em variáveis de ambiente do servidor (sem `NEXT_PUBLIC_`), `.env.local` no `.gitignore`, variáveis configuradas na Vercel |
| **Vazamento do catálogo inteiro para o cliente** | `services/` com `import "server-only"` |
| **Abuso de API / DoS** | v1 sem API dinâmica própria (índice estático via CDN). Futuro: rate limiting (ex.: Vercel Firewall / middleware com limite por IP) |
| **Cadeia de suprimentos** | Poucas dependências justificadas; `package-lock.json` versionado; `npm ci` no CI; `npm audit --audit-level=high` no CI; Dependabot/Renovate |
| **Open redirect** | Sem redirecionamentos baseados em parâmetro de usuário |
| **Privacidade** | Sem cookies de terceiros; sem analytics invasivo; se houver analytics, escolher opção sem cookies e documentar |

## 3. Headers de segurança (`next.config.ts` → `headers()`)

```ts
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://tile.openstreetmap.org", // mapas (ADR-033)
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");
```

| Header | Valor |
|---|---|
| `Content-Security-Policy` | acima |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (só com domínio próprio em HTTPS) |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |

**Implementação (F1-11)**: `src/config/security-headers.ts`, aplicado em `next.config.ts` a todas as rotas e testado em `tests/unit/security-headers.test.ts` e `tests/e2e/security-headers.spec.ts`. `upgrade-insecure-requests` e `Strict-Transport-Security` só são enviados quando `VERCEL=1` (HTTPS garantido): no `localhost` em HTTP, o Safari/WebKit tentaria trocar os arquivos para HTTPS e o CSS quebraria.

**Sobre `'unsafe-inline'` em scripts**: o Next injeta scripts inline para hidratação. Uma CSP com *nonce* exige renderização dinâmica de todas as páginas (perderíamos o SSG). Decisão v1: CSP sem nonce + demais controles. Fase 10: avaliar `experimental.sri` (hashes) para remover `'unsafe-inline'` mantendo páginas estáticas. Registrado como risco R14 em `ARCHITECTURE.md`.

## 4. Validação

- Schemas Zod para: entidades (build/CI), `searchParams`, favoritos (`localStorage`), variáveis de ambiente (`src/config/env.ts` falha no build se inválidas).
- **Nunca confiar no cliente**: qualquer dado vindo da URL ou do navegador é validado no servidor antes do uso.

## 5. Política de variáveis de ambiente

1. `.env.example` versionado, **sem valores secretos**, com comentário por variável.
2. `.env.local` (valores reais) **nunca** versionado.
3. `NEXT_PUBLIC_*` = público (vai para o navegador). Nunca colocar chave privada com esse prefixo.
4. Variáveis validadas com Zod em `src/config/env.ts`.
5. Em produção, variáveis configuradas no painel/CLI da Vercel.
6. Se um segredo vazar: revogar imediatamente, gerar outro, limpar histórico se necessário, registrar em `MEMORY.md`.

## 6. Processo

- `npm audit` semanal/CI; atualizar dependências com PR dedicado e testes.
- Skill `security-review` antes de cada release.
- Revisão de segurança específica ao adicionar: mapas (fase 9), qualquer API própria, qualquer autenticação.
- Reportar vulnerabilidades: contato em `/sobre` (e `SECURITY.md` do repositório público, se houver).

## 7. Revisão de segurança da Fase 10 (2026-10-01, F10-04)

| Ponto | Resultado |
|---|---|
| Injeção de HTML (XSS) | O único `dangerouslySetInnerHTML` é o JSON-LD, que troca todo `<` por `<`. O nome no marcador do mapa passava ao Leaflet como HTML: **corrigido** (agora é texto puro). O React escapa todo o resto. |
| Entradas | Busca validada com Zod e limitada a 100 caracteres e poucos termos; filtros de `/vinhos` ignoram valores que não existem nos dados; formulário de correção aceita só caminhos internos do Vinum e links `https://`; favoritos lidos do `localStorage` são validados e limitados. |
| API | `/api/search-index` é um arquivo estático gerado no build (só `GET`, sem parâmetros). |
| Links externos | Fontes, créditos e o link do GitHub com `rel="noopener noreferrer"` quando abrem outra aba; `Referrer-Policy: strict-origin-when-cross-origin`. |
| Cabeçalhos | CSP, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` e HSTS (em HTTPS). Única origem externa: `tile.openstreetmap.org` em `img-src`, e só depois do clique em "Mostrar o mapa". |
| Dependências | `npm audit` sem vulnerabilidades; `@lhci/cli` fora do `package.json` por ter dependências com alertas (ADR-035). |
| `'unsafe-inline'` em `script-src` (risco R14) | **Mantido.** O SRI experimental do Next 16 foi testado: com o Turbopack, só 5 de 11 scripts externos ganham `integrity`, e os 4 scripts embutidos por página (dados da renderização) mudam a cada página, então a CSP fixa não consegue listá-los. Nonces exigiriam renderizar cada página a cada visita, perdendo o site estático. Compensações: nenhum ponto injeta HTML vindo de fora, nenhum script de terceiros, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`. Reavaliar quando o SRI do Next sair do modo experimental. |

