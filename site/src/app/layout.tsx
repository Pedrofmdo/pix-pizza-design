import type { Metadata } from "next";
import { Anton, Barlow, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { negocio } from "@/data/pixpizza";
import { ProvedorCarrinho } from "@/components/carrinho/contexto";
import { FaixaDemo } from "@/components/prototipo/FaixaDemo";

/* Anton reproduz o display condensado e pesado que a Pix Pizza já usa nas artes. */
const display = Anton({
  variable: "--fonte-display",
  subsets: ["latin"],
  weight: "400",
});

const corpo = Barlow({
  variable: "--fonte-corpo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* Mono para preço e para o código Pix, que precisa ser copiado sem erro. */
const codigo = IBM_Plex_Mono({
  variable: "--fonte-codigo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const site = "https://pix-pizza.vercel.app";

/*
  Este site é uma demonstração conceitual, não o site oficial da Pix Pizza.
  Tudo aqui embaixo existe para que nenhum buscador, prévia de link ou leitor
  automático o apresente como se fosse: noindex, título que diz o que é, e
  nenhum dado estruturado reivindicando a identidade da pizzaria.
*/
const tituloDemo = "Demonstração — Pix Pizza (projeto conceitual, não oficial)";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: tituloDemo,
    template: "%s | Demonstração Pix Pizza",
  },
  description:
    "Protótipo de site e sistema de pedidos criado por Pedro Oliveira como demonstração comercial. Não é o site oficial da Pix Pizza e não recebe pedidos.",
  authors: [{ name: "Pedro Oliveira" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site,
    siteName: `Demonstração — ${negocio.nome}`,
    title: tituloDemo,
    description:
      "Projeto conceitual criado por Pedro Oliveira. Não é o site oficial da Pix Pizza e não recebe pedidos.",
    images: [{ url: "/img/ig-2.jpg", width: 640, height: 640 }],
  },
  alternates: { canonical: site },
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#0a0708",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} ${codigo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <FaixaDemo />
        <a
          href="#montar"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:bg-tela focus:px-4 focus:py-2 focus:font-semibold focus:text-sala"
        >
          Pular para o pedido
        </a>
        <ProvedorCarrinho>{children}</ProvedorCarrinho>
      </body>
    </html>
  );
}
