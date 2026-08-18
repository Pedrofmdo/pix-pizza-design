"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const AVISO_PROTOTIPO =
  "Este é um protótipo. O pedido não é enviado para a pizzaria.";

/**
 * O aviso que substituiu o envio real do pedido. Controlado por props porque
 * há dois caminhos até ele: um botão que abre direto (`BotaoPrototipo`) e o
 * checkout, que só avisa depois de validar o formulário — lá o fluxo visual
 * precisa continuar inteiro, e só o envio final para.
 *
 * `detalhe` mostra, quando existe, a mensagem que o site montaria. Demonstra
 * o recurso sem disparar nada.
 */
export function AvisoPrototipo({
  aberto,
  aoFechar,
  detalhe,
}: {
  aberto: boolean;
  aoFechar: () => void;
  detalhe?: string;
}) {
  const dialogo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoFechar]);

  // Ao abrir, o foco entra no diálogo para o teclado não continuar no fundo.
  useEffect(() => {
    if (aberto) dialogo.current?.focus();
  }, [aberto]);

  if (!aberto) return null;

  return (
    /* z-60: acima do painel do carrinho (z-50), que é de onde este aviso
       costuma ser aberto. */
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aviso-prototipo-titulo"
    >
      <button
        type="button"
        aria-label="Fechar o aviso"
        onClick={aoFechar}
        className="absolute inset-0 bg-sala/85 backdrop-blur-sm"
      />

      <div
        ref={dialogo}
        tabIndex={-1}
        className="relative w-full max-w-md border border-amber-400/50 bg-fumaca p-6 outline-none sm:p-8"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-300">
          Protótipo
        </p>
        <h2
          id="aviso-prototipo-titulo"
          className="mt-3 font-display text-2xl leading-tight tracking-wide"
        >
          O PEDIDO NÃO FOI ENVIADO
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-tela/75">
          {AVISO_PROTOTIPO} Este site é uma demonstração conceitual criada por
          Pedro Oliveira e não tem ligação com a Pix Pizza. Para pedir de
          verdade, procure os canais oficiais da pizzaria.
        </p>

        {detalhe ? (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-tela/55">
              Mensagem que o site montaria
            </p>
            <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap break-words border border-tela/15 bg-sala p-3 font-mono text-[11px] leading-relaxed text-tela/70">
              {detalhe}
            </pre>
          </div>
        ) : null}

        <button
          type="button"
          onClick={aoFechar}
          className="mt-6 w-full bg-pix-fundo px-6 py-3.5 font-display tracking-wide text-tela transition-colors hover:bg-pix"
        >
          ENTENDI
        </button>
      </div>
    </div>
  );
}

/**
 * Substitui os botões que antes abriam o WhatsApp da pizzaria: mesma aparência,
 * mesmo lugar, mas abre o aviso em vez de uma conversa real.
 */
export function BotaoPrototipo({
  className,
  children,
  detalhe,
}: {
  className?: string;
  children: React.ReactNode;
  detalhe?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const gatilho = useRef<HTMLButtonElement>(null);

  // Fechar devolve o foco ao botão que abriu, senão o teclado volta ao topo.
  const fechar = useCallback(() => {
    setAberto(false);
    gatilho.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={gatilho}
        type="button"
        onClick={() => setAberto(true)}
        className={className}
      >
        {children}
      </button>
      <AvisoPrototipo aberto={aberto} aoFechar={fechar} detalhe={detalhe} />
    </>
  );
}
