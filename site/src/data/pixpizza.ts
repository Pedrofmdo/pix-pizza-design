/**
 * Dados reais da Pix Pizza.
 *
 * Origem de cada bloco:
 * - Bio, logo e identidade: instagram.com/pix.pizza
 * - Endereço e nota: ficha "Pix Pizzaria JP" no Google Maps
 * - Preços e sabores: cardápio oficial em instadelivery.com.br/pixpizza
 *
 * Ao atualizar preços, mexa só neste arquivo — nenhum componente tem valor fixo.
 */

export const negocio = {
  nome: "Pix Pizza",
  nomeMaps: "Pix Pizzaria JP",
  chamada: "Tua fome pede a Favorita!",
  descricao: "Pizzaria em João Pessoa",
  telefone: "+5583999340514",
  telefoneFormatado: "(83) 99934-0514",
  endereco: {
    rua: "R. Franca Filho, 488",
    bairro: "Manaíra",
    cidade: "João Pessoa",
    estado: "PB",
    cep: "58038-150",
    latitude: -7.1042,
    longitude: -34.8285,
  },
  nota: 4.5,
  seguidores: "19,2 mil",
  abre: "17:30",
  fecha: "04:30",
} as const;

export const enderecoCompleto = `${negocio.endereco.rua} - ${negocio.endereco.bairro}, ${negocio.endereco.cidade} - ${negocio.endereco.estado}, ${negocio.endereco.cep}`;

/* ------------------------------------------------------------------ *
 * Regras de pedido
 * ------------------------------------------------------------------ */

export const regras = {
  /** Confirmado no cardápio oficial. */
  entregaGratisAcima: 200,
  /**
   * A pizzaria calcula a taxa por bairro e não publica a tabela, então o site
   * não inventa um valor: fecha no WhatsApp junto com a confirmação.
   */
  taxaEntrega: null as number | null,
  /**
   * Em pizza de 2 sabores vale o acréscimo do sabor mais caro — convenção da
   * casa. Se a Pix Pizza cobrar a média, troque para "media".
   */
  cobrancaDoisSabores: "maior" as "maior" | "media",
};

/* ------------------------------------------------------------------ *
 * Pagamento
 * ------------------------------------------------------------------ */

/**
 * Dados do recebedor do Pix.
 *
 * A CHAVE PRECISA SER A REAL DA PIZZARIA. Enquanto `NEXT_PUBLIC_PIX_CHAVE`
 * não estiver definida, o site esconde a opção de pagar no Pix e oferece só
 * pagamento na entrega — é melhor faltar uma forma de pagamento do que gerar
 * um código que manda dinheiro para a conta errada.
 */
export const pix = {
  chave: process.env.NEXT_PUBLIC_PIX_CHAVE ?? "",
  // Máx. 25 caracteres no padrão do Banco Central.
  recebedor: process.env.NEXT_PUBLIC_PIX_RECEBEDOR ?? "PIX PIZZA",
  // Máx. 15 caracteres.
  cidade: "JOAO PESSOA",
} as const;

export const pixConfigurado = pix.chave.trim().length > 0;

export type FormaPagamento = "pix" | "cartao" | "dinheiro";

export const formasPagamento: {
  id: FormaPagamento;
  rotulo: string;
  nota: string;
}[] = [
  {
    id: "pix",
    rotulo: "Pix",
    nota: "Copie o código, pague no seu banco e mande o comprovante no WhatsApp.",
  },
  {
    id: "cartao",
    rotulo: "Cartão na entrega",
    nota: "A maquininha vai junto com o pedido.",
  },
  {
    id: "dinheiro",
    rotulo: "Dinheiro na entrega",
    nota: "Avise se precisa de troco.",
  },
];

/* ------------------------------------------------------------------ *
 * Links
 * ------------------------------------------------------------------ */

