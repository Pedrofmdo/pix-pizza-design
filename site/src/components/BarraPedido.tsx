"use client";

import { useCarrinho } from "./carrinho/contexto";
import { formatarPreco } from "@/data/pixpizza";

/**
 * Barra fixa no mobile. A ação principal do site é pedir, e no celular ela não
 * pode depender de rolar de volta ao topo. Some a partir de lg, onde o botão
 * do cabeçalho já fica sempre visível.
 */
export function BarraPedido() {
  const { quantidadeTotal, subtotal, abrir } = useCarrinho();

  return (
    /* nav, não div: é um landmark, e sem ele os links da barra ficam fora de
       qualquer região para quem navega por marcos. */
    <nav
      aria-label="Pedido"
      className="fixed inset-x-0 bottom-0 z-30 flex gap-px border-t border-tela/20 bg-sala/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href="#montar"
        className="flex-1 px-4 py-4 text-center font-display tracking-wide text-tela"
      >
        MONTAR
      </a>
      <button
        type="button"
        onClick={abrir}
        className="flex flex-[1.5] items-center justify-center gap-2 bg-pix-fundo px-4 py-4 text-center font-display tracking-wide text-tela"
      >
        MEU PEDIDO
        {quantidadeTotal > 0 ? (
          <span className="font-mono text-sm tabular-nums">
            {formatarPreco(subtotal)}
          </span>
        ) : null}
      </button>
    </nav>
  );
}
