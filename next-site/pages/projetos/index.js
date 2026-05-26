import Head from 'next/head'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProjectCard from '../../components/ProjectCard'
import { projects } from '../../data/projects'

export default function Projetos() {
  return (
    <>
      <Head>
        <title>Projetos | Edu Prado</title>
        <meta name="description" content="Conheça projetos e iniciativas de Eduardo Prado envolvendo IA generativa, conteúdo, dados, Open Finance e transformação digital." />
        <meta property="og:title" content="Projetos | Edu Prado" />
        <meta property="og:description" content="Conheça projetos e iniciativas de Eduardo Prado envolvendo IA generativa, conteúdo, dados, Open Finance e transformação digital." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduprado.me/projetos/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projetos | Edu Prado" />
        <meta name="twitter:description" content="Conheça projetos e iniciativas de Eduardo Prado envolvendo IA generativa, conteúdo, dados, Open Finance e transformação digital." />

        {/* Breadcrumb List Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://eduprado.me/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Projetos",
                  "item": "https://eduprado.me/projetos/"
                }
              ]
            })
          }}
        />
      </Head>

      <Navbar />

      <main className="pt-24 pb-16 bg-slate-50/50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6">
          
          {/* Header section */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Portfólio de Soluções
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Projetos e iniciativas
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
              Alguns dos temas, experimentos e iniciativas que ajudam a traduzir inteligência artificial, dados e transformação digital para contextos reais.
            </p>
          </div>

          {/* Projects Card Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            {projects.map(p => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
