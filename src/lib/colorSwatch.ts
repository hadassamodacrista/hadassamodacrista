const NAMED_COLORS: Record<string, string> = {
  azul: "#3b5ba9",
  "azul claro": "#8ab4e8",
  "azul marinho": "#1c2b4a",
  "azul royal": "#1e3d8f",
  vermelho: "#b32a2a",
  preto: "#111111",
  branco: "#ffffff",
  "off white": "#f2ece1",
  offwhite: "#f2ece1",
  rosa: "#e07ba0",
  "rosa claro": "#f3b6cd",
  pink: "#e6499b",
  verde: "#3c7a4b",
  "verde claro": "#8fbf8a",
  "verde água": "#7fc7bb",
  amarelo: "#e0c341",
  roxo: "#6b4a8a",
  lilás: "#b9a3d3",
  lilas: "#b9a3d3",
  bege: "#d9c3a5",
  marrom: "#6b4a35",
  cinza: "#9a9a9a",
  laranja: "#d9782f",
  salmão: "#f1a389",
  salmao: "#f1a389",
  dourado: "#c9a24a",
  prata: "#c3c3c3",
  creme: "#efe4cf",
  bordô: "#6e1f2b",
  bordo: "#6e1f2b",
  marsala: "#7a2e35",
  telha: "#b1562f",
  goiaba: "#e0725a",
  vinho: "#5c1f2e",
  caramelo: "#a9642f"
};

export function colorToHex(name: string): string {
  const key = name.trim().toLowerCase();
  return NAMED_COLORS[key] || "#c9b8ab";
}
