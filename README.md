# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Loja, carrinho e Tray

O catálogo vive em `src/data/produtos.json` (schema em `src/lib/produtos.ts`). Rotas:

| Rota             | Descrição                                         |
| ---------------- | ------------------------------------------------- |
| `/catalogo`      | grade com todos os produtos                       |
| `/produto/$slug` | detalhe do produto (até 3 imagens)                |
| `/carrinho`      | carrinho local + **Finalizar na Tray**            |
| `/admin`         | cadastro de produtos (senha via `ADMIN_PASSWORD`) |

### Configuração (`.env`)

Copie `.env.example` para `.env`:

- `ADMIN_PASSWORD` — senha do `/admin` (só no servidor).
- `VITE_TRAY_BASE_URL` — domínio da loja Tray (ex.: `https://sualoja.com.br`).
- `VITE_TRAY_LOJA_ID` — id da loja (aparece em `cartService.php?loja=XXXXX`).

### Como funciona o checkout na Tray

1. Cliente monta o carrinho **na vitrine** (localStorage).
2. Ao clicar em **Finalizar na Tray**, os itens são adicionados um a um ao
   carrinho da Tray via `GET /loja/cartService.php?loja=…&acao=incluir&IdProd=…`
   (com `&variacao=` quando o produto tem tamanho), na mesma sessão do browser.
3. O cliente é redirecionado para `/loja/redirect_cart_service.php?loja=…`,
   que abre o checkout da Tray para concluir frete e pagamento.

Para o passo 2 funcionar, cadastre no `/admin` o **ID do produto na Tray** e o
**ID de cada variação (tamanho)** — ambos aparecem no backoffice da Tray.

### Admin

- `npm run dev` → acesse `/admin`: as alterações gravam direto em
  `src/data/produtos.json` e as imagens em `public/produtos/`.
- Em produção (filesystem somente leitura), o admin entra em **modo export**:
  baixe o `produtos.json` atualizado e suba no deploy.
