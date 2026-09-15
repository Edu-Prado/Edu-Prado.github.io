import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import ArticleCard from "../components/ArticleCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://eduprado-backend.onrender.com";

export default function Home({ allPosts = [] }) {
  const [newsletterData, setNewsletterData] = useState({ nome: "", email: "" });
  const [newsletterStatus, setNewsletterStatus] = useState(""); // '', 'loading', 'success', 'error'

  const pilarSlugs = [
    "por-que-tantos-projetos-de-ia-falham-antes-mesmo-de-comecar",
    "como-identificar-bons-casos-de-uso-de-ia",
    "ia-para-profissionais-nao-tecnicos-por-onde-comecar",
    "nem-todo-problema-precisa-de-ia",
  ];

  const pillarPosts = pilarSlugs
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter(Boolean);

  const latestPosts = allPosts
    .filter((p) => !pilarSlugs.includes(p.slug))
    .slice(0, 3);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterStatus("loading");
    try {
      // Reuse the messages infrastructure securely via backend to bypass RLS
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newsletterData.nome,
          email: newsletterData.email,
          organization: "Inscrição Newsletter",
          message:
            "Inscrição efetuada através do formulário da página inicial.",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      setNewsletterStatus("success");
      setNewsletterData({ nome: "", email: "" });
    } catch (err) {
      console.error("Erro na inscrição da newsletter:", err);
      setNewsletterStatus("error");
    }
  };

  return (
    <>
      <Head>
        <title>
          Eduardo Prado | Aprenda sobre Inteligência Artificial Aplicada sem
          tech-ês
        </title>
        <meta
          name="description"
          content="Aprenda sobre Inteligência Artificial, dados, Open Finance e transformação digital com Eduardo Prado. Conteúdos práticos, reflexões e ferramentas explicadas sem tech-ês."
        />
        <meta
          property="og:title"
          content="Eduardo Prado | Aprenda sobre Inteligência Artificial Aplicada sem tech-ês"
        />
        <meta
          property="og:description"
          content="Aprenda sobre Inteligência Artificial, dados, Open Finance e transformação digital com Eduardo Prado. Conteúdos práticos, reflexões e ferramentas explicadas sem tech-ês."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduprado.me/" />
        <meta
          property="og:image"
          content="https://eduprado.me/images/header-bg.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Eduardo Prado | Aprenda sobre Inteligência Artificial Aplicada sem tech-ês"
        />
        <meta
          name="twitter:description"
          content="Aprenda sobre Inteligência Artificial, dados, Open Finance e transformação digital com Eduardo Prado. Conteúdos práticos, reflexões e ferramentas explicadas sem tech-ês."
        />
        <meta
          name="twitter:image"
          content="https://eduprado.me/images/header-bg.png"
        />

        {/* Person Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Eduardo Prado",
              url: "https://eduprado.me",
              image: "https://eduprado.me/images/profile.jpg",
              jobTitle: "Executivo de IA, Dados e Inovação Financeira",
              sameAs: ["https://www.linkedin.com/in/eduardo-prado-bb5174123/"],
            }),
          }}
        />

        {/* Website Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "EduPrado.me",
              url: "https://eduprado.me",
              description:
                "IA aplicada, dados e transformação digital sem tech-ês.",
            }),
          }}
        />
      </Head>

      <Navbar />

      <main id="conteudo" className="home-main">
        <section className="editorial-hero page-width">
          <div className="hero-copy">
            <p className="eyebrow">EDUARDO PRADO · IA APLICADA A NEGÓCIOS</p>
            <h1>
              O futuro é complexo.
              <br />A conversa <span>não precisa ser.</span>
            </h1>
            <p className="hero-description">
              IA, dados e transformação digital sem tech-ês. Ideias e
              ferramentas para entender o que muda — e aplicar o que faz
              sentido.
            </p>
            <div className="hero-actions">
              <Link href="/blog" className="button-primary">
                Explorar os artigos <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/sobre" className="text-link">
                Conheça minha trajetória
              </Link>
            </div>
            <p className="hero-note">
              Para quem quer tomar melhores decisões, sem precisar virar
              programador.
            </p>
          </div>
          <figure className="hero-portrait">
            <img
              src="/images/profile.jpg"
              alt="Eduardo Prado"
              width="819"
              height="1024"
              fetchpriority="high"
            />
            <figcaption>
              <span>TECNOLOGIA COM CONTEXTO</span>
              <strong>Eduardo Prado</strong>
              <p>
                Mais de 20 anos conectando
                <br />
                negócios, dados e pessoas.
              </p>
            </figcaption>
          </figure>
        </section>
        <div className="topic-strip">
          <div className="page-width">
            <span>IA na prática</span>
            <span>Dados & Open Finance</span>
            <span>Carreira & liderança</span>
            <span>Conteúdo sem hype</span>
          </div>
        </div>
        {latestPosts.length > 0 && (
          <section
            className="section-space page-width"
            aria-labelledby="recentes"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">NO RADAR</p>
                <h2 id="recentes">Ideias para levar adiante.</h2>
              </div>
              <Link href="/blog" className="text-link">
                Todos os artigos ↗
              </Link>
            </div>
            <div className="latest-grid">
              {latestPosts.map((post, i) => (
                <ArticleCard key={post.id} post={post} featured={i === 0} />
              ))}
            </div>
          </section>
        )}
        {pillarPosts.length > 0 && (
          <section className="start-section section-space">
            <div className="page-width start-layout">
              <div>
                <p className="eyebrow">COMECE POR AQUI</p>
                <h2>
                  Menos ruído.
                  <br />
                  Mais clareza.
                </h2>
                <p>
                  Quatro leituras para sair das promessas e começar pelas
                  perguntas certas.
                </p>
              </div>
              <div className="reading-list">
                {pillarPosts.map((post, i) => (
                  <article key={post.id}>
                    <span className="reading-number">0{i + 1}</span>
                    <div>
                      <p className="article-meta">
                        {post.category || post.tag || "IA aplicada"} ·{" "}
                        {post.readingMinutes || Math.max(
                          1,
                          Math.ceil(
                            (post.content || "").split(/\s+/).length / 200,
                          ),
                        )}{" "}
                        min
                      </p>
                      <h3>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                    </div>
                    <span className="reading-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
        <section className="section-space page-width services-section">
          <div>
            <p className="eyebrow">PARA EQUIPES E ORGANIZAÇÕES</p>
            <h2>
              Vamos trazer essa
              <br />
              conversa para o seu time?
            </h2>
            <p>
              Palestras, workshops e conversas sobre IA aplicada, dados e
              transformação digital. Com experiência de quem vive os desafios do
              mundo corporativo.
            </p>
            <Link href="/palestras" className="button-primary">
              Conhecer os formatos ↗
            </Link>
          </div>
          <div className="service-list">
            <div>
              <span>01</span>
              <h3>Palestras</h3>
              <p>Uma visão acessível para ampliar o debate.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Workshops</h3>
              <p>Problemas reais e próximos passos para sua equipe.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Conversas estratégicas</h3>
              <p>Contexto para decidir com mais confiança.</p>
            </div>
            <Link href="/contato" className="text-link">
              Falar comigo ↗
            </Link>
          </div>
        </section>
        <section className="newsletter-section" id="newsletter">
          <div className="page-width newsletter-layout">
            <div>
              <p className="eyebrow">CONTINUE A CONVERSA</p>
              <h2>
                Boas ideias.
                <br />
                Direto no seu e-mail.
              </h2>
              <p>
                Receba os próximos textos e uma curadoria sobre IA, dados e
                tecnologia, com foco em aplicação prática.
              </p>
            </div>
            <div>
              {newsletterStatus === "success" ? (
                <div className="form-success" role="status">
                  <strong>Solicitação recebida!</strong>
                  <p>
                    Seu interesse em receber os próximos textos foi registrado.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="newsletter-form"
                  aria-busy={newsletterStatus === "loading"}
                >
                  <label htmlFor="newsletter-name">Seu nome</label>
                  <input
                    id="newsletter-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={newsletterData.nome}
                    onChange={(e) =>
                      setNewsletterData({
                        ...newsletterData,
                        nome: e.target.value,
                      })
                    }
                    placeholder="Como você prefere ser chamado?"
                  />
                  <label htmlFor="newsletter-email">Seu e-mail</label>
                  <input
                    id="newsletter-email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    required
                    value={newsletterData.email}
                    onChange={(e) =>
                      setNewsletterData({
                        ...newsletterData,
                        email: e.target.value,
                      })
                    }
                    placeholder="voce@exemplo.com"
                  />
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={newsletterStatus === "loading"}
                  >
                    {newsletterStatus === "loading"
                      ? "Enviando..."
                      : "Quero receber os próximos textos"}
                  </button>
                </form>
              )}
              {newsletterStatus === "error" && (
                <p className="form-error" role="alert">
                  Não foi possível enviar. Tente novamente ou fale comigo pelo
                  LinkedIn.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const { getPublishedPosts } = await import("../lib/posts.server");
  const posts = await getPublishedPosts();
  const { postSummary } = await import("../lib/posts.server");
  return { props: { allPosts: posts.map(postSummary) } };
}
