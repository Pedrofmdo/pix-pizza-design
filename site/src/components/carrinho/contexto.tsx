"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { regras } from "@/data/pixpizza";

export type ItemCarrinho = {
  /** Único por configuração: duas pizzas iguais somam quantidade. */
  id: string;
  nome: string;
  detalhe: string;
  precoUnitario: number;
  quantidade: number;
};

type Acao =
  | { tipo: "adicionar"; item: Omit<ItemCarrinho, "quantidade"> }
  | { tipo: "remover"; id: string }
  | { tipo: "alterarQuantidade"; id: string; delta: number }
  | { tipo: "limpar" }
  | { tipo: "restaurar"; itens: ItemCarrinho[] };

function reduzir(estado: ItemCarrinho[], acao: Acao): ItemCarrinho[] {
  switch (acao.tipo) {
    case "adicionar": {
      const existente = estado.find((i) => i.id === acao.item.id);
      if (existente) {
        return estado.map((i) =>
          i.id === acao.item.id ? { ...i, quantidade: i.quantidade + 1 } : i,
        );
      }
      return [...estado, { ...acao.item, quantidade: 1 }];
    }
    case "alterarQuantidade":
      return estado
        .map((i) =>
          i.id === acao.id
            ? { ...i, quantidade: i.quantidade + acao.delta }
            : i,
        )
        .filter((i) => i.quantidade > 0);
    case "remover":
      return estado.filter((i) => i.id !== acao.id);
    case "limpar":
      return [];
    case "restaurar":
      return acao.itens;
  }
}

const CHAVE_ARMAZENAMENTO = "pixpizza:carrinho";

type ValorContexto = {
  itens: ItemCarrinho[];
  subtotal: number;
  quantidadeTotal: number;
  entregaGratis: boolean;
  faltaParaEntregaGratis: number;
  aberto: boolean;
  abrir: () => void;
  fechar: () => void;
  adicionar: (item: Omit<ItemCarrinho, "quantidade">) => void;
  alterarQuantidade: (id: string, delta: number) => void;
  remover: (id: string) => void;
  limpar: () => void;
};

const Contexto = createContext<ValorContexto | null>(null);

export function ProvedorCarrinho({ children }: { children: ReactNode }) {
  const [itens, despachar] = useReducer(reduzir, []);
  const [aberto, setAberto] = useState(false);
  // Ref, não state: só marca que a leitura inicial já aconteceu e não deve
  // provocar um render a mais.
  const hidratado = useRef(false);

  // O carrinho sobrevive a um refresh: quem estava montando a pizza não perde
  // o que já escolheu. A leitura fica no efeito porque o servidor renderiza
  // sempre com o carrinho vazio.
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
      if (salvo) despachar({ tipo: "restaurar", itens: JSON.parse(salvo) });
    } catch {
      // Armazenamento indisponível (aba anônima, cota cheia): segue sem histórico.
    }
    hidratado.current = true;
  }, []);

  useEffect(() => {
    if (!hidratado.current) return;
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(itens));
    } catch {
      // Não vale quebrar o pedido por causa do armazenamento.
    }
  }, [itens]);

  // Trava a rolagem do fundo enquanto o painel do carrinho está aberto.
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const adicionar = useCallback(
    (item: Omit<ItemCarrinho, "quantidade">) => {
      despachar({ tipo: "adicionar", item });
      setAberto(true);
    },
    [],
  );

  const valor = useMemo<ValorContexto>(() => {
    const subtotal = itens.reduce(
      (soma, i) => soma + i.precoUnitario * i.quantidade,
      0,
    );
    return {
      itens,
      subtotal,
      quantidadeTotal: itens.reduce((soma, i) => soma + i.quantidade, 0),
      entregaGratis: subtotal >= regras.entregaGratisAcima,
      faltaParaEntregaGratis: Math.max(0, regras.entregaGratisAcima - subtotal),
      aberto,
      abrir: () => setAberto(true),
      fechar: () => setAberto(false),
      adicionar,
      alterarQuantidade: (id, delta) =>
        despachar({ tipo: "alterarQuantidade", id, delta }),
      remover: (id) => despachar({ tipo: "remover", id }),
      limpar: () => despachar({ tipo: "limpar" }),
    };
  }, [itens, aberto, adicionar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrinho() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useCarrinho precisa estar dentro de <ProvedorCarrinho>");
  }
  return contexto;
}
