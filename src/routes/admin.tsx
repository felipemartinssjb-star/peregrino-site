import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/peregrino/PageShell";
import { catalogo, formatPreco, produtoSchema, type Produto } from "@/lib/produtos";
import { adminLogin, adminSalvarImagem, adminSalvarProdutos, adminStatus } from "@/fns/admin";

const title = "Admin | Peregrino";
const CHAVE_TOKEN = "peregrino-admin-token";
const EXTENSOES = ["jpg", "jpeg", "png", "webp"];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title }, { name: "robots", content: "noindex" }],
  }),
  component: Admin,
});

function produtoVazio(): Produto {
  return {
    id: "",
    nome: "",
    descricao: "",
    preco: 0,
    categoria: "",
    tamanhos: [],
    imagens: [],
    bullets: [],
    tray: { url: "" },
  };
}

function paraBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const bruto = String(reader.result ?? "");
      const virgula = bruto.indexOf(",");
      resolve(virgula === -1 ? "" : bruto.slice(virgula + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function parseVariantes(texto: string): Record<string, number> {
  const saida: Record<string, number> = {};
  for (const linha of texto.split(/\r?\n/)) {
    const [chave, valor] = linha.split(":");
    const tamanho = chave?.trim();
    const id = Number(valor?.trim());
    if (tamanho && Number.isInteger(id) && id > 0) saida[tamanho] = id;
  }
  return saida;
}

function splitTamanhos(texto: string): string[] {
  return texto
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function splitLinhas(texto: string): string[] {
  return texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function baixarJson(produtos: Produto[]) {
  const blob = new Blob([`${JSON.stringify(produtos, null, 2)}\n`], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "produtos.json";
  a.click();
  URL.revokeObjectURL(url);
}

function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [senha, setSenha] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>(() => [...catalogo]);
  const [form, setForm] = useState<Produto | null>(null);
  const [ehNovo, setEhNovo] = useState(false);
  const [tamanhosTexto, setTamanhosTexto] = useState("");
  const [bulletsTexto, setBulletsTexto] = useState("");
  const [variantesTexto, setVariantesTexto] = useState("");
  const [trayIdTexto, setTrayIdTexto] = useState("");
  const [gravavel, setGravavel] = useState<boolean | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE_TOKEN);
    if (salvo) setToken(salvo);
    void adminStatus()
      .then((r) => setGravavel(r.gravavel))
      .catch(() => setGravavel(null));
  }, []);

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    adminLogin({ data: { senha } })
      .then(async (r) => {
        if (r.ok) {
          localStorage.setItem(CHAVE_TOKEN, r.token);
          setToken(r.token);
          setSenha("");
          toast.success("Bem-vindo ao admin.");
          const status = await adminStatus().catch(() => null);
          setGravavel(status?.gravavel ?? null);
        } else {
          toast.error(r.erro);
        }
      })
      .catch(() => toast.error("Falha de conexão com o servidor."))
      .finally(() => setEnviando(false));
  }

  function sair() {
    localStorage.removeItem(CHAVE_TOKEN);
    setToken(null);
    setForm(null);
    toast.info("Sessão encerrada.");
  }

  function abrirNovo() {
    setForm(produtoVazio());
    setEhNovo(true);
    setTamanhosTexto("");
    setBulletsTexto("");
    setVariantesTexto("");
    setTrayIdTexto("");
  }

  function abrirEdicao(produto: Produto) {
    setForm(produto);
    setEhNovo(false);
    setTamanhosTexto(produto.tamanhos.join(", "));
    setBulletsTexto(produto.bullets.join("\n"));
    setVariantesTexto(
      Object.entries(produto.tray.variantes ?? {})
        .map(([tamanho, id]) => `${tamanho}: ${id}`)
        .join("\n"),
    );
    setTrayIdTexto(produto.tray.produtoId ? String(produto.tray.produtoId) : "");
  }

  function fechar() {
    setForm(null);
  }

  async function aoAdicionarImagem(file: File) {
    if (!form) return;
    if (form.imagens.length >= 3) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx. 8 MB).");
      return;
    }
    setEnviando(true);
    try {
      const base64 = await paraBase64(file);
      const extRaw = (file.name.split(".").pop() ?? "").toLowerCase();
      const ext = EXTENSOES.includes(extRaw) ? extRaw : "jpg";
      const nome = `${form.id || "produto"}-${form.imagens.length + 1}-${Date.now()}.${ext}`;
      let caminho = "";

      if (gravavel && token) {
        try {
          const r = await adminSalvarImagem({ data: { token, nomeArquivo: nome, base64 } });
          if (r.ok) caminho = r.caminho;
        } catch {
          // cai no fallback abaixo
        }
      }

      if (!caminho) {
        caminho = `data:${file.type || "image/jpeg"};base64,${base64}`;
        toast.warning("Imagem embutida no JSON (modo export).");
      }

      setForm((atual) => (atual ? { ...atual, imagens: [...atual.imagens, caminho] } : atual));
    } catch {
      toast.error("Não foi possível ler a imagem.");
    } finally {
      setEnviando(false);
    }
  }

  function removerImagem(indice: number) {
    setForm((atual) =>
      atual ? { ...atual, imagens: atual.imagens.filter((_, i) => i !== indice) } : atual,
    );
  }

  async function salvar() {
    if (!form || !token) return;

    const trayId = Number(trayIdTexto);
    const variantes = parseVariantes(variantesTexto);
    const bruto = {
      ...form,
      preco: Number(form.preco),
      tamanhos: splitTamanhos(tamanhosTexto),
      bullets: splitLinhas(bulletsTexto),
      tray: {
        url: form.tray.url.trim(),
        ...(Number.isInteger(trayId) && trayId > 0 ? { produtoId: trayId } : {}),
        ...(Object.keys(variantes).length > 0 ? { variantes } : {}),
      },
    };

    const validado = produtoSchema.safeParse(bruto);
    if (!validado.success) {
      toast.error(validado.error.issues[0]?.message ?? "Dados do produto inválidos.");
      return;
    }

    const produto = validado.data;
    if (ehNovo && produtos.some((p) => p.id === produto.id)) {
      toast.error("Já existe um produto com esse identificador.");
      return;
    }

    const novos = ehNovo
      ? [...produtos, produto]
      : produtos.map((p) => (p.id === produto.id ? produto : p));

    setEnviando(true);
    try {
      const resposta = await adminSalvarProdutos({ data: { token, produtos: novos } });
      setProdutos(novos);
      if (resposta.ok) {
        toast.success("Catálogo salvo em src/data/produtos.json.");
        fechar();
      } else if ("erro" in resposta && resposta.erro === "sessao") {
        toast.error("Sessão inválida. Entre novamente.");
        sair();
      } else {
        toast.warning("Modo export: baixe o produtos.json e suba no próximo deploy.");
        baixarJson(novos);
      }
    } catch {
      toast.error("Falha ao salvar o catálogo.");
    } finally {
      setEnviando(false);
    }
  }

  if (!token) {
    return (
      <PageShell>
        <section className="content max-w-md pt-44 pb-24">
          <span className="caption text-gold">Área restrita</span>
          <h1 className="mt-6 display-2 text-olive-950">Admin</h1>
          <span className="rule mt-8" />
          <form onSubmit={entrar} className="mt-10 space-y-4">
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha de acesso"
              autoComplete="current-password"
              className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm text-olive-950 outline-none focus:border-olive-800"
            />
            <button type="submit" disabled={enviando} className="btn-base btn-solid w-full">
              {enviando ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="content pt-40 pb-24 md:pt-52">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="caption text-gold">Catálogo</span>
            <h1 className="mt-6 display-2 text-olive-950">Administração</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={abrirNovo} className="btn-base btn-solid">
              Novo produto
            </button>
            <button
              type="button"
              onClick={() => baixarJson(produtos)}
              className="btn-base btn-outline"
            >
              Baixar JSON
            </button>
            <button type="button" onClick={sair} className="btn-base btn-outline">
              Sair
            </button>
          </div>
        </div>

        {gravavel === false && (
          <p className="mt-8 border border-border bg-white p-4 text-sm text-earth">
            Produção é somente leitura: as alterações serão baixadas como{" "}
            <span className="text-olive-950">produtos.json</span> para você subir no deploy. Em{" "}
            <span className="text-olive-950">npm run dev</span> tudo é gravado automaticamente.
          </p>
        )}

        <div className="mt-12 border-t border-border">
          {produtos.length === 0 && <p className="py-10 body-base">Nenhum produto cadastrado.</p>}
          {produtos.map((produto) => (
            <div key={produto.id} className="flex items-center gap-6 border-b border-border py-6">
              <div className="film h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-beige-200">
                {produto.imagens[0] ? (
                  <img src={produto.imagens[0]} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl text-olive-950">{produto.nome}</p>
                <p className="caption mt-1 text-earth">
                  {produto.id} · {formatPreco(produto.preco)}
                  {produto.tray.produtoId ? ` · tray #${produto.tray.produtoId}` : " · sem id tray"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => abrirEdicao(produto)}
                className="caption text-olive-800 link-underline"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </section>

      {form && (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-beige-50/97 backdrop-blur-sm">
          <div className="content mx-auto max-w-3xl py-16">
            <div className="flex items-center justify-between">
              <span className="caption text-gold">
                {ehNovo ? "Novo produto" : "Editar produto"}
              </span>
              <button type="button" onClick={fechar} className="caption text-olive-800">
                Fechar
              </button>
            </div>

            <div className="mt-8 space-y-6 border border-border bg-white p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="caption text-earth">Identificador (slug)</span>
                  <input
                    type="text"
                    value={form.id}
                    disabled={!ehNovo}
                    onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().trim() })}
                    placeholder="camiseta-oliva"
                    className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm disabled:opacity-60"
                  />
                </label>
                <label className="block">
                  <span className="caption text-earth">Nome</span>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="caption text-earth">Preço (R$)</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: Number(e.target.value) || 0 })}
                    className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="caption text-earth">Categoria</span>
                  <input
                    type="text"
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    placeholder="Camisetas"
                    className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                  />
                </label>
              </div>

              <label className="block">
                <span className="caption text-earth">Descrição</span>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  rows={4}
                  className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="caption text-earth">Tamanhos (vírgula)</span>
                  <input
                    type="text"
                    value={tamanhosTexto}
                    onChange={(e) => setTamanhosTexto(e.target.value)}
                    placeholder="P, M, G, GG"
                    className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="caption text-earth">Destaques (um por linha)</span>
                  <textarea
                    value={bulletsTexto}
                    onChange={(e) => setBulletsTexto(e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                  />
                </label>
              </div>

              <div className="border-t border-border pt-6">
                <span className="caption text-gold">Loja Tray</span>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="caption text-earth">Link “Comprar agora”</span>
                    <input
                      type="url"
                      value={form.tray.url}
                      onChange={(e) =>
                        setForm({ ...form, tray: { ...form.tray, url: e.target.value } })
                      }
                      placeholder="https://sualoja.com.br/camiseta-oliva"
                      className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="caption text-earth">ID do produto na Tray</span>
                    <input
                      type="number"
                      min="1"
                      value={trayIdTexto}
                      onChange={(e) => setTrayIdTexto(e.target.value)}
                      placeholder="12345"
                      className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                    />
                  </label>
                </div>
                <label className="mt-6 block">
                  <span className="caption text-earth">
                    Variações por tamanho (tamanho: id — uma por linha)
                  </span>
                  <textarea
                    value={variantesTexto}
                    onChange={(e) => setVariantesTexto(e.target.value)}
                    rows={4}
                    placeholder={"P: 111\nM: 112\nG: 113\nGG: 114"}
                    className="mt-2 w-full rounded-sm border border-input bg-beige-50 px-4 py-3 text-sm"
                  />
                </label>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-earth">
                  Sem o ID do produto e das variações, o “Finalizar na Tray” não consegue levar o
                  item ao carrinho da loja.
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <span className="caption text-earth">
                  Imagens — máximo 3 ({form.imagens.length}/3)
                </span>
                <div className="mt-4 space-y-3">
                  {form.imagens.map((src, i) => (
                    <div
                      key={`${src.slice(0, 40)}-${i}`}
                      className="flex items-center gap-4 border border-border bg-beige-50 p-3"
                    >
                      <img src={src} alt="" className="h-20 w-16 rounded-sm object-cover" />
                      <span className="caption flex-1 text-earth">Imagem {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removerImagem(i)}
                        className="caption text-earth hover:text-destructive"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  {form.imagens.length < 3 && (
                    <label className="block cursor-pointer border border-dashed border-border bg-beige-50 p-6 text-center transition-colors hover:border-olive-800">
                      <span className="caption text-earth">
                        Adicionar imagem ({form.imagens.length}/3)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const arquivo = e.target.files?.[0];
                          if (arquivo) void aoAdicionarImagem(arquivo);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 border-t border-border pt-6">
                <button
                  type="button"
                  onClick={() => void salvar()}
                  disabled={enviando}
                  className="btn-base btn-solid"
                >
                  {enviando ? "Salvando…" : "Salvar produto"}
                </button>
                <button type="button" onClick={fechar} className="btn-base btn-outline">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
