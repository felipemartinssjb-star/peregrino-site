import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ItemCarrinho = { produtoId: string; tamanho: string; qtd: number };

type ContextoCarrinho = {
  itens: ItemCarrinho[];
  carregado: boolean;
  contagem: number;
  adicionar: (produtoId: string, tamanho: string) => void;
  definirQuantidade: (produtoId: string, tamanho: string, qtd: number) => void;
  remover: (produtoId: string, tamanho: string) => void;
  manterApenas: (itens: ItemCarrinho[]) => void;
  limpar: () => void;
};

const CHAVE = "peregrino-cart";
const CarrinhoContext = createContext<ContextoCarrinho | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) {
        const dados: unknown = JSON.parse(bruto);
        if (Array.isArray(dados)) setItens(dados as ItemCarrinho[]);
      }
    } catch {
      // storage corrompido — começa vazio
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      // quota excedida — ignora
    }
  }, [itens, carregado]);

  const adicionar = useCallback((produtoId: string, tamanho: string) => {
    setItens((atual) => {
      const indice = atual.findIndex(
        (item) => item.produtoId === produtoId && item.tamanho === tamanho,
      );
      if (indice === -1) return [...atual, { produtoId, tamanho, qtd: 1 }];
      const existente = atual[indice];
      if (!existente) return atual;
      const copia = [...atual];
      copia[indice] = { ...existente, qtd: existente.qtd + 1 };
      return copia;
    });
  }, []);

  const definirQuantidade = useCallback((produtoId: string, tamanho: string, qtd: number) => {
    const qtdFinal = Math.min(99, Math.max(1, Math.round(qtd)));
    setItens((atual) =>
      atual.map((item) =>
        item.produtoId === produtoId && item.tamanho === tamanho
          ? { ...item, qtd: qtdFinal }
          : item,
      ),
    );
  }, []);

  const remover = useCallback((produtoId: string, tamanho: string) => {
    setItens((atual) =>
      atual.filter((item) => !(item.produtoId === produtoId && item.tamanho === tamanho)),
    );
  }, []);

  const manterApenas = useCallback((novos: ItemCarrinho[]) => {
    setItens(novos);
  }, []);

  const limpar = useCallback(() => setItens([]), []);

  const contagem = useMemo(() => itens.reduce((total, item) => total + item.qtd, 0), [itens]);

  const valor = useMemo<ContextoCarrinho>(
    () => ({
      itens,
      carregado,
      contagem,
      adicionar,
      definirQuantidade,
      remover,
      manterApenas,
      limpar,
    }),
    [itens, carregado, contagem, adicionar, definirQuantidade, remover, manterApenas, limpar],
  );

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}

export function useCart(): ContextoCarrinho {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return contexto;
}