/*
  Sem `whatsapp`/`whatsappNumero` de propósito. Este é um protótipo não
  autorizado: se o link existir aqui, uma tela nova volta a mandar pedido de
  mentira para o número real da pizzaria. Não recolocar sem autorização dela.
*/
export const links = {
  cardapio: "https://instadelivery.com.br/pixpizza",
  instagram: "https://www.instagram.com/pix.pizza/",
  ifood:
    "https://www.ifood.com.br/delivery/joao-pessoa-pb/pix-pizza-manaira/a5597830-7bde-4eb8-b642-f8632a5c09a3",
  rotas: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${negocio.nomeMaps}, ${enderecoCompleto}`,
  )}`,
  mapaEmbed: `https://www.google.com/maps?q=${encodeURIComponent(
    `${negocio.nomeMaps}, ${enderecoCompleto}`,
  )}&output=embed`,
} as const;

/* ------------------------------------------------------------------ *
 * Cardápio
 * ------------------------------------------------------------------ */

export type Categoria = "tradicional" | "especial" | "doce";

export type Sabor = {
  id: string;
  nome: string;
  ingredientes: string;
  categoria: Categoria;
  /** Acréscimo em reais sobre o preço base da pizza, quando houver. */
  adicional?: number;
};

export type Tamanho = {
  id: "pequena" | "grande";
  nome: string;
  preco: number;
  maxSabores: number;
  detalhe: string;
};

export const tamanhos: Tamanho[] = [
  {
    id: "pequena",
    nome: "Pizza Pequena",
    preco: 30,
    maxSabores: 1,
    detalhe: "1 sabor",
  },
  {
    id: "grande",
    nome: "Pizza Grande",
    preco: 50,
    maxSabores: 2,
    detalhe: "até 2 sabores",
  },
];

/**
 * Refrigerantes que acompanham os combos. As opções vêm da descrição dos
 * próprios combos no cardápio oficial ("Guaraná ou Pepsi").
 */
export const refrigerantes = ["Guaraná", "Pepsi"] as const;
export type Refrigerante = (typeof refrigerantes)[number];

export type Combo = {
  id: string;
  nome: string;
  preco: number;
  inclui: string;
  destaque?: string;
  /**
   * Uma entrada por pizza que vem no combo, na ordem em que o cliente escolhe.
   * O tamanho define quantos sabores aquela pizza aceita.
   */
  pizzas: Tamanho["id"][];
  /** Quantos refrigerantes acompanham. 0 quando o combo não tem bebida. */
  refrigerantes: number;
  /** Volume da bebida, como aparece no cardápio deles. */
  bebida?: string;
};

/**
 * A composição de cada combo foi lida direto do cardápio oficial
 * (instadelivery.com.br/pixpizza), item por item.
 */
export const combos: Combo[] = [
  {
    id: "combo-pequena-refri",
    nome: "Combo Pequena + Refri",
    preco: 35,
    inclui: "Pizza pequena de 4 fatias + refrigerante lata",
    destaque: "Novidade",
    pizzas: ["pequena"],
    refrigerantes: 1,
    bebida: "lata",
  },
  {
    id: "combo-01",
    nome: "Combo 01",
    preco: 59.9,
    inclui: "1 pizza grande + 1 refrigerante 1L",
    pizzas: ["grande"],
    refrigerantes: 1,
    bebida: "1L",
  },
  {
    id: "combo-02",
    nome: "Combo 02",
    preco: 79.9,
    inclui: "1 pizza grande + 1 pizza pequena + 1 refrigerante 1L",
    pizzas: ["grande", "pequena"],
    refrigerantes: 1,
    bebida: "1L",
  },
  {
    id: "combo-03",
    nome: "Combo 03",
    preco: 94.9,
    inclui: "2 pizzas grandes + 1 refrigerante 1L",
    pizzas: ["grande", "grande"],
    refrigerantes: 1,
    bebida: "1L",
  },
  {
    id: "combo-04",
    nome: "Combo 04",
    preco: 139.9,
    inclui: "3 pizzas grandes + 2 refrigerantes 1L",
    pizzas: ["grande", "grande", "grande"],
    refrigerantes: 2,
    bebida: "1L",
  },
];

