"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCarrinho } from "./contexto";
import { Checkout } from "./Checkout";
import { formatarPreco, regras } from "@/data/pixpizza";

export function PainelCarrinho() {
  const {
    itens,
    subtotal,
    aberto,
    fechar,
    alterarQuantidade,
    remover,
    entregaGratis,
    faltaParaEntregaGratis,
  } = useCarrinho();
  const [finalizando, setFinalizando] = useState(false);
  const semMovimento = useReducedMotion();
  const painel = useRef<HTMLDivElement>(null);

  // Fechar sempre volta o painel ao estado inicial, senão reabrir cai direto
  // no formulário de checkout.
  const fecharTudo = useCallback(() => {
    setFinalizando(false);
    fechar();
  }, [fechar]);

  // Esc fecha o painel, como em qualquer diálogo.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharTudo();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, fecharTudo]);

  // Ao abrir, o foco entra no painel para o teclado não continuar no fundo.
  useEffect(() => {
    if (aberto) painel.current?.focus();
  }, [aberto]);

  return (
    <AnimatePresence>
      {aberto ? (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Seu pedido"
        >
          <motion.button
            type="button"
            aria-label="Fechar o pedido"
            onClick={fecharTudo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-sala/80 backdrop-blur-sm"
          />

          <motion.div
            ref={painel}
            tabIndex={-1}
            initial={semMovimento ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={semMovimento ? undefined : { x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-tela/20 bg-fumaca outline-none"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <header className="flex items-center justify-between gap-4 border-b border-tela/15 px-5 py-4">
              <h2 className="font-display text-2xl tracking-wide">
                {finalizando ? "FINALIZAR" : "SEU PEDIDO"}
              </h2>
              <button
                type="button"
                onClick={finalizando ? () => setFinalizando(false) : fecharTudo}
                className="px-2 py-1 text-sm uppercase tracking-wider text-tela/70 transition-colors hover:text-tela"
              >
                {finalizando ? "Voltar" : "Fechar"}
              </button>
            </header>

            {itens.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="font-display text-2xl leading-tight tracking-wide">
                  AINDA NÃO TEM
                  <br />
                  NADA AQUI
                </p>
                <p className="text-sm text-tela/65">
                  Monte uma pizza ou escolha um combo para começar.
                </p>
                <button
                  type="button"
                  onClick={fecharTudo}
                  className="mt-2 border border-tela/35 px-6 py-3 font-display tracking-wide transition-colors hover:border-tela hover:bg-tela hover:text-sala"
                >
                  VER O CARDÁPIO
                </button>
              </div>
            ) : finalizando ? (
              <Checkout />
            ) : (
              <>
                <ul className="flex-1 divide-y divide-tela/10 overflow-y-auto overscroll-contain px-5">
                  {itens.map((item) => (
                    <li key={item.id} className="py-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-display text-lg leading-tight tracking-wide">
                          {item.nome.toUpperCase()}
                        </p>
                        <p className="shrink-0 font-mono tabular-nums text-pix">
                          {formatarPreco(item.precoUnitario * item.quantidade)}
                        </p>
                      </div>
                      {item.detalhe ? (
                        <p className="mt-1.5 text-xs leading-relaxed text-tela/55">
                          {item.detalhe}
                        </p>
                      ) : null}

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center border border-tela/25">
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(item.id, -1)}
                            aria-label={`Tirar um ${item.nome}`}
                            className="px-3 py-1.5 text-lg leading-none text-tela/80 transition-colors hover:bg-tela/10 hover:text-tela"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center font-mono text-sm tabular-nums">
                            {item.quantidade}
                          </span>
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(item.id, 1)}
                            aria-label={`Adicionar mais um ${item.nome}`}
                            className="px-3 py-1.5 text-lg leading-none text-tela/80 transition-colors hover:bg-tela/10 hover:text-tela"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remover(item.id)}
                          className="text-xs uppercase tracking-wider text-tela/55 transition-colors hover:text-pix"
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-tela/15 px-5 py-5">
                  {entregaGratis ? (
                    <p className="mb-3 text-sm text-pix">
                      Entrega grátis liberada.
                    </p>
                  ) : (
                    <p className="mb-3 text-sm text-tela/65">
                      Faltam {formatarPreco(faltaParaEntregaGratis)} para a
                      entrega sair de graça (acima de R${" "}
                      {regras.entregaGratisAcima}).
                    </p>
                  )}

                  <p className="flex items-baseline justify-between gap-3">
                    <span className="text-sm uppercase tracking-wider text-tela/60">
                      Subtotal
                    </span>
                    <span className="font-mono text-2xl tabular-nums">
                      {formatarPreco(subtotal)}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setFinalizando(true)}
                    className="mt-4 w-full bg-pix-fundo px-6 py-4 font-display text-lg tracking-wide text-tela transition-colors hover:bg-pix"
                  >
                    FINALIZAR PEDIDO
                  </button>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
