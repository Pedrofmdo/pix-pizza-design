import { LogoPix } from "./LogoPix";
import { enderecoCompleto, links, negocio } from "@/data/pixpizza";

/*
  Sem o WhatsApp da pizzaria: este protótipo não pode despejar pedido nenhum
  no número dela. O que sobrou são páginas públicas da Pix Pizza, cada uma
  claramente identificada como de terceiros ao abrir.
*/
const canais = [
  { href: links.instagram, rotulo: "Instagram" },
  { href: links.cardapio, rotulo: "Cardápio online" },
  { href: links.ifood, rotulo: "iFood" },
];

export function Rodape() {
  return (
    <footer className="border-t border-pix/30 bg-sala px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <LogoPix className="h-16 w-16" />
            <p className="mt-4 font-display text-2xl leading-none tracking-wide">
              {negocio.chamada.toUpperCase()}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-tela/60">
              {enderecoCompleto}
            </p>
          </div>

          <nav aria-label="Canais de atendimento">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-pix-claro">
              Peça por aqui
            </h2>
            <ul className="mt-4 space-y-2.5">
              {canais.map((c) => (
                <li key={c.rotulo}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tela/75 transition-colors hover:text-pix"
                  >
                    {c.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-pix-claro">
              Atendimento
            </h2>
            {/* Texto, não link: ver o comentário em Onde.tsx. */}
            <p className="mt-4 font-mono text-xl tabular-nums">
              {negocio.telefoneFormatado}
            </p>
            <p className="mt-2 text-sm text-tela/60">
              Todos os dias
              <br />
              das 17h30 às 4h30
            </p>
          </div>
        </div>

        <div className="lampadas mt-12 h-2 w-full animate-lampada" aria-hidden />

        {/* O © de antes dizia "© Pix Pizza", como se a pizzaria fosse dona
            deste site. Ela não é — e é justamente o que precisa ficar claro. */}
        <div className="mt-6 space-y-1.5 text-xs leading-relaxed text-tela/60">
          <p className="text-amber-300/90">
            Protótipo conceitual criado por Pedro Oliveira em{" "}
            {new Date().getFullYear()}. Não é o site oficial da {negocio.nome} e
            não recebe pedidos.
          </p>
          <p>
            Marca, cardápio, preços e fotos pertencem à {negocio.nome} ·{" "}
            {negocio.endereco.bairro}, {negocio.endereco.cidade}/
            {negocio.endereco.estado}
          </p>
        </div>
      </div>
    </footer>
  );
}
