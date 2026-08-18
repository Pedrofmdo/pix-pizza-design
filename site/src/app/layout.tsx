import type { Metadata } from "next";
import { Anton, Barlow, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { links, negocio } from "@/data/pixpizza";
import { ProvedorCarrinho } from "@/components/carrinho/contexto";

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

/* Endereço provisório na Vercel. Trocar aqui quando o domínio próprio entrar —
   canonical, Open Graph e o schema Restaurant saem todos deste valor. */
const site = "https://pix-pizza.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Pix Pizza | Pizzaria em Manaíra, João Pessoa",
    template: "%s | Pix Pizza",
  },
  description:
    "Pizzaria em Manaíra, João Pessoa. Aberta todos os dias das 17h30 às 4h30. Peça pelo WhatsApp ou pelo cardápio online. Entrega grátis acima de R$ 200.",
  keywords: [
    "pizzaria João Pessoa",
    "pizza Manaíra",
    "delivery de pizza João Pessoa",
    "pizzaria aberta de madrugada João Pessoa",
    "Pix Pizza",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site,
    siteName: negocio.nome,
    title: "Pix Pizza | Pizzaria em Manaíra, João Pessoa",
    description:
      "Todos os dias das 17h30 às 4h30, em Manaíra. Tua fome pede a Favorita.",
    images: [{ url: "/img/ig-2.jpg", width: 640, height: 640 }],
  },
  alternates: { canonical: site },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0a0708",
  colorScheme: "dark",
};

/*
  Schema LocalBusiness — é o que faz a pizzaria aparecer direito na busca local
  e no card do Google Maps. Os dados batem com a ficha "Pix Pizzaria JP".
*/
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: negocio.nome,
  alternateName: negocio.nomeMaps,
  description: negocio.descricao,
  servesCuisine: "Pizza",
  priceRange: "R$",
  url: site,
  telephone: negocio.telefone,
  image: `${site}/img/ig-2.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: negocio.endereco.rua,
    addressLocality: negocio.endereco.cidade,
    addressRegion: negocio.endereco.estado,
    postalCode: negocio.endereco.cep,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: negocio.endereco.latitude,
    longitude: negocio.endereco.longitude,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: negocio.abre,
      closes: negocio.fecha,
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: negocio.nota,
    bestRating: 5,
    ratingCount: 300,
  },
  hasMenu: links.cardapio,
  sameAs: [links.instagram, links.ifood],
  acceptsReservations: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} ${codigo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dadosEstruturados),
          }}
        />
        <a
          href="#montar"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-tela focus:px-4 focus:py-2 focus:font-semibold focus:text-sala"
        >
          Pular para o pedido
        </a>
        <ProvedorCarrinho>{children}</ProvedorCarrinho>
      </body>
    </html>
  );
}
