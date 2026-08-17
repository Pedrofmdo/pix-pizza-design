import { Cabecalho } from "@/components/Cabecalho";
import { Abertura } from "@/components/Abertura";
import { Montar } from "@/components/Montar";
import { Combos } from "@/components/Combos";
import { Faixa } from "@/components/Faixa";
import { ACasa } from "@/components/ACasa";
import { Onde } from "@/components/Onde";
import { Rodape } from "@/components/Rodape";
import { BarraPedido } from "@/components/BarraPedido";
import { PainelCarrinho } from "@/components/carrinho/Painel";

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main className="flex-1 pb-20 lg:pb-0">
        <Abertura />
        <Montar />
        <Combos />
        <Faixa
          src="/img/ig-11.jpg"
          alt="Fatias de pizza sendo divididas entre amigos na Pix Pizza"
          fala="PIZZA BOA É A QUE SE DIVIDE."
          assinatura="Manaíra · João Pessoa · desde as 17h30"
        />
        <ACasa />
        <Onde />
      </main>
      <Rodape />
      <BarraPedido />
      <PainelCarrinho />
    </>
  );
}
