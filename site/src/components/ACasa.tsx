import Image from "next/image";
import { Revelar } from "./Revelar";
import { galeria, links, negocio } from "@/data/pixpizza";

export function ACasa() {
  return (
    <section id="casa" className="scroll-mt-20 bg-sala px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          <Revelar>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-pix-claro">
              A casa
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-none">
              A ÚLTIMA FATIA
              <br />
              DA NOITE SAI DAQUI
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-tela/75">
              A Pix Pizza é ponto de encontro em Manaíra. Enquanto a cidade
              fecha, o forno continua aceso — e é por isso que a mesa daqui
              ainda está cheia às quatro da manhã.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-tela/15 pt-6">
              <div>
                <dt className="text-xs uppercase tracking-wider text-tela/60">
                  Nota no Google
                </dt>
                <dd className="mt-1 font-display text-3xl text-pix">
                  {negocio.nota.toLocaleString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-tela/60">
                  No Instagram
                </dt>
                <dd className="mt-1 font-display text-3xl text-pix">
                  {negocio.seguidores}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-tela/60">
                  Sabores
                </dt>
                <dd className="mt-1 font-display text-3xl text-pix">80+</dd>
              </div>
            </dl>

            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block border border-tela/35 px-6 py-3.5 font-display tracking-wide transition-colors hover:border-tela hover:bg-tela hover:text-sala"
            >
              VER O INSTAGRAM
            </a>
          </Revelar>

          <Revelar atraso={0.1}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galeria.map((foto) => (
                <li
                  key={foto.src}
                  className={`cine-vinheta relative overflow-hidden border border-tela/15 ${
                    foto.larga
                      ? "col-span-2 aspect-[16/10]"
                      : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 300px"
                    className="cine object-cover"
                  />
                </li>
              ))}
            </ul>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
