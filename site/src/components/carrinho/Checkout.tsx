"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { useCarrinho } from "./contexto";
import { gerarBrCode } from "@/lib/brcode";
import {
  clienteVazio,
  gerarCodigoPedido,
  linkWhatsApp,
  montarMensagem,
  validar,
  type DadosCliente,
} from "@/lib/pedido";
import {
  formatarPreco,
  formasPagamento,
  pix,
  pixConfigurado,
  regras,
} from "@/data/pixpizza";

const campoBase =
  "w-full border border-tela/25 bg-sala px-3 py-2.5 text-tela placeholder:text-tela/35 focus:border-pix";

function Campo({
  id,
  rotulo,
  erro,
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs uppercase tracking-wider text-tela/65"
      >
        {rotulo}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="mt-1.5 text-xs text-pix">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

export function Checkout() {
  const { itens, subtotal, limpar } = useCarrinho();
  const [cliente, setCliente] = useState<DadosCliente>(() => ({
    ...clienteVazio,
    // Sem chave Pix configurada, o padrão passa a ser pagar na entrega.
    pagamento: pixConfigurado ? "pix" : "cartao",
  }));
  const [erros, setErros] = useState<Partial<Record<keyof DadosCliente, string>>>(
    {},
  );
  const [codigo] = useState(() => gerarCodigoPedido());
  const [pagando, setPagando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  function atualizar<K extends keyof DadosCliente>(
    chave: K,
    valor: DadosCliente[K],
  ) {
    setCliente((atual) => ({ ...atual, [chave]: valor }));
    setErros((atuais) => ({ ...atuais, [chave]: undefined }));
  }

  const brcode = useMemo(() => {
    if (!pixConfigurado || subtotal <= 0) return "";
    return gerarBrCode({
      chave: pix.chave,
      recebedor: pix.recebedor,
      cidade: pix.cidade,
      valor: subtotal,
      identificador: codigo,
    });
  }, [subtotal, codigo]);

  useEffect(() => {
    if (!pagando || !brcode) return;
    QRCode.toDataURL(brcode, {
      margin: 1,
      width: 320,
      color: { dark: "#0a0708", light: "#f8f8f8" },
    })
      .then(setQr)
      .catch(() => setQr(null));
  }, [pagando, brcode]);

  const mensagem = montarMensagem({ itens, subtotal, cliente, codigo });
  const linkZap = linkWhatsApp(mensagem);

  function avancar() {
    const encontrados = validar(cliente);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      const primeiro = Object.keys(encontrados)[0];
      document.getElementById(primeiro)?.focus();
      return;
    }
    if (cliente.pagamento === "pix") setPagando(true);
    else window.open(linkZap, "_blank", "noopener");
  }

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(brcode);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sem permissão de área de transferência: o código continua visível
      // na tela para seleção manual.
    }
  }

  const opcoesPagamento = formasPagamento.filter(
    (f) => f.id !== "pix" || pixConfigurado,
  );

  /* ---------------- Tela de pagamento Pix ---------------- */
  if (pagando) {
    return (
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-pix-claro">
          Pedido {codigo}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight tracking-wide">
          PAGUE {formatarPreco(subtotal)} NO PIX
        </h3>

        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qr}
            alt={`QR Code do Pix no valor de ${formatarPreco(subtotal)}`}
            width={320}
            height={320}
            className="mx-auto mt-5 w-full max-w-[16rem] border-4 border-tela"
          />
        ) : (
          <div className="mx-auto mt-5 flex aspect-square w-full max-w-[16rem] items-center justify-center border border-tela/20 text-sm text-tela/55">
            Gerando o QR Code…
          </div>
        )}

        <p className="mt-5 text-xs uppercase tracking-wider text-tela/60">
          Ou copie o código
        </p>
        <p className="mt-2 max-h-24 overflow-y-auto break-all border border-tela/20 bg-sala p-3 font-mono text-[11px] leading-relaxed text-tela/80">
          {brcode}
        </p>

        <button
          type="button"
          onClick={copiarCodigo}
          className="mt-3 w-full border border-tela/35 px-6 py-3.5 font-display tracking-wide transition-colors hover:border-tela hover:bg-tela hover:text-sala"
        >
          {copiado ? "CÓDIGO COPIADO" : "COPIAR CÓDIGO PIX"}
        </button>
        <span aria-live="polite" className="sr-only">
          {copiado ? "Código Pix copiado" : ""}
        </span>

        <div className="mt-6 border-t border-tela/15 pt-5">
          <p className="text-sm leading-relaxed text-tela/70">
            Depois de pagar, mande o comprovante no WhatsApp. O pedido só entra
            na fila depois da confirmação.
          </p>
          <a
            href={linkZap}
            target="_blank"
            rel="noopener noreferrer"
            onClick={limpar}
            className="mt-4 block w-full bg-pix-fundo px-6 py-4 text-center font-display text-lg tracking-wide text-tela transition-colors hover:bg-pix"
          >
            JÁ PAGUEI — ENVIAR NO ZAP
          </a>
        </div>
      </div>
    );
  }

  /* ---------------- Formulário ---------------- */
  return (
    <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
      <div className="flex-1 space-y-5 px-5 py-5">
        <Campo id="nome" rotulo="Seu nome" erro={erros.nome}>
          <input
            id="nome"
            name="name"
            autoComplete="name"
            value={cliente.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            aria-invalid={Boolean(erros.nome)}
            aria-describedby={erros.nome ? "nome-erro" : undefined}
            className={campoBase}
            placeholder="Como te chamamos?"
          />
        </Campo>

        <Campo id="telefone" rotulo="WhatsApp" erro={erros.telefone}>
          <input
            id="telefone"
            name="tel"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={cliente.telefone}
            onChange={(e) => atualizar("telefone", e.target.value)}
            aria-invalid={Boolean(erros.telefone)}
            aria-describedby={erros.telefone ? "telefone-erro" : undefined}
            className={campoBase}
            placeholder="(83) 99999-0000"
          />
        </Campo>

        <fieldset>
          <legend className="mb-2 text-xs uppercase tracking-wider text-tela/65">
            Como você quer receber
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { valor: true, rotulo: "Entrega" },
              { valor: false, rotulo: "Retirar no balcão" },
            ].map((opcao) => (
              <label
                key={String(opcao.valor)}
                className={`cursor-pointer border px-4 py-3 text-center font-display tracking-wide transition-colors ${
                  cliente.entrega === opcao.valor
                    ? "border-pix bg-pix/10"
                    : "border-tela/20 hover:border-tela/50"
                }`}
              >
                <input
                  type="radio"
                  name="entrega"
                  checked={cliente.entrega === opcao.valor}
                  onChange={() => atualizar("entrega", opcao.valor)}
                  className="sr-only"
                />
                {opcao.rotulo.toUpperCase()}
              </label>
            ))}
          </div>
        </fieldset>

        {cliente.entrega ? (
          <div className="space-y-4 border-l-2 border-pix/40 pl-4">
            <div className="grid grid-cols-[1fr_5.5rem] gap-3">
              <Campo id="rua" rotulo="Rua" erro={erros.rua}>
                <input
                  id="rua"
                  name="address-line1"
                  autoComplete="address-line1"
                  value={cliente.rua}
                  onChange={(e) => atualizar("rua", e.target.value)}
                  aria-invalid={Boolean(erros.rua)}
                  className={campoBase}
                  placeholder="Av. Cabo Branco"
                />
              </Campo>
              <Campo id="numero" rotulo="Nº" erro={erros.numero}>
                <input
                  id="numero"
                  inputMode="numeric"
                  value={cliente.numero}
                  onChange={(e) => atualizar("numero", e.target.value)}
                  aria-invalid={Boolean(erros.numero)}
                  className={campoBase}
                  placeholder="488"
                />
              </Campo>
            </div>

            <Campo id="bairro" rotulo="Bairro" erro={erros.bairro}>
              <input
                id="bairro"
                name="address-level2"
                autoComplete="address-level2"
                value={cliente.bairro}
                onChange={(e) => atualizar("bairro", e.target.value)}
                aria-invalid={Boolean(erros.bairro)}
                className={campoBase}
                placeholder="Manaíra"
              />
            </Campo>

            <Campo id="complemento" rotulo="Complemento (opcional)">
              <input
                id="complemento"
                value={cliente.complemento}
                onChange={(e) => atualizar("complemento", e.target.value)}
                className={campoBase}
                placeholder="Apto 302, bloco B"
              />
            </Campo>

            <Campo id="referencia" rotulo="Ponto de referência (opcional)">
              <input
                id="referencia"
                value={cliente.referencia}
                onChange={(e) => atualizar("referencia", e.target.value)}
                className={campoBase}
                placeholder="Perto da praça"
              />
            </Campo>
          </div>
        ) : null}

        <fieldset>
          <legend className="mb-2 text-xs uppercase tracking-wider text-tela/65">
            Forma de pagamento
          </legend>
          <div className="space-y-2">
            {opcoesPagamento.map((forma) => (
              <label
                key={forma.id}
                className={`flex cursor-pointer flex-col border px-4 py-3 transition-colors ${
                  cliente.pagamento === forma.id
                    ? "border-pix bg-pix/10"
                    : "border-tela/20 hover:border-tela/50"
                }`}
              >
                <input
                  type="radio"
                  name="pagamento"
                  checked={cliente.pagamento === forma.id}
                  onChange={() => atualizar("pagamento", forma.id)}
                  className="sr-only"
                />
                <span className="font-display tracking-wide">
                  {forma.rotulo.toUpperCase()}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-tela/60">
                  {forma.nota}
                </span>
              </label>
            ))}
          </div>
          {!pixConfigurado ? (
            <p className="mt-2 text-xs leading-relaxed text-tela/60">
              {process.env.NODE_ENV === "development"
                ? "Pix desligado: defina NEXT_PUBLIC_PIX_CHAVE no .env.local com a chave real da pizzaria."
                : "Pagamento no Pix pelo site ainda não está ativo."}
            </p>
          ) : null}
        </fieldset>

        {cliente.pagamento === "dinheiro" ? (
          <Campo
            id="trocoPara"
            rotulo="Precisa de troco para quanto? (opcional)"
            erro={erros.trocoPara}
          >
            <input
              id="trocoPara"
              inputMode="decimal"
              value={cliente.trocoPara}
              onChange={(e) => atualizar("trocoPara", e.target.value)}
              aria-invalid={Boolean(erros.trocoPara)}
              className={campoBase}
              placeholder="100"
            />
          </Campo>
        ) : null}

        <Campo id="observacao" rotulo="Observação (opcional)">
          <textarea
            id="observacao"
            rows={3}
            value={cliente.observacao}
            onChange={(e) => atualizar("observacao", e.target.value)}
            className={`${campoBase} resize-y`}
            placeholder="Sem cebola, borda recheada, outro sabor do cardápio…"
          />
        </Campo>
      </div>

      <footer className="border-t border-tela/15 bg-fumaca px-5 py-5">
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-tela/60">Subtotal</dt>
            <dd className="font-mono tabular-nums">
              {formatarPreco(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-tela/60">Entrega</dt>
            <dd className="font-mono tabular-nums">
              {!cliente.entrega
                ? "retirada"
                : subtotal >= regras.entregaGratisAcima
                  ? "grátis"
                  : "a combinar"}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={avancar}
          className="mt-4 w-full bg-pix-fundo px-6 py-4 font-display text-lg tracking-wide text-tela transition-colors hover:bg-pix"
        >
          {cliente.pagamento === "pix"
            ? `PAGAR ${formatarPreco(subtotal)} NO PIX`
            : "ENVIAR PEDIDO NO ZAP"}
        </button>
      </footer>
    </div>
  );
}
