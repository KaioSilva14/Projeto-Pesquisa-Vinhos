# Vinum (nome provisório)

Plataforma digital de **pesquisa, descoberta e consulta de vinhos**, com a sensação de catálogo premium e enciclopédia moderna. **Não é loja**: não há preços, carrinho nem venda. Toda informação exibida tem fonte registrada.

> **Status**: Fase 1 (fundação) em andamento: Next.js, Tailwind com o design system, fontes, lint, testes unitários e E2E já configurados.
> Consumo responsável: bebida alcoólica é proibida para menores de 18 anos.

---

## Documentação

Toda a documentação está em [`docs/`](docs/):

| Documento | Para que serve |
|---|---|
| [PRD](docs/PRD.md) | O que vamos construir e por quê |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Stack, pastas, fluxo de dados, riscos |
| [DESIGN](docs/DESIGN.md) | Design system: cores, tipografia, componentes |
| [RULES](docs/RULES.md) | Regras de código e de conteúdo |
| [TASKS](docs/TASKS.md) | Backlog e status das tarefas |
| [MEMORY](docs/MEMORY.md) | Estado atual do projeto |
| [DECISIONS](docs/DECISIONS.md) | Decisões técnicas e de produto |
| [DATA_MODEL](docs/DATA_MODEL.md) · [DATA_SOURCES](docs/DATA_SOURCES.md) · [IMAGES](docs/IMAGES.md) | Dados, fontes e imagens |
| [SEO](docs/SEO.md) · [SECURITY](docs/SECURITY.md) · [ACCESSIBILITY](docs/ACCESSIBILITY.md) · [PERFORMANCE](docs/PERFORMANCE.md) · [ANIMATIONS](docs/ANIMATIONS.md) · [TESTING](docs/TESTING.md) | Requisitos de qualidade |
| [CHANGELOG](docs/CHANGELOG.md) | Histórico de mudanças |

O [`CLAUDE.md`](CLAUDE.md) (na raiz) é a especificação original do produto e o guia para o Claude Code.

---

## Pré-requisitos

| Ferramenta | Versão | Como verificar (PowerShell) |
|---|---|---|
| Node.js | 24 LTS | `node -v` |
| npm | 11+ (vem com o Node) | `npm -v` |
| Git | qualquer versão recente | `git --version` |
| VS Code | recente | — |

Extensões recomendadas do VS Code: **ESLint**, **Prettier**, **Tailwind CSS IntelliSense**, **EditorConfig**, **Playwright Test**.

---

## Como rodar

Todos os comandos abaixo são para o **PowerShell**, dentro da pasta do projeto (no VS Code: menu *Terminal → Novo Terminal*).

### 1. Instalar as dependências
```powershell
npm install
```
Baixa todas as bibliotecas listadas no `package.json` para a pasta `node_modules`. Só precisa rodar de novo quando o `package.json` mudar.

### 2. Configurar variáveis de ambiente
```powershell
Copy-Item .env.example .env.local
```
Cria o arquivo `.env.local` (que **não** vai para o Git) a partir do modelo. Na v1 não há segredos; os valores padrão funcionam.

### 3. Rodar em modo de desenvolvimento
```powershell
npm run dev
```
Abre o servidor local em http://localhost:3000. A página atualiza sozinha quando você salva um arquivo. Para parar: `Ctrl + C`.

### 4. Verificar a qualidade
```powershell
npm run lint           # procura problemas no código (ESLint)
npm run typecheck      # confere os tipos do TypeScript sem gerar arquivos
npm run format:check   # confere se o código está formatado (Prettier)
npm run format         # formata todo o código automaticamente
npm run test           # roda os testes unitários e de componentes (Vitest)
npm run test:e2e       # faz o build e roda os testes no navegador (Playwright)
```
A partir da Fase 2 haverá também `npm run validate:data`, que confere se todos os dados têm fontes e imagens licenciadas.
Na primeira vez que for rodar os testes E2E, baixe os navegadores do Playwright:
```powershell
npx playwright install
```

### 5. Gerar a versão de produção
```powershell
npm run build   # gera o site otimizado
npm run start   # serve essa versão em http://localhost:3000
```
Use `build` + `start` para medir performance (Lighthouse). O modo `dev` é mais lento de propósito.

---

## Problemas comuns no Windows

| Sintoma | Causa provável | Solução |
|---|---|---|
| `EPERM` / `EBUSY` ao instalar ou compilar | OneDrive sincronizando `node_modules` | Mover o projeto para `C:\dev\` (ver `docs/DECISIONS.md` ADR-016) |
| "execução de scripts foi desabilitada neste sistema" | Política de execução do PowerShell | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (uma vez) |
| Porta 3000 em uso | Outro servidor aberto | Fechar o outro terminal ou `npm run dev -- -p 3001` |

---

## Princípios do projeto

1. **Veracidade acima de tudo**: nenhuma informação inventada; sem fonte, o campo não aparece.
2. **Imagens reais e licenciadas**, ou o aviso honesto "Imagem indisponível".
3. **Sem e-commerce**.
4. **Mobile-first, acessível (WCAG 2.2 AA) e rápido** (Lighthouse ≥ 90).
