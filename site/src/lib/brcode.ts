/**
 * Gera o "Pix copia e cola" (BR Code) no padrão EMV® QRCPS do Banco Central.
 *
 * O payload é uma sequência de campos `ID + tamanho + valor`, onde o tamanho
 * tem sempre 2 dígitos. O último campo é o CRC16 calculado sobre tudo o que
 * veio antes, incluindo o próprio "6304".
 *
 * Referência: Manual de Padrões para Iniciação do Pix (BCB), seção BR Code.
 */

function campo(id: string, valor: string) {
  const tamanho = valor.length.toString().padStart(2, "0");
  return `${id}${tamanho}${valor}`;
}

/**
 * Só ASCII imprimível é aceito no BR Code. Acento em nome de recebedor faz
 * alguns bancos recusarem o código, então normalizamos antes.
 */
function apenasAscii(texto: string, limite: number) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^ -~]/g, "")
    .trim()
    .slice(0, limite)
    .toUpperCase();
}

/** CRC16/CCITT-FALSE: polinômio 0x1021, valor inicial 0xFFFF. */
export function crc16(payload: string) {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export type DadosPix = {
  chave: string;
  recebedor: string;
  cidade: string;
  valor: number;
  /** Identificador do pedido. Vira o campo txid, máx. 25 caracteres. */
  identificador: string;
};

export function gerarBrCode({
  chave,
  recebedor,
  cidade,
  valor,
  identificador,
}: DadosPix) {
  // O txid aceita só letras e números; qualquer outra coisa é descartada.
  const txid = apenasAscii(identificador, 25).replace(/[^A-Z0-9]/g, "") || "***";

  const merchantAccount = campo(
    "26",
    campo("00", "BR.GOV.BCB.PIX") + campo("01", chave.trim()),
  );

  const semCrc =
    campo("00", "01") +
    merchantAccount +
    campo("52", "0000") + // categoria do estabelecimento: não informada
    campo("53", "986") + // BRL
    campo("54", valor.toFixed(2)) +
    campo("58", "BR") +
    campo("59", apenasAscii(recebedor, 25)) +
    campo("60", apenasAscii(cidade, 15)) +
    campo("62", campo("05", txid)) +
    "6304";

  return semCrc + crc16(semCrc);
}
