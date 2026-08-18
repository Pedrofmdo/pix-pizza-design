import { Revelar } from "./Revelar";
import { EstaAberto } from "./EstaAberto";
import { BotaoPrototipo } from "./prototipo/BotaoPrototipo";
import { enderecoCompleto, links, negocio, regras } from "@/data/pixpizza";

export function Onde() {
  return (
    <section
      id="onde"
      className="scroll-mt-20 bg-fumaca px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Revelar>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-pix-claro">
            Onde estamos
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-none">
            MANAÍRA, TODO DIA
          </h2>
        </Revelar>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <Revelar>
            <div className="flex h-full flex-col justify-between border border-tela/15 p-6 sm:p-8">
              <div>
                <EstaAberto className="text-tela/75" />

                <h3 className="mt-5 font-display text-2xl tracking-wide">
                  {negocio.nomeMaps.toUpperCase()}
                </h3>
                <address className="mt-3 not-italic leading-relaxed text-tela/75">
                  {negocio.endereco.rua}
                  <br />
                  {negocio.endereco.bairro}, {negocio.endereco.cidade} —{" "}
                  {negocio.endereco.estado}
                  <br />
                  CEP {negocio.endereco.cep}
                </address>

                <dl className="mt-6 space-y-3 border-t border-tela/15 pt-6 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-tela/60">Funcionamento</dt>
                    <dd className="text-right font-mono tabular-nums text-tela">
                      Todos os dias, 17h30–4h30
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-tela/60">WhatsApp</dt>
                    {/* Texto, não link: num protótipo não autorizado o número
                        da pizzaria não pode virar um toque de discagem. */}
                    <dd className="text-right font-mono tabular-nums text-tela">
                      {negocio.telefoneFormatado}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-tela/60">Entrega grátis</dt>
                    <dd className="text-right font-mono tabular-nums text-tela">
                      acima de R$ {regras.entregaGratisAcima}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-tela/60">Nota no Google</dt>
                    <dd className="text-right font-mono tabular-nums text-tela">
                      {negocio.nota.toLocaleString("pt-BR")}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={links.rotas}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-pix-fundo px-6 py-3.5 text-center font-display tracking-wide transition-colors hover:bg-pix"
                >
                  COMO CHEGAR
                </a>
                <BotaoPrototipo className="flex-1 border border-tela/35 px-6 py-3.5 text-center font-display tracking-wide transition-colors hover:border-tela hover:bg-tela hover:text-sala">
                  CHAMAR NO ZAP
                </BotaoPrototipo>
              </div>
            </div>
          </Revelar>

          <Revelar atraso={0.1}>
            <div className="h-full min-h-[340px] overflow-hidden border border-tela/15">
              <iframe
                title={`Mapa com a localização da ${negocio.nome} em ${negocio.endereco.bairro}`}
                src={links.mapaEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[340px] w-full"
              />
            </div>
            <p className="mt-3 text-sm text-tela/65">{enderecoCompleto}</p>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
