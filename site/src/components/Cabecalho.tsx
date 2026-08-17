"use client";

import Link from "next/link";
import { LogoPix } from "./LogoPix";
import { EstaAberto } from "./EstaAberto";
import { useCarrinho } from "./carrinho/contexto";

const secoes = [
  { href: "#montar", rotulo: "Montar" },
  { href: "#combos", rotulo: "Combos" },
  { href: "#casa", rotulo: "A casa" },
  { href: "#onde", rotulo: "Onde estamos" },
];

export function Cabecalho() {
  const { quantidadeTotal, abrir } = useCarrinho();

  return (
    <header className="sticky top-0 z-40 border-b border-tela/12 bg-sala/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 sm:gap-6 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Pix Pizza, início"
        >
          <LogoPix className="h-10 w-10 sm:h-11 sm:w-11" />
          <span className="font-display text-lg leading-none tracking-wide sm:text-xl">
            PIX PIZZA
          </span>
        </Link>

        <nav aria-label="Seções do site" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {secoes.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="text-sm font-semibold uppercase tracking-wider text-tela/75 transition-colors hover:text-tela"
                >
                  {s.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <span className="hidden md:block">
            <EstaAberto className="text-tela/70" />
          </span>

          <button
            type="button"
            onClick={abrir}
            className="relative shrink-0 bg-pix-fundo px-4 py-2.5 font-display text-sm tracking-wide text-tela transition-colors hover:bg-pix sm:px-5 sm:text-base"
          >
            MEU PEDIDO
            {quantidadeTotal > 0 ? (
              <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-tela px-1.5 py-0.5 font-mono text-xs tabular-nums text-sala">
                {quantidadeTotal}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
