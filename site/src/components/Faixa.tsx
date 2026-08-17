import Image from "next/image";

/**
 * Faixa larga entre seções: a foto ocupa a largura toda em proporção de tela
 * de cinema e recebe a mesma grade das outras imagens. O balão de fala por
 * cima é o elemento da marca — é o logo virando legenda.
 */
export function Faixa({
  src,
  alt,
  fala,
  assinatura,
}: {
  src: string;
  alt: string;
  fala: string;
  assinatura: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-sala">
      <div className="cine-vinheta relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="cine object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-6xl items-end px-5 pb-10 sm:px-8 sm:pb-14">
        <div>
          <p className="balao inline-block max-w-xl bg-tela px-6 py-4 font-display text-[clamp(1.3rem,3.6vw,2rem)] leading-tight tracking-wide text-sala [--cor-balao:var(--color-tela)]">
            {fala}
          </p>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-tela/70">
            {assinatura}
          </p>
        </div>
      </div>
    </section>
  );
}
