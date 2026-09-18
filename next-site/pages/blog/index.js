import Head from "next/head";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ArticleCard from "../../components/ArticleCard";
import {
  categories,
  normalizeSearch,
  categoryForPost,
} from "../../lib/categories";

export default function Blog({ allPosts = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const availableCategories = categories.filter(
    (category) =>
      category === "Todos" ||
      allPosts.some((post) => categoryForPost(post) === category),
  );
  const query = normalizeSearch(searchTerm);
  const filteredPosts = allPosts.filter(
    (post) =>
      (selectedCategory === "Todos" ||
        categoryForPost(post) === selectedCategory) &&
      normalizeSearch(
        [
          post.title,
          post.excerpt,
          post.category,
          post.tag,
          categoryForPost(post),
        ]
          .filter(Boolean)
          .join(" "),
      ).includes(query),
  );
  return (
    <>
      <Head>
        <title>Blog | IA, dados e transformação digital sem tech-ês</title>
        <meta
          name="description"
          content="Artigos práticos e acessíveis sobre inteligência artificial, dados, tecnologia, carreira, negócios e futuro do trabalho."
        />
        <meta
          property="og:title"
          content="Blog | IA, dados e transformação digital sem tech-ês"
        />
        <meta
          property="og:description"
          content="Artigos práticos e acessíveis sobre inteligência artificial, dados, tecnologia, carreira, negócios e futuro do trabalho."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduprado.me/blog/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Blog | IA, dados e transformação digital sem tech-ês"
        />
        <meta
          name="twitter:description"
          content="Artigos práticos e acessíveis sobre inteligência artificial, dados, tecnologia, carreira, negócios e futuro do trabalho."
        />

        {/* Breadcrumb List Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://eduprado.me/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: "https://eduprado.me/blog/",
                },
              ],
            }),
          }}
        />
      </Head>
      <Navbar />
      <main id="conteudo" className="blog-main page-width">
        <header className="blog-header">
          <p className="eyebrow">ARTIGOS & REFLEXÕES</p>
          <h1>
            Contexto para entender.
            <br />
            Ideias para aplicar.
          </h1>
          <p>
            IA, dados, carreira e negócios. Explore os temas que fazem parte da
            sua próxima decisão.
          </p>
        </header>
        <div className="blog-search">
          <label htmlFor="article-search">Encontre sua próxima leitura</label>
          <input
            id="article-search"
            type="search"
            placeholder="Busque um tema, ferramenta ou ideia"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div
          className="category-filters"
          role="group"
          aria-label="Filtrar artigos por tema"
        >
          {availableCategories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <p className="result-count" role="status" aria-live="polite">
          {filteredPosts.length}{" "}
          {filteredPosts.length === 1
            ? "artigo encontrado"
            : "artigos encontrados"}
        </p>
        {filteredPosts.length ? (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <ArticleCard
                key={post.id}
                post={{ ...post, category: categoryForPost(post) }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <h2>Nenhum artigo encontrado</h2>
            <p>Tente outro termo ou volte para todos os temas.</p>
            <button
              className="button-primary"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Todos");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const { getPublishedPosts } = await import("../../lib/posts.server");
  const posts = await getPublishedPosts();
  const { postSummary } = await import("../../lib/posts.server");
  return { props: { allPosts: posts.map(postSummary) } };
}
