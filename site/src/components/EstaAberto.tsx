"use client";

import { useEffect, useState } from "react";
import { negocio } from "@/data/pixpizza";

/**
 * Diz se a pizzaria está aberta agora. O horário é 17h30 às 4h30, ou seja,
 * cruza a meia-noite — por isso a janela é testada em minutos absolutos e
 * dividida em dois trechos.
 *
 * O relógio é sempre o de João Pessoa (America/Recife, sem horário de verão),
 * não o do visitante: quem abre o site de outro fuso precisa saber se a
 * pizzaria está aberta lá, não aqui.
 */
function minutosEmJoaoPessoa(agora: Date) {
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(agora);

  const hora = Number(partes.find((p) => p.type === "hour")?.value ?? "0");
  const minuto = Number(partes.find((p) => p.type === "minute")?.value ?? "0");
  return hora * 60 + minuto;
}

function paraMinutos(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function EstaAberto({ className }: { className?: string }) {
  const [aberto, setAberto] = useState<boolean | null>(null);

  useEffect(() => {
    const verificar = () => {
      const agora = minutosEmJoaoPessoa(new Date());
      const abre = paraMinutos(negocio.abre);
      const fecha = paraMinutos(negocio.fecha);
      // Janela que vira o dia: vale das 17h30 à meia-noite OU da meia-noite às 4h30.
      setAberto(agora >= abre || agora < fecha);
    };

    verificar();
    const id = setInterval(verificar, 60_000);
    return () => clearInterval(id);
  }, []);

  // Antes da hidratação não dá para saber a hora do visitante sem causar
  // divergência com o HTML do servidor, então o rótulo só aparece depois.
  if (aberto === null) {
    return <span className={className} aria-hidden />;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest ${className ?? ""}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          aberto ? "bg-pix shadow-[0_0_10px_#f80018]" : "bg-poeira"
        }`}
        aria-hidden
      />
      {aberto ? "Aberto agora" : `Fechado · abre ${negocio.abre.replace(":", "h")}`}
    </span>
  );
}
