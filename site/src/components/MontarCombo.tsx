"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCarrinho } from "./carrinho/contexto";
import {
  categorias,
  formatarPreco,
  refrigerantes,
  sabores,
  tamanhos,
  type Categoria,
  type Combo,
  type Refrigerante,
  type Sabor,
} from "@/data/pixpizza";

/**
 * Sabores escolhidos por pizza. O índice do array externo é a pizza; o interno
 * guarda os sabores daquela pizza, na ordem em que foram marcados.
 */
type Escolhas = Sabor[][];

function tamanhoDe(id: (typeof tamanhos)[number]["id"]) {
  return tamanhos.find((t) => t.id === id)!;
}

/**
 * O combo já vem com preço fechado, mas sabor especial cobra acréscimo também
 * dentro do combo — igual ao cardápio oficial. Cada pizza soma o acréscimo do
 * seu sabor mais caro.
 */
export function calcularPrecoCombo(combo: Combo, escolhas: Escolhas) {
  const acrescimos = escolhas.reduce((soma, daPizza) => {
    if (daPizza.length === 0) return soma;
    return soma + Math.max(...daPizza.map((s) => s.adicional ?? 0));
  }, 0);
  return combo.preco + acrescimos;
}

/** Remove acento e caixa para o filtro achar "camarao" digitando sem acento. */
function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function MontarCombo({
  combo,
  aoFechar,
}: {
  combo: Combo | null;
  aoFechar: () => void;
}) {
  if (!combo) return null;
  // A `key` remonta o diálogo a cada combo, então o estado começa limpo sem
  // precisar de um efeito que zera tudo.
  return <Dialogo key={combo.id} combo={combo} aoFechar={aoFechar} />;
}

