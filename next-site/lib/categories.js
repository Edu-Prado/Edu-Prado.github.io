export const categories = [
  "Todos",
  "IA na prática",
  "IA e negócios",
  "Dados e Open Finance",
  "Ferramentas de IA",
  "Carreira e futuro do trabalho",
  "Opinião e tendências",
];

export function normalizeSearch(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Bridge legacy tags to the current editorial categories without rewriting posts.
export function categoryForPost(post) {
  const original = normalizeSearch(post.category || post.tag);
  const exact = categories
    .slice(1)
    .find((category) => normalizeSearch(category) === original);
  if (exact) return exact;
  const title = normalizeSearch(post.title);
  if (/open finance|open banking|\bdados\b/.test(title) || original === "dados")
    return "Dados e Open Finance";
  if (/carreira|executivo|lideranca|futuro do trabalho/.test(title))
    return "Carreira e futuro do trabalho";
  if (/ferramenta|notebooklm|chatgpt|gemini/.test(title))
    return "Ferramentas de IA";
  if (original === "ia para iniciantes" || original === "geral")
    return "IA na prática";
  if (
    ["conteudo sem hype", "pensamento critico", "noticias", "ia"].includes(
      original,
    )
  )
    return "Opinião e tendências";
  return "IA na prática";
}
