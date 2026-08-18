"""
Gera uma imagem por combo a partir das fotos reais da Pix Pizza.

Cada imagem mostra uma pizza para cada pizza que o combo entrega, mais as
bebidas, sobre o preto da marca. Nada e inventado: todo pixel sai de uma foto
do feed deles. O que a montagem acrescenta e a QUANTIDADE, que nenhuma foto
isolada mostra.

Decisoes que custaram uma tentativa cada:

- As pecas entram inteiras (contain, nao cover). Cortada, a pizza vira textura
  e o cliente perde a conta de quantas sao.
- Nos combos de varias pizzas so entram fotos de pizza-na-travessa (ig-8, ig-9).
  Misturar com a da caixa (ig-2) ou com o close (ig-6) denuncia a montagem: sao
  tres enquadramentos diferentes lado a lado.
- A segunda garrafa NAO e espelhada. Espelhar disfarcaria a copia, mas deixa o
  "PEPSI" escrito ao contrario - pior que a copia. Duas garrafas iguais e o que
  o combo entrega mesmo.
"""

from PIL import Image, ImageFilter
import os

IMG = r"c:/Users/pedro.fernandes/Desktop/Cabo Jorge/Projetos/Freelancers/pix-pizza-Design/site/public/img"

FUNDO = (12, 8, 9)

PIZZAS = {
    # ig-8: grande de dois sabores na travessa
    "dois_sabores": ("ig-8.jpg", 30, 272, 512, 600),
    # ig-9: as duas grandes. Comeca em y=210 para deixar o rosto fora e para
    # em 425 por causa do texto "de 1L" gravado na foto.
    "milho": ("ig-9.jpg", 0, 228, 172, 418),
    "presunto": ("ig-9.jpg", 150, 243, 340, 425),
    # ig-2: pepperoni na caixa. So para combo de uma pizza. Comeca em y=165
    # para deixar de fora o telefone impresso na tampa.
    "pepperoni_caixa": ("ig-2.jpg", 85, 165, 400, 420),
}

GARRAFA = ("ig-8.jpg", 194, 6, 308, 292)
COPO = ("ig-8.jpg", 84, 136, 184, 292)


def recorta(spec):
    arq, l, t, r, b = spec
    return Image.open(os.path.join(IMG, arq)).convert("RGB").crop((l, t, r, b))


def cabe(im, larg, alt, escala_extra=1.0):
    escala = min(larg / im.width, alt / im.height) * 0.94 * escala_extra
    return im.resize(
        (max(1, round(im.width * escala)), max(1, round(im.height * escala))),
        Image.LANCZOS,
    )


def cola_com_sombra(canvas, peca, cx, cy):
    x = cx - peca.width // 2
    y = cy - peca.height // 2
    m = 22
    caixa = (x - m, y - m + 8, x - m + peca.width + 2 * m, y - m + 8 + peca.height + 2 * m)
    if caixa[0] < 0 or caixa[1] < 0 or caixa[2] > canvas.width or caixa[3] > canvas.height:
        canvas.paste(peca, (x, y))
        return
    sombra = Image.new("RGBA", (peca.width + 2 * m, peca.height + 2 * m), (0, 0, 0, 0))
    sombra.paste((0, 0, 0, 200), (m, m, m + peca.width, m + peca.height))
    sombra = sombra.filter(ImageFilter.GaussianBlur(13))
    canvas.paste(
        Image.alpha_composite(canvas.crop(caixa).convert("RGBA"), sombra).convert("RGB"),
        (caixa[0], caixa[1]),
    )
    canvas.paste(peca, (x, y))


def monta(nome, pizzas, bebidas, copo=False):
    """`pizzas` e uma lista de (chave, escala) - a escala menor marca a pequena."""
    L, A = 960, 540
    canvas = Image.new("RGB", (L, A), FUNDO)

    col_bebida = 172 if bebidas else 0
    larg_pizzas = L - col_bebida
    larg_tile = larg_pizzas // len(pizzas)

    for i, (chave, escala) in enumerate(pizzas):
        peca = cabe(recorta(PIZZAS[chave]), larg_tile, A, escala)
        cola_com_sombra(canvas, peca, larg_tile * i + larg_tile // 2, A // 2)

    if bebidas:
        alt = A // bebidas
        for j in range(bebidas):
            peca = cabe(recorta(COPO if copo else GARRAFA), col_bebida, alt)
            cola_com_sombra(canvas, peca, larg_pizzas + col_bebida // 2, alt * j + alt // 2)

    destino = os.path.join(IMG, nome)
    canvas.save(destino, "JPEG", quality=86, optimize=True)
    print(nome, canvas.size, os.path.getsize(destino) // 1024, "KB")


monta("combo-pequena-refri.jpg", [("pepperoni_caixa", 1.0)], 1, copo=True)
monta("combo-01.jpg", [("dois_sabores", 1.0)], 1)
# a pequena entra menor de proposito: e a diferenca que o combo cobra
monta("combo-02.jpg", [("dois_sabores", 1.0), ("pepperoni_caixa", 0.72)], 1)
monta("combo-03.jpg", [("milho", 1.0), ("presunto", 1.0)], 1)
monta("combo-04.jpg", [("milho", 1.0), ("presunto", 1.0), ("dois_sabores", 1.0)], 2)
