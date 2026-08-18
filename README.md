# Pix Pizza — protótipo conceitual

> **Não é o site oficial da Pix Pizza.** Protótipo criado por Pedro Oliveira,
> por conta própria e sem autorização da pizzaria, como demonstração comercial.
> A marca, o cardápio, os preços e as fotos pertencem à Pix Pizza.

Demonstração de site e sistema de pedidos para a **Pix Pizza**, pizzaria em
Manaíra, João Pessoa/PB. O visitante monta a pizza ou escolhe um combo e vê o
preço na hora — mas **nenhum pedido é enviado**: o passo final abre um aviso
explicando que é um protótipo.

🔗 Instagram da pizzaria: [@pix.pizza](https://www.instagram.com/pix.pizza/)

## Estrutura

```
site/     aplicação Next.js (é aqui que está tudo)
```

A documentação técnica completa — como rodar, como configurar a chave Pix, onde
mexer em preço e cardápio, e as pendências para o cliente — está em
[`site/README.md`](site/README.md).

## Começando

```bash
cd site
npm install
cp .env.example .env.local   # preencha a chave Pix da pizzaria
npm run dev
```

## O que mantém isto como demonstração

Enquanto não houver autorização da Pix Pizza, estes pontos não devem ser
desfeitos:

- **`robots: { index: false, follow: false }`** em `site/src/app/layout.tsx` e
  `Disallow: /` em `site/public/robots.txt` — nenhum buscador indexa o
  protótipo como se fosse o site da pizzaria.
- **Título e Open Graph** dizem "Demonstração … não oficial", então uma prévia
  de link no WhatsApp ou no Instagram já se anuncia como protótipo.
- **Nenhum dado estruturado** (`schema.org/Restaurant`): o JSON-LD antigo
  declarava este endereço como a ficha oficial da pizzaria, telefone e nota
  inclusive.
- **Faixa fixa no topo** (`site/src/components/prototipo/FaixaDemo.tsx`), em
  todas as telas e sem sumir ao rolar.
- **Nenhum link `wa.me` ou `tel:`** para o número da pizzaria. `links.whatsapp`
  foi removido de `site/src/data/pixpizza.ts` justamente para não voltar por
  descuido. O envio final abre o aviso de protótipo.
- **A chave Pix segue vazia.** Sem `NEXT_PUBLIC_PIX_CHAVE` o site esconde o
  pagamento por Pix — e num protótipo é assim que tem de ficar, senão o QR
  levaria dinheiro real para algum lugar.

O que ficou de propósito: endereço, telefone como **texto**, mapa do Google e
links para Instagram, iFood e cardápio online. É tudo informação pública da
pizzaria, e cada link externo abre num domínio de terceiro claramente
identificado.

As pendências de produto (fotos em alta, taxa de entrega por bairro, regra de
dois sabores) estão no README do `site/`.
