import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function load(relative) {
  const source = await readFile(new URL(relative, import.meta.url), "utf8");
  return import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );
}
const { parseMarkdown } = await load("../lib/markdown.js");
const { categoryForPost, normalizeSearch, categories } = await load(
  "../lib/categories.js",
);

const table =
  "Introdução\n\n| Critério | Pergunta |\n|---|---|\n| **Dados** | Há contexto? |\n\nDepois da tabela.";
const html = parseMarkdown(table);
assert.match(html, /<th scope="col"[^>]*>Critério<\/th>/);
assert.match(html, /<td[^>]*><b>Dados<\/b><\/td>/);
assert.match(html, /Depois da tabela/);
assert.match(
  parseMarkdown("Antes\n| A | B |\n|---|---|\n| 1 | 2 |\nDepois"),
  /<table>/,
);
assert.match(
  parseMarkdown("| A | B |\n| :--- | ---: |\n| x\\|y | 2 |"),
  /text-align:right/,
);
assert.match(parseMarkdown("| A | B |\n|---|---|\n| x\\|y | 2 |"), /x\|y/);
assert.doesNotMatch(
  parseMarkdown("# Título\n\nTexto", { title: "Título" }),
  /<h1|<h2/,
);
assert.match(parseMarkdown("## Outro título\n\n- Um\n- Dois"), /<h2/);
assert.match(parseMarkdown("## Outro título\n\n- Um\n- Dois"), /<ul/);
assert.equal(
  categoryForPost({ tag: "Dados", title: "Dados ruins, IA cara" }),
  "Dados e Open Finance",
);
assert.equal(
  categoryForPost({
    tag: "Pensamento Crítico",
    title: "Como o Open Finance pode impulsionar a personalização",
  }),
  "Dados e Open Finance",
);
assert.equal(categoryForPost({ category: "IA e Negócios" }), "IA e negócios");
assert.equal(
  categoryForPost({
    tag: "IA para iniciantes",
    title: "Google NotebookLM em 2025",
  }),
  "Ferramentas de IA",
);
assert.equal(normalizeSearch("  INTELIGÊNCIA  "), "inteligencia");

if (process.argv[2]) {
  const posts = JSON.parse(await readFile(process.argv[2], "utf8"));
  for (const post of posts) assert(categories.includes(categoryForPost(post)));
  const article = posts.find(
    (p) => p.slug === "como-identificar-bons-casos-de-uso-de-ia",
  );
  assert(article);
  assert.match(
    parseMarkdown(article.content, { title: article.title }),
    /<table>/,
  );
  assert.doesNotMatch(
    parseMarkdown(article.content, { title: article.title }),
    /<h1/,
  );
  console.log(
    `Validated categories for ${posts.length} published articles and the real article table.`,
  );
}
console.log("Editorial regression checks passed.");
