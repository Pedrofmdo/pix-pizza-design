# Site da Pix Pizza

Site e sistema de pedidos da Pix Pizza — pizzaria em Manaíra, João Pessoa/PB.
O cliente monta a pizza, paga no Pix e confirma no WhatsApp, tudo pelo site.

## Rodar

```bash
npm install
cp .env.example .env.local   # e preencha a chave Pix
npm run dev                  # http://localhost:3000
npm run build                # build de produção (estático)
```

A página é pré-renderizada como estática e o pedido roda inteiro no navegador —
não há backend, banco nem servidor de pagamento para manter. Dá para hospedar
em Vercel, Netlify ou qualquer host de arquivos.

## Configurar o Pix (obrigatório antes de publicar)

```bash
# .env.local
NEXT_PUBLIC_PIX_CHAVE=a-chave-real-da-pizzaria
NEXT_PUBLIC_PIX_RECEBEDOR=PIX PIZZA
```

**Sem essa variável o site esconde o pagamento por Pix** e oferece só cartão e
dinheiro na entrega. Isso é de propósito: é melhor faltar uma forma de
pagamento do que gerar um código que manda dinheiro para a conta errada.

A chave aceita qualquer formato do Banco Central: CPF, CNPJ, e-mail, telefone
ou chave aleatória. O nome do recebedor tem limite de 25 caracteres.

## Como funciona o pedido

1. **Montar** — o cliente escolhe tamanho e sabores. O preço recalcula na hora.
   Em pizza de dois sabores vale o acréscimo do sabor mais caro; a regra está em
   `regras.cobrancaDoisSabores` e pode virar média numa linha.
2. **Carrinho** — fica em `localStorage`, então sobrevive a um refresh.
3. **Checkout** — nome, WhatsApp, entrega ou retirada, endereço e forma de
   pagamento, com validação e foco no primeiro campo com erro.
4. **Pix** — o site gera o BR Code (padrão EMV do Banco Central) com o valor
   exato e um código de pedido como `txid`, mostra o QR e o copia-e-cola.
5. **WhatsApp** — o botão final abre a conversa com o pedido inteiro já escrito:
   itens, total, endereço, forma de pagamento e o código do pedido.

O código do Pix é gerado em `src/lib/brcode.ts`. O CRC16/CCITT-FALSE foi
conferido contra o vetor de teste padrão (`"123456789"` → `29B1`) e a estrutura
TLV foi validada campo a campo.

## Onde mexer

Preço, sabor, horário, endereço, telefone, links e regras de entrega estão todos
em **`src/data/pixpizza.ts`**. Nenhum componente tem valor fixo no meio do JSX.

| Arquivo | O que é |
| --- | --- |
| `src/data/pixpizza.ts` | Dados do negócio, cardápio, regras e links |
| `src/lib/brcode.ts` | Gerador do Pix copia-e-cola |
| `src/lib/pedido.ts` | Validação e a mensagem que vai para o WhatsApp |
| `src/components/carrinho/` | Estado do carrinho, painel lateral e checkout |
| `src/app/globals.css` | Paleta, fontes, o balão e o tratamento das fotos |
| `src/app/layout.tsx` | Metadados de SEO e o schema `Restaurant` |

## Identidade

A paleta foi amostrada das artes oficiais do Instagram (@pix.pizza), não
escolhida a olho:

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-pix` | `#f80018` | Vermelho da marca |
| `--color-pix-fundo` | `#c80008` | Fundo de botão (passa AA com texto branco) |
| `--color-pix-claro` | `#ff4d5e` | Só para rótulos pequenos sobre fundo escuro |
| `--color-sala` | `#0a0708` | Preto de fundo |
| `--color-fumaca` | `#16100f` | Superfícies elevadas |
| `--color-tela` | `#f8f8f8` | Branco |

Tipografia: **Anton** (display, reproduz o condensado pesado das artes deles),
**Barlow** (corpo) e **IBM Plex Mono** (preços e o código Pix).

O elemento que estrutura a página é o **balão de fala do logo** — a classe
`.balao` monta a rabicha como um triângulo real, então o balão continua correto
em qualquer largura. As fotos passam por `.cine` e `.cine-vinheta`: pretos mais
fundos, cor mais densa e queda de luz nas bordas, para foto de feed virar foto
de campanha sem mexer nas cores da marca.

## Pendências para o cliente

1. **Chave Pix.** Sem ela o pagamento pelo site não aparece. É o item que
   bloqueia a publicação.
2. **Taxa de entrega.** A pizzaria cobra por bairro e não publica a tabela, então
   o site mostra "a combinar" e fecha no WhatsApp. Se existir uma tabela, dá para
   preencher `regras.taxaEntrega`.
3. **Regra de dois sabores.** O site cobra o acréscimo do sabor mais caro.
   Confirme com a casa se é assim mesmo.
4. **Fotos.** As imagens em `public/img/` vieram do feed público do Instagram e
   servem como provisórias — o Instagram entrega no máximo 640px. Peça os
   originais em alta.
5. **Cardápio.** São 15 sabores no site de uma lista de mais de 80. Vale ampliar
   `sabores` em `src/data/pixpizza.ts` com os que mais vendem.
6. **Domínio.** O site está no ar em `https://pix-pizza.vercel.app` e é para lá
   que `src/app/layout.tsx` aponta. Quando o domínio próprio da pizzaria entrar,
   troque a constante `site` no `layout.tsx` e adicione o domínio no projeto da
   Vercel — canonical, Open Graph e o schema `Restaurant` dependem disso.

## Acessibilidade

`axe-core` roda sem violações na home. Foco visível em todos os controles,
`prefers-reduced-motion` respeitado, contraste AA no texto, painel do carrinho
com `Esc` e foco preso, e barra de pedido com `safe-area-inset` para o iPhone.