/** Seleção do cardápio oficial. A lista completa fica no link de pedidos. */
export const sabores: Sabor[] = [
  {
    id: "nordestina",
    nome: "Nordestina",
    ingredientes:
      "Molho de tomate, mussarela, orégano, carne desfiada, bacon, cebola e queijo coalho",
    categoria: "especial",
    adicional: 6,
  },
  {
    id: "pepperoni",
    nome: "Pepperoni",
    ingredientes: "Molho de tomate, mussarela, orégano e pepperoni em rodelas",
    categoria: "especial",
    adicional: 6,
  },
  {
    id: "camarao-nordestino",
    nome: "Camarão nordestino",
    ingredientes:
      "Molho de tomate, mussarela, orégano, carne desfiada, filé de camarão e cebola",
    categoria: "especial",
    adicional: 7.5,
  },
  {
    id: "carne-de-sol-na-nata",
    nome: "Carne de sol na nata",
    ingredientes: "Mussarela, carne seca, cebola e cream cheese",
    categoria: "especial",
    adicional: 6,
  },
  {
    id: "file-cebola-caramelizada",
    nome: "Filé com cebola caramelizada",
    ingredientes:
      "Molho de tomate, mussarela, orégano, filé em tiras, cebola caramelizada e gorgonzola",
    categoria: "especial",
    adicional: 6,
  },
  {
    id: "calabresa-acebolada",
    nome: "Calabresa acebolada",
    ingredientes: "Molho de tomate, mussarela, orégano, calabresa e cebola",
    categoria: "tradicional",
  },
  {
    id: "quatro-queijos",
    nome: "Quatro queijos",
    ingredientes:
      "Molho de tomate, mussarela, orégano, catupiry, provolone e gorgonzola",
    categoria: "tradicional",
  },
  {
    id: "frango-catupiry",
    nome: "Frango catupiry",
    ingredientes:
      "Molho de tomate, mussarela, orégano, frango desfiado e catupiry",
    categoria: "tradicional",
  },
  {
    id: "portuguesa",
    nome: "Portuguesa",
    ingredientes: "Molho de tomate, mussarela, orégano, presunto, cebola e ovo",
    categoria: "tradicional",
  },
  {
    id: "baiana-apimentada",
    nome: "Baiana apimentada",
    ingredientes:
      "Molho de tomate, mussarela, orégano, calabresa, cebola, pimenta calabresa e azeitona",
    categoria: "tradicional",
  },
  {
    id: "marguerita",
    nome: "Marguerita",
    ingredientes:
      "Molho de tomate, mussarela, orégano, tomate em rodelas e manjericão",
    categoria: "tradicional",
  },
  {
    id: "romeu-e-julieta",
    nome: "Romeu e Julieta",
    ingredientes: "Goiabada e queijo",
    categoria: "doce",
  },
  {
    id: "cartola",
    nome: "Cartola",
    ingredientes: "Banana fatiada, canela, queijo e leite condensado",
    categoria: "doce",
  },
  {
    id: "dois-amores",
    nome: "Dois amores",
    ingredientes: "Chocolate branco e chocolate ao leite",
    categoria: "doce",
  },
  {
    id: "prestigio",
    nome: "Prestígio",
    ingredientes: "Chocolate derretido, coco ralado e leite condensado",
    categoria: "doce",
  },
];

export const categorias: { id: Categoria; rotulo: string; nota: string }[] = [
  { id: "tradicional", rotulo: "Tradicional", nota: "Sem acréscimo no preço." },
  {
    id: "especial",
    rotulo: "Especial",
    nota: "Acréscimo a partir de R$ 6,00.",
  },
  { id: "doce", rotulo: "Doce", nota: "Para fechar a noite." },
];

/* ------------------------------------------------------------------ *
 * Imagens
 * ------------------------------------------------------------------ */

export const galeria = [
  {
    src: "/img/ig-3.jpg",
    alt: "Casal dividindo uma pizza no salão da Pix Pizza",
    larga: true,
  },
  {
    src: "/img/ig-7.jpg",
    alt: "Clientes na mesa do salão da Pix Pizza",
    larga: false,
  },
  {
    src: "/img/ig-6.jpg",
    alt: "Pizza grande recém-saída do forno, vista de cima",
    larga: false,
  },
  {
    src: "/img/ig-11.jpg",
    alt: "Fatias de pizza sendo divididas entre amigos",
    larga: false,
  },
  {
    src: "/img/ig-12.jpg",
    alt: "Duas pessoas rindo enquanto comem pizza no salão",
    larga: true,
  },
  {
    src: "/img/ig-10.jpg",
    alt: "Cliente comendo uma fatia da Pix Pizza",
    larga: false,
  },
];

export function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
