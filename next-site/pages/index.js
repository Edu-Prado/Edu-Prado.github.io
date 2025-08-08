import Head from 'next/head'
import Link from 'next/link'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import { posts } from '../data/posts'

export default function Home() {
  const featuredPosts = posts.slice(0, 3)
  return (
    <>
      <Head>
        <title>Edu Prado | IA e Transformação Digital</title>
        <meta name="description" content="IA e Transformação Digital sem fumaça. Resultados reais." />
        <meta property="og:title" content="Edu Prado | IA e Transformação Digital" />
        <meta property="og:description" content="IA e Transformação Digital sem fumaça. Resultados reais." />
      </Head>
      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">IA e Transformação Digital, sem fumaça. Resultados reais.</h1>
          <p className="text-lg mb-6">Sou Eduardo Prado. Traduzo dados e IA em impacto mensurável para negócios e setor público.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contato" className="px-6 py-3 bg-blue-600 text-white rounded">Agendar conversa</Link>
            <Link href="#newsletter" className="px-6 py-3 border border-blue-600 text-blue-600 rounded">Assinar newsletter</Link>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-2xl font-semibold mb-6">O que eu faço</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Consultoria &amp; projetos-piloto de IA</h3>
              <p>Mapeamos oportunidades e executamos pilotos para gerar valor em semanas.</p>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Palestras &amp; workshops executivos</h3>
              <p>Conteúdo sob medida para líderes que precisam decidir sem hype.</p>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Mentorias 1:1 e advisory</h3>
              <p>Acompanhamento direto para acelerar aprendizado e execução.</p>
            </div>
          </div>
        </section>

        <section className="py-12" id="projetos">
          <h2 className="text-2xl font-semibold mb-6">Projetos em destaque</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map(p => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>
        </section>

        <section className="py-12" id="artigos">
          <h2 className="text-2xl font-semibold mb-6">Artigos em destaque</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map(post => (
              <div key={post.slug} className="border p-4 rounded flex flex-col">
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <p className="flex-1 mb-4">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium mt-auto">Ler mais</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Traga seu desafio. Em 30 minutos mapeamos oportunidades reais.</h2>
          <Link href="/contato" className="inline-block px-6 py-3 bg-blue-600 text-white rounded">Agendar conversa</Link>
        </section>
      </main>
    </>
  )
}
