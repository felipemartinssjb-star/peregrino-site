# PLAN — Vitrine Peregrino: catálogo + carrinho local + checkout Tray + admin

## Contexto

**Projeto** (raiz real: `peregrino-site-master\peregrino-site-master\`): TanStack Start + React 19 + Tailwind 4 + shadcn/ui (Lovable), SSR/Nitro → Cloudflare. Hoje é 100% estático: 1 produto hardcoded (`src/routes/produto.tsx`), sem carrinho, sem admin, sem backend (só SSR de erro + CSRF middleware), 79 fotos soltas na raiz e 3 planilhas de importação Tray (`Camisas_Importacao_*.xlsx`).

**Decisões do usuário:**
1. Carrinho **local na vitrine**; ao final, transferir itens pro carrinho da Tray e redirecionar pro checkout Tray.
2. Persistência em **JSON estático no projeto** (sem banco).
3. Admin protegido por **senha única** (env).

## O que a pesquisa na Tray mostrou (testado em lojas Tray reais hoje)

| Ação | Mecanismo | Status |
|---|---|---|
| Adicionar produto | `GET {TRAY_URL}/loja/cartService.php?loja={LOJA_ID}&acao=incluir&IdProd={ID}` | ✅ 302 → `checkout/cart?session_id=…&store_id=…` |
| Adicionar com variação (tamanho) | mesma URL + `&variacao={VARIANT_ID}` | ✅ testado (`variacao` aceito; sem ele → redirect pra produto com `erro_escolher_variacao=1`) |
| Abrir carrinho | `GET {TRAY_URL}/loja/redirect_cart_service.php?loja={LOJA_ID}` | ✅ resolve sessão via cookie → checkout Tray |
| Sessão/acúmulo | cookie `PHPSESSID` (30 dias); dois adds na mesma sessão → mesmo `session_id` | ✅ confirmado |
| Página do produto na Tray | `GET {TRAY_URL}/{slug}` | ✅ |
| Ler carrinho (diagnóstico) | `GET {TRAY_URL}/web_api/cart/{session_id}` | ✅ retorna JSON dos itens |

Pontos-chave:
- São **navegações/link** (não XHR) → **não há bloqueio de CORS**; funciona de qualquer site.
- Transferência de N itens = sequência de GETs na **mesma sessão do browser** (iframes ocultos em fila, 1 por vez, para o cookie não correr) → depois navega pra `redirect_cart_service.php`.
- Quantidade: default 1 (cliente ajusta no carrinho Tray). Nome do campo de quantidade não confirmado — opcional testar `&quantidade=`.
- **API oficial Tray** (`POST /carts` OAuth → `session_id` → mesma URL de checkout) fica como evolução futura se a transferência por link falhar na loja do usuário.

## Arquitetura

### 1. Dados — `src/data/produtos.json` (+ schema Zod)

```jsonc
{
  "id": "camiseta-oliva",            // slug local
  "nome": "Camiseta Oliva",
  "descricao": "…",
  "preco": 189,
  "categoria": "camisetas",
  "tamanhos": ["P","M","G","GG"],
  "imagens": ["/produtos/1-frente.jpg", "…"],   // máx 3
  "tray": {
    "url": "https://loja.com.br/camiseta-oliva", // "Comprar agora" / nome do produto
    "produtoId": 12345,                          // IdProd
    "variantes": { "P": 111, "M": 112, "G": 113, "GG": 114 }  // opcional, por tamanho
  }
}
```

- Leitura server-side (route loaders) — nunca no cliente pra não expor lógica interna (o JSON acaba público de qualquer forma; ids da Tray não são segredo).
- Seed: migrar a "Camiseta Oliva" atual; demais produtos entram pelo admin (planilhas Tray servem de referência pra colunas/id de variação).

### 2. Rotas (file-based, `src/routes/`)

| Rota | O que faz |
|---|---|
| `/` | Home existente; `Collections` passa a ler produtos do JSON (loader) |
| `/catalogo` | Grid completo do catálogo (novo) |
| `/produto/$slug` | Substitui o hardcoded; loader lê JSON; galeria até 3 imagens; seletor de tamanho; **nome/CTA "Comprar agora" → `tray.url`** (aba nova); **"Adicionar ao carrinho" → carrinho local** |
| `/carrinho` | Carrinho local: itens, quantidades, remover, **"Finalizar na Tray"** |
| `/admin` | Login (senha) + CRUD de produtos + upload até 3 imagens |

### 3. Carrinho local

- Contexto React + `localStorage` (`peregrino-cart`): `[{ produtoId, tamanho, qtd }]`.
- Itens "reservados" visualmente; nada de estoque real (estoque é da Tray).

### 4. Transferência pro carrinho Tray (`finalizarNaTray`)

1. Valida: todo item tem `tray.produtoId` e `tray.variantes[tamanho]` (se produto tiver variação cadastrada).
2. Fila sequencial em `<iframe>` oculto: 1 request por vez, espera `onload` + delay (≈1–2s) — primeira resposta seta o `PHPSESSID`, os próximos acumulam na mesma sessão.
3. Fim da fila → `window.location = {TRAY_URL}/loja/redirect_cart_service.php?loja={LOJA_ID}` → checkout Tray com todos os itens.
4. UX: overlay "Levando seu pedido pra Tray…".
5. Fallback por item (sem id de produto/variação): aviso + abre `tray.url` em aba nova.

### 5. Admin (`/admin`)

- Login: server function compara senha com `ADMIN_PASSWORD` (env) → cookie assinado (HMAC) → checado em toda server function de escrita.
- CRUD: react-hook-form + zod (já instalados). Upload de até 3 imagens → `public/produtos/` via server function.
- **Limite conhecido:** em produção (Cloudflare) o FS é read-only → escrita de JSON/imagem falha. Comportamento: detectar falha e entrar em modo **export** (monta o JSON e oferece download p/ subir no deploy); em `bun run dev` tudo grava direto. Fluxo real de cadastro = dev local + rebuild/deploy (coerente com "JSON estático no projeto").

### 6. Config

- `.env.example`: `TRAY_BASE_URL`, `TRAY_LOJA_ID`, `ADMIN_PASSWORD`.
- `TRAY_LOJA_ID` sai do backoffice/URLs da loja (hoje desconhecida — usuário preenche).

## Etapas de implementação

1. **Schema + dados**: Zod schema (`src/lib/produtos.ts`), `src/data/produtos.json` com seed (Camiseta Oliva), loaders.
2. **Catálogo**: rota `/catalogo`; refatorar `Collections` (home) e `/produto/$slug` pra dados do JSON (galeria 3 imgs, tamanhos, preço).
3. **Carrinho local**: contexto + persistência + rota `/carrinho` + botão/Header com contador.
4. **Transferência Tray**: `finalizarNaTray` (fila de iframes + overlay + fallbacks) + `TRAY_BASE_URL`/`TRAY_LOJA_ID`.
5. **Admin**: login com senha, CRUD completo, upload de imagens, modo export quando FS read-only.
6. **Links Tray**: "Comprar agora"/nome → `tray.url`; garantir `target="_blank"`/rel.
7. **Config/docs**: `.env.example` + seção no README (como pegar LOJA_ID, como testar).
8. **Verificação**: `bun run lint` + `bun run build` + teste manual E2E na loja real do usuário.

## Riscos / pendências

- **Teste único pendente:** acúmulo de 2+ itens de **produtos diferentes** (um com variação) na mesma sessão da loja do usuário — fazer no passo 8 antes de considerar pronto.
- **Ids de variação** precisam sair do backoffice Tray (ou das planilhas de importação) e serem cadastrados no admin; sem eles, item com tamanho → fallback pra página do produto na Tray.
- Admin em produção = somente leitura (export/download); cadastro acontece em dev.
- Domínio/loja ID da Tray ainda não fornecidos (env).
- Projeto conectado ao Lovable (AGENTS.md): manter branch em estado compilável.

## Critérios de aceite

- Catálogo navegável com produtos do JSON; página de produto com até 3 imagens e descrição.
- Nome/CTA "Comprar agora" leva direto ao produto na Tray.
- Adicionar ao carrinho funciona localmente; "Finalizar na Tray" entrega o checkout Tray com todos os itens (mesma sessão) — validado na loja real.
- `/admin` protegido por senha cadastra produto com 3 imagens e publica no JSON.
- Lint e build verdes.
