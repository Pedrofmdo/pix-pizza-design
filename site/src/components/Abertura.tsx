"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { EstaAberto } from "./EstaAberto";
import { LogoPix } from "./LogoPix";
import { links, negocio, regras } from "@/data/pixpizza";

/**
 * A abertura é uma foto do salão em widescreen, tratada como still de campanha:
 * preto fundo, cor densa, luz caindo nas bordas. Sobre ela, o balão de fala do
 * logo — que é o que a Pix Pizza tem de mais reconhecível.
 */
export function Abertura() {
  const semMovimento = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-sala">
      <div className="relative min-h-[86svh] w-full sm:min-h-[80svh]">
        <div className="absolute inset-0">
          <Image
            src="/img/ig-6.jpg"
            alt="Pizza grande da Pix Pizza recém-saída do forno, vista de cima"
            fill
            priority
            sizes="100vw"
            className="cine object-cover object-center"
          />
          {/*
            Véu direcional: o texto fica na esquerda, então a imagem escurece
            para esse lado. Sem isso o branco some em cima das áreas claras da
            foto — e um véu chapado apagaria a foto inteira.
          */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(95deg,rgba(10,7,8,0.96)_0%,rgba(10,7,8,0.86)_38%,rgba(10,7,8,0.45)_70%,rgba(10,7,8,0.25)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,7,8,0.95),transparent_45%)]"
          />
          {/* No celular o texto ocupa a largura toda, então o véu direcional
              não basta: entra uma camada uniforme só abaixo de sm. */}
          <div aria-hidden className="absolute inset-0 bg-sala/45 sm:hidden" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 sm:min-h-[80svh] sm:px-8 sm:pb-20">
          <motion.div
            initial={semMovimento ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* O balão fala a frase que já é da casa, no Instagram deles. */}
            <div className="balao mb-7 inline-flex max-w-full items-center gap-3 bg-pix-fundo px-5 py-3 [--cor-balao:var(--color-pix-fundo)]">
              <LogoPix className="h-8 w-8 shrink-0" titulo="" />
              <span className="font-display text-lg leading-none tracking-wide sm:text-xl">
                {negocio.chamada.toUpperCase()}
              </span>
            </div>

            <h1 className="max-w-3xl font-display text-[clamp(2.9rem,10vw,5.4rem)] leading-[0.88] tracking-tight">
              A PIZZA QUE SEGURA
              <br />
              MANAÍRA ACORDADA
              <br />
              {/* O vermelho fica na última linha, onde o véu é mais escuro e
                  a palavra não disputa com a foto. */}
              <span className="text-pix">ATÉ AS 4H30</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-tela/80">
              Monte a sua aqui no site, pague no Pix e confirme no WhatsApp.
              Entrega grátis acima de R$ {regras.entregaGratisAcima}.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#montar"
                className="bg-pix-fundo px-7 py-4 text-center font-display text-lg tracking-wide text-tela transition-transform hover:-translate-y-0.5 hover:bg-pix"
              >
                MONTAR MINHA PIZZA
              </a>
              <a
                href="#combos"
                className="border border-tela/40 px-7 py-4 text-center font-display text-lg tracking-wide text-tela transition-colors hover:border-tela hover:bg-tela hover:text-sala"
              >
                VER OS COMBOS
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <EstaAberto className="text-tela/80" />
              <a
                href={links.rotas}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-tela/70 underline-offset-4 transition-colors hover:text-tela hover:underline"
              >
                {negocio.endereco.bairro}, {negocio.endereco.cidade}
              </a>
              <span className="font-mono text-xs uppercase tracking-widest text-tela/70">
                {negocio.nota.toLocaleString("pt-BR")} no Google
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