function Dialogo({
  combo,
  aoFechar,
}: {
  combo: Combo;
  aoFechar: () => void;
}) {
  const { adicionar } = useCarrinho();
  const semMovimento = useReducedMotion();
  const dialogo = useRef<HTMLDivElement>(null);

  const [escolhas, setEscolhas] = useState<Escolhas>(() =>
    combo.pizzas.map(() => []),
  );
  const [bebidas, setBebidas] = useState<Refrigerante[]>(() =>
    Array.from({ length: combo.refrigerantes }, () => refrigerantes[0]),
  );
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const [pizzaAtiva, setPizzaAtiva] = useState(0);

  // Foco entra no diálogo para o teclado não continuar navegando o fundo.
  useEffect(() => {
    dialogo.current?.focus();
  }, []);

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aoFechar]);

  const visiveis = useMemo(() => {
    const termo = normalizar(busca.trim());
    return sabores.filter((s) => {
      const naCategoria = filtro === "todos" || s.categoria === filtro;
      if (!naCategoria) return false;
      if (!termo) return true;
      return (
        normalizar(s.nome).includes(termo) ||
        normalizar(s.ingredientes).includes(termo)
      );
    });
  }, [busca, filtro]);

  const tamanhoAtivo = tamanhoDe(combo.pizzas[pizzaAtiva]);
  const daPizzaAtiva = escolhas[pizzaAtiva] ?? [];
  const completo = escolhas.every((e) => e.length > 0);
  const preco = calcularPrecoCombo(combo, escolhas);

  function alternarSabor(sabor: Sabor) {
    setEscolhas((atuais) =>
      atuais.map((daPizza, i) => {
        if (i !== pizzaAtiva) return daPizza;
        const jaTem = daPizza.some((s) => s.id === sabor.id);
        if (jaTem) return daPizza.filter((s) => s.id !== sabor.id);
        if (daPizza.length >= tamanhoAtivo.maxSabores) {
          // No limite, o novo substitui o mais antigo em vez de ser ignorado.
          return [...daPizza.slice(1), sabor];
        }
        return [...daPizza, sabor];
      }),
    );
  }

  function confirmar() {
    if (!completo) return;

    const descricaoPizzas = escolhas
      .map((daPizza, i) => {
        const t = tamanhoDe(combo.pizzas[i]);
        return `${t.nome}: ${daPizza.map((s) => s.nome).join(" / ")}`;
      })
      .join(" · ");

    const descricaoBebida =
      bebidas.length > 0
        ? ` · ${bebidas.length}x ${combo.bebida ?? ""} ${bebidas.join(", ")}`.replace(
            /\s+/g,
            " ",
          )
        : "";

    adicionar({
      // O id inclui a configuração: dois combos iguais somam quantidade,
      // combos com sabores diferentes viram linhas separadas.
      id: `${combo.id}-${escolhas
        .map((p) => p.map((s) => s.id).join("+"))
        .join("|")}-${bebidas.join("|")}`,
      nome: combo.nome,
      detalhe: descricaoPizzas + descricaoBebida,
      precoUnitario: preco,
    });
    aoFechar();
  }

  const opcoes: { id: Categoria | "todos"; rotulo: string }[] = [
    { id: "todos", rotulo: "Todos" },
    ...categorias.map((c) => ({ id: c.id, rotulo: c.rotulo })),
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={`Escolher sabores do ${combo.nome}`}
      >
        <motion.button
          type="button"
          aria-label="Fechar"
          onClick={aoFechar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-sala/85 backdrop-blur-sm"
        />

        <motion.div
          ref={dialogo}
          tabIndex={-1}
          initial={semMovimento ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex max-h-[92svh] w-full flex-col border border-tela/20 bg-fumaca outline-none sm:max-h-[85svh] sm:max-w-3xl"
        >
          <header className="flex items-start justify-between gap-4 border-b border-tela/15 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 className="font-display text-2xl leading-none tracking-wide sm:text-3xl">
                {combo.nome.toUpperCase()}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-tela/70">
                {combo.inclui}
              </p>
            </div>
            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className="-mr-2 shrink-0 px-3 py-1 text-2xl leading-none text-tela/70 transition-colors hover:text-tela"
            >
              ×
            </button>
          </header>

          {/* Uma aba por pizza do combo. Com uma pizza só, a aba vira rótulo. */}
          <div className="border-b border-tela/15 px-5 py-3 sm:px-6">
            <div className="flex flex-wrap gap-2">
              {combo.pizzas.map((idTamanho, i) => {
                const t = tamanhoDe(idTamanho);
                const feitos = escolhas[i]?.length ?? 0;
                const ativo = i === pizzaAtiva;
                // O número só entra quando há mais de uma pizza do mesmo
                // tamanho: "Pizza grande 1 / Pizza pequena 2" confundiria.
                const doMesmoTamanho = combo.pizzas.filter(
                  (p) => p === idTamanho,
                ).length;
                const ordem =
                  combo.pizzas.slice(0, i + 1).filter((p) => p === idTamanho)
                    .length;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPizzaAtiva(i)}
                    aria-pressed={ativo}
                    className={`flex items-center gap-2 border px-3 py-2 text-left transition-colors ${
                      ativo
                        ? "border-pix bg-pix/10"
                        : "border-tela/20 hover:border-tela/50"
                    }`}
                  >
                    <span className="font-display text-sm tracking-wide">
                      {t.nome.toUpperCase()}
                      {doMesmoTamanho > 1 ? ` ${ordem}` : ""}
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        feitos > 0 ? "text-pix-claro" : "text-tela/55"
                      }`}
                    >
                      {feitos}/{t.maxSabores}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-tela/65">
              {tamanhoAtivo.maxSabores === 1
                ? "Escolha 1 sabor para esta pizza."
                : "Escolha até 2 sabores para esta pizza."}
            </p>
          </div>

          {/* Filtros */}
          <div className="space-y-3 border-b border-tela/15 px-5 py-3 sm:px-6">
            <label className="sr-only" htmlFor="busca-sabor">
              Filtrar sabores por nome
            </label>
            <input
              id="busca-sabor"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Filtrar por nome ou ingrediente…"
              className="w-full border border-tela/25 bg-sala px-3 py-2.5 text-tela placeholder:text-tela/40 focus:border-pix"
            />
            <div
              role="group"
              aria-label="Filtrar por categoria"
              className="flex flex-wrap gap-2"
            >
              {opcoes.map((o) => {
                const ativo = filtro === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setFiltro(o.id)}
                    aria-pressed={ativo}
                    className={`px-3 py-1.5 font-display text-xs tracking-wide transition-colors sm:text-sm ${
                      ativo
                        ? "bg-pix-fundo text-tela"
                        : "border border-tela/25 text-tela/70 hover:border-tela hover:text-tela"
                    }`}
                  >
                    {o.rotulo.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de sabores */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
            <p aria-live="polite" className="sr-only">
              {visiveis.length}{" "}
              {visiveis.length === 1 ? "sabor encontrado" : "sabores encontrados"}
            </p>

            {visiveis.length === 0 ? (
              <p className="py-8 text-center text-sm text-tela/65">
                Nenhum sabor com esse nome. Peça no campo de observação ao
                finalizar — a casa tem mais de 80.
              </p>
            ) : (
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {visiveis.map((sabor) => {
                  const marcado = daPizzaAtiva.some((s) => s.id === sabor.id);
                  return (
                    <li key={sabor.id}>
                      <button
                        type="button"
                        onClick={() => alternarSabor(sabor)}
                        aria-pressed={marcado}
                        className={`flex h-full w-full flex-col items-start border p-3.5 text-left transition-colors ${
                          marcado
                            ? "border-pix bg-pix/10"
                            : "border-tela/15 bg-sala hover:border-tela/45"
                        }`}
                      >
                        <span className="flex w-full items-baseline justify-between gap-3">
                          <span className="font-display leading-tight tracking-wide">
                            {sabor.nome.toUpperCase()}
                          </span>
                          <span className="shrink-0 font-mono text-xs tabular-nums text-tela/70">
                            {sabor.adicional
                              ? `+ ${formatarPreco(sabor.adicional)}`
                              : "incluso"}
                          </span>
                        </span>
                        <span className="mt-1.5 text-xs leading-relaxed text-tela/65">
                          {sabor.ingredientes}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Bebida */}
            {combo.refrigerantes > 0 ? (
              <fieldset className="mt-6 border-t border-tela/15 pt-5">
                <legend className="font-display tracking-wide">
                  {combo.refrigerantes > 1
                    ? `REFRIGERANTES (${combo.refrigerantes})`
                    : "REFRIGERANTE"}
                </legend>
                <div className="mt-3 space-y-3">
                  {bebidas.map((escolhida, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2">
                      {combo.refrigerantes > 1 ? (
                        <span className="mr-1 font-mono text-xs text-tela/60">
                          {i + 1}º
                        </span>
                      ) : null}
                      {refrigerantes.map((r) => (
                        <label
                          key={r}
                          className={`cursor-pointer border px-4 py-2 font-display text-sm tracking-wide transition-colors ${
                            escolhida === r
                              ? "border-pix bg-pix/10"
                              : "border-tela/20 hover:border-tela/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`refri-${i}`}
                            checked={escolhida === r}
                            onChange={() =>
                              setBebidas((atuais) =>
                                atuais.map((v, j) => (j === i ? r : v)),
                              )
                            }
                            className="sr-only"
                          />
                          {r.toUpperCase()}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>

          <footer
            className="border-t border-tela/15 px-5 py-4 sm:px-6"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-tela/60">
                  Total do combo
                </p>
                <p className="font-mono text-2xl tabular-nums text-pix">
                  {formatarPreco(preco)}
                </p>
              </div>
              <button
                type="button"
                onClick={confirmar}
                disabled={!completo}
                className="w-full bg-pix-fundo px-6 py-3.5 font-display text-lg tracking-wide text-tela transition-colors hover:bg-pix disabled:cursor-not-allowed disabled:bg-tela/15 disabled:text-tela/45 sm:w-auto"
              >
                {completo ? "ADICIONAR AO PEDIDO" : "ESCOLHA OS SABORES"}
              </button>
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
