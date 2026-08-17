/**
 * Logo da Pix Pizza redesenhado em vetor: círculo vermelho, balão de fala
 * branco, "I ♥ PIX PIZZA". Vetor em vez do JPG do perfil porque o arquivo
 * original do Instagram só existe em 150px e serrilha em tela grande.
 */
export function LogoPix({
  className,
  titulo = "Pix Pizza",
}: {
  className?: string;
  titulo?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      // Sem título o logo é decoração ao lado de um texto que já diz a marca —
      // anunciá-lo de novo só atrapalha quem usa leitor de tela.
      {...(titulo
        ? { role: "img" as const, "aria-label": titulo }
        : { "aria-hidden": true, focusable: false })}
    >
      <circle cx="100" cy="100" r="98" fill="#c80008" />
      <circle cx="100" cy="100" r="90" fill="#f80018" />
      {/* Balão de fala, com a "rabicha" apontando para baixo à esquerda. */}
      <path
        d="M24 66a16 16 0 0 1 16-16h120a16 16 0 0 1 16 16v52a16 16 0 0 1-16 16H78l-26 28 5-28H40a16 16 0 0 1-16-16z"
        fill="#f8f8f8"
      />
      <text
        x="42"
        y="114"
        fontFamily="var(--fonte-display), 'Arial Black', sans-serif"
        fontSize="60"
        fill="#0a0708"
      >
        I
      </text>
      {/* Coração vermelho com o nome dentro — o miolo da marca. */}
      <path
        d="M114 62c-11-13-32-9-38 5-5 12 2 23 11 31l27 24 27-24c9-8 16-19 11-31-6-14-27-18-38-5z"
        fill="#f80018"
      />
      <text
        x="114"
        y="93"
        textAnchor="middle"
        fontFamily="var(--fonte-display), 'Arial Black', sans-serif"
        fontSize="23"
        letterSpacing="1"
        fill="#f8f8f8"
      >
        PIX
      </text>
      <text
        x="114"
        y="115"
        textAnchor="middle"
        fontFamily="var(--fonte-display), 'Arial Black', sans-serif"
        fontSize="20"
        letterSpacing="0.5"
        fill="#f8f8f8"
      >
        PIZZA
      </text>
    </svg>
  );
}
