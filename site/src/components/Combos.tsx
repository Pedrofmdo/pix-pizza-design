"use client";

import { useState } from "react";
import { Revelar } from "./Revelar";
import { MontarCombo } from "./MontarCombo";
import {
  combos,
  formatarPreco,
  links,
  regras,
  type Combo,
} from "@/data/pixpizza";

export function Combos() {
  // O combo não vai direto para o carrinho: primeiro o cliente escolhe os
  // sabores de cada pizza, como no cardápio oficial da pizzaria.
  const [escolhendo, setEscolhendo] = useState<Combo | null>(null);

  return (
    <section
      id="combos"
      className="scroll-mt-20 bg-fumaca px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Revelar>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-pix-claro">
            O jeito mais rápido
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-none">
            COMBOS FECHADOS
          </h2>
          <p className="mt-4 max-w-2xl text-tela/70">
            Pizza e bebida no mesmo preço, do casal à turma inteira. Acima de{" "}
            {formatarPreco(regras.entregaGratisAcima)} a entrega sai de graça.
          </p>
        </Revelar>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo, i) => (
            <li key={combo.id}>
              <Revelar atraso={Math.min(i, 5) * 0.05}>
                <article className="flex h-full flex-col justify-between border border-tela/15 bg-sala p-6 transition-colors hover:border-pix">
                  <div>
                    {combo.destaque ? (
                      <p className="mb-3 inline-block bg-pix-fundo px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-tela">
                        {combo.destaque}
                      </p>
                    ) : null}
                    <h3 className="font-display text-2xl leading-none tracking-wide">
                      {combo.nome.toUpperCase()}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-tela/70">
                      {combo.inclui}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-tela/15 pt-4">
                    <p className="font-mono text-3xl tabular-nums text-pix">
                      {formatarPreco(combo.preco)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setEscolhendo(combo)}
                      className="mt-4 w-full bg-pix-fundo px-5 py-3.5 font-display tracking-wide text-tela transition-colors hover:bg-pix"
                    >
                      ESCOLHER SABORES
                    </button>
                    <p className="mt-2.5 text-xs leading-relaxed text-tela/65">
                      {combo.pizzas.length === 1
                        ? "1 pizza para montar"
                        : `${combo.pizzas.length} pizzas para montar`}
                      {combo.refrigerantes > 0
                        ? ` · refrigerante ${combo.bebida}`
                        : ""}
                    </p>
                  </div>
                </article>
              </Revelar>
            </li>
          ))}

          <li>
            <Revelar atraso={0.3}>
              <a
                href={links.cardapio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col justify-center border-2 border-dashed border-tela/25 p-6 text-center transition-colors hover:border-pix hover:bg-sala"
              >
                <span className="font-display text-2xl leading-tight tracking-wide">
                  VER O CARDÁPIO
                  <br />
                  COMPLETO
                </span>
                <span className="mt-3 text-sm text-tela/65">
                  Mais de 80 sabores, bebidas e sobremesas
                </span>
              </a>
            </Revelar>
          </li>
        </ul>
      </div>

      <MontarCombo combo={escolhendo} aoFechar={() => setEscolhendo(null)} />
    </section>
  );
}
