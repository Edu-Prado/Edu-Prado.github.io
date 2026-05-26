import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://eduprado-backend.onrender.com';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [newsletterData, setNewsletterData] = useState({ nome: '', email: '' })
  const [newsletterStatus, setNewsletterStatus] = useState('') // '', 'loading', 'success', 'error'

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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    setNewsletterStatus('loading')
    try {
      // Reuse the messages infrastructure securely
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: newsletterData.nome,
            email: newsletterData.email,
            organization: 'Inscrição Newsletter',
            message: 'Inscrição efetuada através do formulário da página inicial.'
          }
        ])

      if (error) throw error

      setNewsletterStatus('success')
      setNewsletterData({ nome: '', email: '' })
    } catch (err) {
      console.error('Erro na inscrição da newsletter:', err)
      setNewsletterStatus('error')
    }
  }

  return (
    <>
      <Head>
        <title>Edu Prado | IA aplicada, dados e transformação digital sem tech-ês</title>
        <meta name="description" content="Conteúdos, reflexões e ferramentas sobre inteligência artificial aplicada, dados, Open Finance e transformação digital — explicados de forma prática, leve e sem tech-ês." />
        <meta property="og:title" content="Edu Prado | IA aplicada, dados e transformação digital sem tech-ês" />
        <meta property="og:description" content="Conteúdos, reflexões e ferramentas sobre inteligência artificial aplicada, dados, Open Finance e transformação digital — explicados de forma prática, leve e sem tech-ês." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduprado.me/" />
        <meta property="og:image" content="https://eduprado.me/images/header-bg.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Edu Prado | IA aplicada, dados e transformação digital sem tech-ês" />
        <meta name="twitter:description" content="Conteúdos, reflexões e ferramentas sobre inteligência artificial aplicada, dados, Open Finance e transformação digital — explicados de forma prática, leve e sem tech-ês." />
        <meta name="twitter:image" content="https://eduprado.me/images/header-bg.png" />
        
        {/* Person Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Eduardo Prado",
              "url": "https://eduprado.me",
              "image": "https://eduprado.me/images/profile.jpg",
              "jobTitle": "Executivo de IA, Dados e Inovação Financeira",
              "sameAs": [
                "https://www.linkedin.com/in/eduardopradojunior/"
              ]
            })
          }}
        />

        {/* Website Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "EduPrado.me",
              "url": "https://eduprado.me",
              "description": "IA aplicada, dados e transformação digital sem tech-ês."
            })
          }}
        />
      </Head>

      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-slate-950 text-white overflow-hidden py-24 sm:py-32">
          {/* Subtle background graphic */}
          <div className="absolute inset-0 z-0 opacity-20">
            <img 
              src="/images/header-bg.png" 
              alt="Edu Prado Banner" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950 to-slate-950 z-0"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/20 mb-6 inline-block">
              Inteligência Artificial Aplicada
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white leading-tight tracking-tight">
              IA, dados e transformação digital <span className="text-blue-500">sem tech-ês.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
              Conteúdos, reflexões e ferramentas para quem quer entender e aplicar inteligência artificial no trabalho, nos negócios e no dia a dia — sem precisar virar programador para participar da conversa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/blog" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-600/20 text-center">
                Ler artigos
              </Link>
              <Link href="#newsletter" className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 rounded-xl font-bold transition text-center">
                Assinar newsletter
              </Link>
              <Link href="/contato" className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-slate-900/50 text-slate-300 hover:text-white rounded-xl font-bold transition text-center">
                Falar comigo ➔
              </Link>
            </div>
          </div>
        </section>

        {/* "Para quem é este site" Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Para quem é este site?
              </h2>
              <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
                Descomplicamos o universo tecnológico para dar autonomia a quem toma decisões.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition duration-300">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-5">01</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Profissionais de Negócios</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Que querem entender o impacto da IA no seu fluxo de trabalho, sem linguagem técnica exagerada.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition duration-300">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-5">02</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Líderes e Executivos</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Que precisam tomar melhores decisões de investimentos corporativos em novas tecnologias.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition duration-300">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold mb-5">03</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Focados em Carreira</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Interessados em alavancar produtividade pessoal e planejar o crescimento na era digital.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition duration-300">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-5">04</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Curiosos Digitais</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Que desejam utilizar inteligência artificial generativa de forma prática no dia a dia.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition duration-300 md:col-span-2 lg:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-5">05</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Equipes & Organizações</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Empresas prontas para sair das buzzwords ("hype") e descobrir o valor econômico real e prático da inteligência de dados aplicada.</p>
              </div>
            </div>
          </div>
        </section>

        {/* "O que você encontra aqui" Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                O que você encontra aqui?
              </h2>
              <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
                Navegue pelas nossas principais frentes editoriais.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">IA na Prática</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Casos de uso reais, análise de ferramentas inovadoras, guias de prompts eficientes, exemplos e aplicações úteis no cotidiano.</p>
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">Dados e Open Finance</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Reflexões profundas sobre modelagem de dados, inteligência de negócios, Open Banking, mercado financeiro nacional e automação digital.</p>
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">Carreira e Liderança na era da IA</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Como líderes e profissionais podem se posicionar estrategicamente, aprender a gerenciar processos digitais e tomar decisões baseadas em fatos.</p>
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">Conteúdo sem hype</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Uma postura analítica e extremamente crítica sobre o real potencial de softwares, erros clássicos e os limites éticos da Inteligência Artificial.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic "Artigos em Destaque" Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Artigos em Destaque</h2>
              <Link href="/blog" className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition">
                Ver todos os artigos ➔
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {featuredPosts.map(post => (
                <div key={post.id} className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition duration-300 flex flex-col bg-white">
                  {post.image_url && (
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-102 transition duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none' }}
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full w-max mb-3 tracking-wider">
                      {post.category || post.tag || 'IA'}
                    </span>
                    <h3 className="text-[17px] font-bold text-slate-800 mb-3 leading-snug hover:text-blue-600 transition">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-500 text-xs mb-4">
                      {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3 font-light">
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline mt-auto">
                      Ler artigo
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              ))}
              {featuredPosts.length === 0 && (
                /* Safe Fallbacks in case Supabase is empty */
                [1, 2, 3].map(i => (
                  <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden bg-white p-6">
                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full w-max mb-3 tracking-wider">
                      Placeholder
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">
                      Aguardando sincronização de artigos
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">Artigo de rascunho</p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5 font-light">
                      Os artigos estratégicos iniciais podem ser semeados a qualquer momento pelo painel administrativo da plataforma.
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Corporate Services Block (Consultive Tone) */}
        <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6">
              Palestras, workshops e conversas sobre IA aplicada
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Ajudo lideranças, profissionais e equipes corporativas a saírem do hype publicitário e identificarem valor estratégico real e prático na inteligência artificial aplicada.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-10 text-slate-300 text-sm">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Palestras desmistificadoras sobre inteligência de dados.</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Workshops imersivos de produtividade com IA generativa.</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Mentorias executivas personalizadas de inovação.</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Projetos e consultoria estratégica em Open Finance.</span>
              </div>
            </div>
            <Link href="/contato" className="inline-block px-8 py-4 bg-white text-slate-950 hover:bg-blue-50 rounded-xl font-bold transition shadow-lg">
              Vamos conversar
            </Link>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-slate-50 border-t border-slate-100" id="newsletter">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/60 shadow-sm relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
                Receba ideias práticas sobre IA, dados e tecnologia.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-light">
                Sem hype, sem complicação e sem promessas mágicas. Apenas reflexões úteis para entender melhor o impacto da inteligência artificial no trabalho, nos negócios e na vida cotidiana.
              </p>

              {newsletterStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-center max-w-md mx-auto mb-4">
                  <span className="font-bold">Inscrição efetuada!</span> Bem-vindo à nossa lista exclusiva de insights práticos.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      required
                      type="text"
                      placeholder="Seu nome"
                      value={newsletterData.nome}
                      onChange={(e) => setNewsletterData({ ...newsletterData, nome: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Seu e-mail principal"
                      value={newsletterData.email}
                      onChange={(e) => setNewsletterData({ ...newsletterData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm disabled:opacity-50 text-sm"
                  >
                    {newsletterStatus === 'loading' ? 'Inscrevendo...' : 'Quero receber'}
                  </button>
                </form>
              )}

              {newsletterStatus === 'error' && (
                <p className="text-red-600 text-xs mt-3">Erro ao inscrever. Por favor, tente novamente.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
