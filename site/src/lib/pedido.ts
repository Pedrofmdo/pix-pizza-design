import type { ItemCarrinho } from "@/components/carrinho/contexto";
import {
  formatarPreco,
  negocio,
  regras,
  type FormaPagamento,
} from "@/data/pixpizza";

export type DadosCliente = {
  nome: string;
  telefone: string;
  entrega: boolean;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  referencia: string;
  pagamento: FormaPagamento;
  trocoPara: string;
  observacao: string;
};

export const clienteVazio: DadosCliente = {
  nome: "",
  telefone: "",
  entrega: true,
  rua: "",
  numero: "",
  bairro: "",
  complemento: "",
  referencia: "",
  pagamento: "pix",
  trocoPara: "",
  observacao: "",
};

/**
 * Código curto do pedido. Serve de txid no Pix e de referência na conversa,
 * para a pizzaria casar o comprovante com o pedido certo.
 */
export function gerarCodigoPedido(data = new Date()) {
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PIX${dia}${mes}${aleatorio}`;
}

export function validar(cliente: DadosCliente) {
  const erros: Partial<Record<keyof DadosCliente, string>> = {};

  if (cliente.nome.trim().length < 2) {
    erros.nome = "Escreva seu nome para a entrega.";
  }

  const digitos = cliente.telefone.replace(/\D/g, "");
  if (digitos.length < 10 || digitos.length > 11) {
    erros.telefone = "Informe o WhatsApp com DDD, por exemplo (83) 99999-0000.";
  }

  if (cliente.entrega) {
    if (!cliente.rua.trim()) erros.rua = "Informe a rua.";
    if (!cliente.numero.trim()) erros.numero = "Informe o número.";
    if (!cliente.bairro.trim()) erros.bairro = "Informe o bairro.";
  }

  if (cliente.pagamento === "dinheiro" && cliente.trocoPara.trim()) {
    const valor = Number(cliente.trocoPara.replace(",", "."));
    if (!Number.isFinite(valor) || valor <= 0) {
      erros.trocoPara = "Escreva só o valor, por exemplo 100.";
    }
  }

  return erros;
}

const rotuloPagamento: Record<FormaPagamento, string> = {
  pix: "Pix (pago antes)",
  cartao: "Cartão na entrega",
  dinheiro: "Dinheiro na entrega",
};

export function montarMensagem({
  itens,
  subtotal,
  cliente,
  codigo,
}: {
  itens: ItemCarrinho[];
  subtotal: number;
  cliente: DadosCliente;
  codigo: string;
}) {
  const linhas: string[] = [];

  linhas.push(`*Pedido ${codigo}* — ${negocio.nome}`);
  linhas.push("");

  for (const item of itens) {
    linhas.push(
      `${item.quantidade}x ${item.nome} — ${formatarPreco(
        item.precoUnitario * item.quantidade,
      )}`,
    );
  }

  linhas.push("");
  linhas.push(`*Subtotal:* ${formatarPreco(subtotal)}`);

  if (cliente.entrega) {
    if (subtotal >= regras.entregaGratisAcima) {
      linhas.push("*Entrega:* grátis (pedido acima de R$ " + regras.entregaGratisAcima + ")");
    } else if (regras.taxaEntrega !== null) {
      linhas.push(`*Entrega:* ${formatarPreco(regras.taxaEntrega)}`);
    } else {
      linhas.push("*Entrega:* a combinar");
    }
  } else {
    linhas.push("*Retirada no balcão*");
  }

  linhas.push(`*Pagamento:* ${rotuloPagamento[cliente.pagamento]}`);

  if (cliente.pagamento === "dinheiro" && cliente.trocoPara.trim()) {
    linhas.push(`*Troco para:* R$ ${cliente.trocoPara.trim()}`);
  }

  linhas.push("");
  linhas.push(`*Nome:* ${cliente.nome.trim()}`);
  linhas.push(`*WhatsApp:* ${cliente.telefone.trim()}`);

  if (cliente.entrega) {
    const endereco = [
      `${cliente.rua.trim()}, ${cliente.numero.trim()}`,
      cliente.complemento.trim(),
      cliente.bairro.trim(),
    ]
      .filter(Boolean)
      .join(" — ");
    linhas.push(`*Endereço:* ${endereco}`);
    if (cliente.referencia.trim()) {
      linhas.push(`*Referência:* ${cliente.referencia.trim()}`);
    }
  }

  if (cliente.observacao.trim()) {
    linhas.push("");
    linhas.push(`*Observação:* ${cliente.observacao.trim()}`);
  }

  if (cliente.pagamento === "pix") {
    linhas.push("");
    linhas.push("Já paguei no Pix. Vou mandar o comprovante aqui.");
  }

  return linhas.join("\n");
}
