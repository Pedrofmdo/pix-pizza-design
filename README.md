# Pix Pizza — site e pedidos

Site institucional e sistema de pedidos da **Pix Pizza**, pizzaria em Manaíra,
João Pessoa/PB. O cliente monta a pizza ou escolhe um combo, paga no Pix e
confirma no WhatsApp — tudo pelo site, sem backend.

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

## Antes de publicar

O site **não mostra pagamento por Pix enquanto `NEXT_PUBLIC_PIX_CHAVE` estiver
vazia** — é proposital, para nunca gerar um código que mande dinheiro para a
conta errada. Preencha a chave real antes de colocar no ar.

As demais pendências (fotos em alta, taxa de entrega por bairro, regra de dois
sabores) estão listadas no README do `site/`.
