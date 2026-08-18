"use client";

import { useEffect, useRef } from "react";

/**
 * Faixa de demonstração — o aviso de que este site não é o oficial da Pix
 * Pizza. Fica grudada no topo e nunca sai da tela.
 *
 * O cabeçalho também é sticky e precisa parar logo abaixo dela, e as âncoras
 * (#combos, #montar…) precisam parar abaixo dos dois. Como o texto quebra em
 * mais linhas conforme a tela estreita, a altura não é fixa: é medida aqui e
 * publicada em `--faixa-demo`, que o CSS usa nos dois lugares.
 */
export function FaixaDemo() {
  const faixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alvo = faixa.current;
    if (!alvo) return;

    const medir = () =>
      document.documentElement.style.setProperty(
        "--faixa-demo",
        `${alvo.offsetHeight}px`,
      );

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={faixa}
      role="note"
      className="sticky top-0 z-50 border-b border-amber-600/40 bg-amber-300 px-4 py-2.5 text-center text-[13px] font-semibold leading-snug text-neutral-900 sm:text-sm"
    >
      Demonstração — projeto conceitual criado por Pedro Oliveira. Não é o site
      oficial da Pix Pizza.
    </div>
  );
}
