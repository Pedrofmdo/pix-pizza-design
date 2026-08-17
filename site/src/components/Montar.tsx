"use client";

import { useMemo, useState } from "react";
import { Revelar } from "./Revelar";
import { useCarrinho } from "./carrinho/contexto";
import {
  categorias,
  formatarPreco,
  regras,
  sabores,
  tamanhos,
  type Categoria,
  type Sabor,
  type Tamanho,
} from "@/data/pixpizza";

/**
 * Preço da pizza montada.
 *
 * Em pizza de 2 sabores a casa cobra o acréscimo do sabor mais caro (não a
 * soma) — a regra fica em `regras.cobrancaDoisSabores` para não ficar
 * escondida aqui dentro.
 */
export function calcularPreco(tamanho: Tamanho, escolhidos: Sabor[]) {
  const adicionais = escolhidos.map((s) => s.adicional ?? 0);
  if (adicionais.length === 0) return tamanho.preco;

  const acrescimo =
    regras.cobrancaDoisSabores === "media"
      ? adicionais.reduce((a, b) => a + b, 0) / adicionais.length
      : Math.max(...adicionais);

  return tamanho.preco + acrescimo;
}

export function Montar() {
  const { adicionar } = useCarrinho();
  const [tamanho, setTamanho] = useState<Tamanho>(tamanhos[1]);
  const [escolhidos, setEscolhidos] = useState<Sabor[]>([]);
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");

  const visiveis = useMemo(
    () =>
      filtro === "todos"
        ? sabores
        : sabores.filter((s) => s.categoria === filtro),
    [filtro],
  );

  const completo = escolhidos.length > 0;
  const preco = calcularPreco(tamanho, escolhidos);

  function trocarTamanho(novo: Tamanho) {
    setTamanho(novo);
    // Diminuiu o limite? Mantém os primeiros e descarta o excedente.
    setEscolhidos((atuais) => atuais.slice(0, novo.maxSabores));
  }

  function alternarSabor(sabor: Sabor) {
    setEscolhidos((atuais) => {
      const jaTem = atuais.some((s) => s.id === sabor.id);
      if (jaTem) return atuais.filter((s) => s.id !== sabor.id);
      if (atuais.length >= tamanho.maxSabores) {
        // No limite, o novo sabor substitui o mais antigo em vez de ser
        // ignorado em silêncio.
        return [...atuais.slice(1), sabor];
      }
      return [...atuais, sabor];
    });
  }

  function adicionarAoCarrinho() {
    if (!completo) return;
    const nomes = escolhidos.map((s) => s.nome).join(" / ");
    adicionar({
      id: `pizza-${tamanho.id}-${escolhidos
        .map((s) => s.id)
        .sort()
        .join("-")}`,
      nome: `${tamanho.nome} — ${nomes}`,
      detalhe: escolhidos.map((s) => s.ingredientes).join(" · "),
      precoUnitario: preco,
    });
    setEscolhidos([]);
  }

  const opcoes: { id: Categoria | "todos"; rotulo: string }[] = [
    { id: "todos", rotulo: "Todos" },
    ...categorias.map((c) => ({ id: c.id, rotulo: c.rotulo })),
  ];

  return (
    <section
      id="montar"
      className="scroll-mt-20 bg-sala px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Revelar>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-pix-claro">
            Passo 1
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-none">
            MONTE A SUA
          </h2>
          <p className="mt-4 max-w-2xl text-tela/70">
            Escolha o tamanho e os sabores. O preço aparece na hora — sem
            surpresa no fim.
          </p>
        </Revelar>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-10">
          <div>
            {/* Tamanho */}
            <fieldset>
              <legend className="font-display text-xl tracking-wide">
                TAMANHO
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {tamanhos.map((t) => {
                  const ativo = t.id === tamanho.id;
                  return (
                    <label
                      key={t.id}
                      className={`flex cursor-pointer items-baseline justify-between gap-4 border px-5 py-4 transition-colors ${
                        ativo
                          ? "border-pix bg-pix/10"
                          : "border-tela/20 hover:border-tela/50"
                      }`}
                    >
                      <span>
                        <input
                          type="radio"
                          name="tamanho"
                          value={t.id}
                          checked={ativo}
                          onChange={() => trocarTamanho(t)}
                          className="sr-only"
                        />
                        <span className="block font-display text-xl tracking-wide">
                          {t.nome}
                        </span>
                        <span className="block text-sm text-tela/60">
                          {t.detalhe}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono tabular-nums text-pix">
                        {formatarPreco(t.preco)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Sabores */}
            <div className="mt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-xl tracking-wide">
                  SABORES
                  <span className="ml-3 font-mono text-sm font-normal tracking-normal text-tela/60">
                    {escolhidos.length} de {tamanho.maxSabores}
                  </span>
                </h3>
              </div>

              <div
                role="group"
                aria-label="Filtrar sabores por categoria"
                className="mt-4 flex flex-wrap gap-2"
              >
                {opcoes.map((o) => {
                  const ativo = filtro === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setFiltro(o.id)}
                      aria-pressed={ativo}
                      className={`px-4 py-2 font-display text-sm tracking-wide transition-colors ${
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

              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {visiveis.map((sabor) => {
                  const ativo = escolhidos.some((s) => s.id === sabor.id);
                  return (
                    <li key={sabor.id}>
                      <button
                        type="button"
                        onClick={() => alternarSabor(sabor)}
                        aria-pressed={ativo}
                        className={`flex h-full w-full flex-col items-start border p-4 text-left transition-colors ${
                          ativo
                            ? "border-pix bg-pix/10"
                            : "border-tela/15 bg-fumaca hover:border-tela/45"
                        }`}
                      >
                        <span className="flex w-full items-baseline justify-between gap-3">
                          <span className="font-display text-lg leading-tight tracking-wide">
                            {sabor.nome.toUpperCase()}
                          </span>
                          <span className="shrink-0 font-mono text-xs tabular-nums text-tela/70">
                            {sabor.adicional
                              ? `+ ${formatarPreco(sabor.adicional)}`
                              : "incluso"}
                          </span>
                        </span>
                        <span className="mt-2 text-sm leading-relaxed text-tela/65">
                          {sabor.ingredientes}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 text-sm text-tela/60">
                São mais de 80 sabores no total. Não achou o seu? Escreva no
                campo de observação ao finalizar o pedido.
              </p>
            </div>
          </div>

          {/*
            No desktop o resumo acompanha a rolagem. No celular ele cairia no
            fim da lista de sabores, longe demais de quem acabou de escolher —
            por isso existe a barra fixa logo abaixo.
          */}
          <div className="lg:sticky lg:top-24">
            <div className="border border-tela/20 bg-fumaca p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-pix-claro">
                Sua pizza
              </p>
              <p className="mt-3 font-display text-2xl leading-tight tracking-wide">
                {tamanho.nome.toUpperCase()}
              </p>

              {completo ? (
                <ul className="mt-4 space-y-2">
                  {escolhidos.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="text-tela/85">{s.nome}</span>
                      <button
                        type="button"
                        onClick={() => alternarSabor(s)}
                        className="shrink-0 text-xs uppercase tracking-wider text-tela/55 transition-colors hover:text-pix"
                      >
                        tirar
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-tela/60">
                  Escolha pelo menos um sabor para continuar.
                </p>
              )}

              {escolhidos.length === 2 ? (
                <p className="mt-4 border-t border-tela/15 pt-4 text-xs leading-relaxed text-tela/60">
                  Em dois sabores vale o acréscimo do sabor mais caro.
                </p>
              ) : null}

              <p className="mt-5 flex items-baseline justify-between gap-3 border-t border-tela/15 pt-5">
                <span className="text-sm uppercase tracking-wider text-tela/60">
                  Total
                </span>
                <span className="font-mono text-3xl tabular-nums text-pix">
                  {formatarPreco(preco)}
                </span>
              </p>

              <button
                type="button"
                onClick={adicionarAoCarrinho}
                disabled={!completo}
                className="mt-5 w-full bg-pix-fundo px-6 py-4 font-display text-lg tracking-wide text-tela transition-colors hover:bg-pix disabled:cursor-not-allowed disabled:bg-tela/15 disabled:text-tela/45"
              >
                ADICIONAR AO PEDIDO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*
        Barra fixa do montador no celular: aparece assim que há um sabor
        escolhido e fica logo acima da barra de pedido, para o total e o botão
        de adicionar não sumirem no fim da lista.
      */}
      {completo ? (
        <div className="fixed inset-x-0 bottom-[3.55rem] z-20 flex items-center gap-3 border-t border-tela/20 bg-fumaca/97 px-4 py-3 backdrop-blur lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-tela/65">
              {tamanho.nome} · {escolhidos.map((s) => s.nome).join(" / ")}
            </p>
            <p className="font-mono text-xl tabular-nums text-pix">
              {formatarPreco(preco)}
            </p>
          </div>
          <button
            type="button"
            onClick={adicionarAoCarrinho}
            className="shrink-0 bg-pix-fundo px-5 py-3 font-display tracking-wide text-tela"
          >
            ADICIONAR
          </button>
        </div>
      ) : null}
    </section>
  );
}
