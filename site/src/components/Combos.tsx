"use client";

import { useState } from "react";
import Image from "next/image";
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
        <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
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

          {/* A arte oficial de combos do feed deles. Fica ao lado do título, não
              atrás: ela já traz a palavra "COMBOS" no desenho, e sobrepor os
              dois deixaria a mesma palavra duas vezes em cima da outra. */}
          <Revelar atraso={0.1}>
            <div className="cine-vinheta relative aspect-[16/10] w-full overflow-hidden border border-tela/15 lg:aspect-[4/3]">
              <Image
                src="/img/ig-1.jpg"
                alt="Arte da Pix Pizza anunciando os combos, com fatias de pepperoni sobre fundo vermelho"
                fill
                sizes="(min-width: 1024px) 26rem, 90vw"
                className="cine object-cover object-center"
              />
            </div>
          </Revelar>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo, i) => (
            <li key={combo.id}>
              <Revelar atraso={Math.min(i, 5) * 0.05}>
                <article className="flex h-full flex-col overflow-hidden border border-tela/15 bg-sala transition-colors hover:border-pix">
                  <div className="cine-vinheta relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={combo.foto}
                      alt={combo.fotoAlt}
                      fill
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                      className="cine object-cover"
                    />
                    {combo.destaque ? (
                      <p className="absolute left-4 top-4 z-10 bg-pix-fundo px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-tela">
                        {combo.destaque}
                      </p>
                    ) : null}

                    {/*
                      O desenho da composição fica sobre a foto porque é o que o
                      cliente precisa ler primeiro: quantas pizzas vêm. A foto
                      dá vontade, o desenho dá a conta.
                    */}
                    <p className="absolute bottom-3 right-4 z-10 font-mono text-2xl leading-none tabular-nums text-pix [text-shadow:0_1px_6px_rgba(10,7,8,0.95)]">
                      {formatarPreco(combo.preco)}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="font-display text-2xl leading-none tracking-wide">
                        {combo.nome.toUpperCase()}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-tela/70">
                        {combo.inclui}
                      </p>
                    </div>

                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => setEscolhendo(combo)}
                        className="w-full bg-pix-fundo px-5 py-3.5 font-display tracking-wide text-tela transition-colors hover:bg-pix"
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
