import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([])

  useEffect(() => {
    fetchFeaturedPosts()
  }, [])

  async function fetchFeaturedPosts() {
    try {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      if (data) setFeaturedPosts(data)
    } catch (error) {
      console.error('Erro ao buscar posts:', error)
    }
  }

  return (
    <>
      <Head>
        <title>Edu Prado | IA e Transformação Digital</title>
        <meta name="description" content="IA e Transformação Digital sem fumaça. Resultados reais." />
        <meta property="og:title" content="Edu Prado | IA e Transformação Digital" />
        <meta property="og:description" content="IA e Transformação Digital sem fumaça. Resultados reais." />
      </Head>

      <Navbar />

      <main className="pt-20"> {/* Added padding-top to account for fixed navbar */}
        <section className="py-20 text-center bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">Descomplicando a IA<br />para quem não é especialista.</h1>
            <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">Sou Eduardo Prado. Executivo do mercado financeiro, apaixonado por games e gadgets. Traduzo a IA para a vida real, sem "tech-ês".</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contato" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">Agendar conversa</Link>
              <Link href="#newsletter" className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">Assinar newsletter</Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white" id="about">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">O que eu faço</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition bg-white">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">IA na Prática</h3>
                <p className="text-gray-600">Transformando ideias em realidade, com pilotos que geram valor em semanas.</p>
              </div>
              <div className="p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition bg-white">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Palestras Descontraídas</h3>
                <p className="text-gray-600">Papo reto sobre tecnologia para líderes e curiosos, sem hype e com embasamento.</p>
              </div>
              <div className="p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition bg-white">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Mentoria de Carreira</h3>
                <p className="text-gray-600">Ajudando você a navegar nesse mundo novo e acelerar seu aprendizado.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white" id="artigos">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Artigos em destaque</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {featuredPosts.map(post => (
                <div key={post.id} className="border border-gray-100 rounded-xl hover:shadow-lg transition flex flex-col bg-white overflow-hidden">
                  {post.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none' }}
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      <Link href={`/post?id=${post.id}`} className="hover:text-blue-600 transition">{post.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
                    <p className="text-gray-600 flex-1 mb-6 line-clamp-3">{post.excerpt}</p>
                    <Link href={`/post?id=${post.id}`} className="text-blue-600 font-semibold mt-auto flex items-center hover:underline">
                      Ler mais
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50" id="projects">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Projetos em destaque</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {projects.map(p => (
                <ProjectCard key={p.slug} {...p} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-900 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Traga seu desafio.</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Em 30 minutos mapeamos oportunidades reais para o seu negócio.</p>
            <Link href="/contato" className="inline-block px-8 py-4 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg">Agendar conversa</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
