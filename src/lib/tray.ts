import { TRAY_BASE_URL, TRAY_LOJA_ID, trayConfigurado } from "./config";

export type ItemTransferencia = { nome: string; url: string };

/**
 * Link de adição ao carrinho da Tray (testado em lojas Tray reais):
 * produtos com variação precisam do `variacao`; sem ele a Tray redireciona
 * para a página do produto para o cliente escolher o tamanho.
 */
export function urlAdicionarAoCarrinho(produtoId: number, varianteId?: number): string {
  const url = `${TRAY_BASE_URL}/loja/cartService.php?loja=${TRAY_LOJA_ID}&acao=incluir&IdProd=${produtoId}`;
  return varianteId === undefined ? url : `${url}&variacao=${varianteId}`;
}

/** Abre o carrinho/checkout da Tray resolvendo a sessão atual do browser. */
export function urlCarrinhoTray(): string {
  return `${TRAY_BASE_URL}/loja/redirect_cart_service.php?loja=${TRAY_LOJA_ID}`;
}

/**
 * Carrega um link da Tray em um iframe oculto. A cadeia de redirects dispara
 * `load` mais de uma vez; aguardamos a navegação assentar antes de seguir
 * para o próximo item, garantindo que o cookie de sessão da Tray seja
 * aplicado sem corrida entre requisições.
 */
function carregarNoIframe(url: string): Promise<void> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:fixed;bottom:0;right:0;width:0;height:0;border:0;visibility:hidden";

    let temporizador: ReturnType<typeof setTimeout> | undefined;
    let resolvido = false;

    const concluir = () => {
      if (resolvido) return;
      resolvido = true;
      if (temporizador) clearTimeout(temporizador);
      if (limite) clearTimeout(limite);
      iframe.removeEventListener("load", aoCarregar);
      setTimeout(() => iframe.remove(), 1000);
      resolve();
    };

    const aoCarregar = () => {
      if (temporizador) clearTimeout(temporizador);
      temporizador = setTimeout(concluir, 1500);
    };

    iframe.addEventListener("load", aoCarregar);
    const limite = setTimeout(concluir, 20000);
    iframe.src = url;
    document.body.appendChild(iframe);
  });
}

/**
 * Transfere os itens do carrinho local para o carrinho da Tray, um por vez,
 * na mesma sessão do browser. Ao final, chame `irParaCheckoutTray()`.
 */
export async function transferirParaTray(
  itens: ItemTransferencia[],
  aoAvancar?: (atual: number, total: number, nome: string) => void,
): Promise<void> {
  if (!trayConfigurado) {
    throw new Error(
      "Configuração da Tray ausente: defina VITE_TRAY_BASE_URL e VITE_TRAY_LOJA_ID no .env",
    );
  }
  for (let i = 0; i < itens.length; i++) {
    const item = itens[i];
    if (!item) continue;
    aoAvancar?.(i + 1, itens.length, item.nome);
    await carregarNoIframe(item.url);
  }
}

export function irParaCheckoutTray(): void {
  window.location.assign(urlCarrinhoTray());
}
