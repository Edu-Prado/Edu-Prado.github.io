import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    org: '',
    interesse: 'Palestra',
    mensagem: ''
  })
  const [status, setStatus] = useState('') // '', 'loading', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    // Append the interest cleanly into the message column for database schema compatibility
    const formattedMessage = `[Interesse: ${formData.interesse}]\n\n${formData.mensagem}`

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.nome,
            email: formData.email,
            organization: formData.org || 'Individual',
            message: formattedMessage
          }
        ])

      if (error) throw error

      setStatus('success')
      setFormData({ nome: '', email: '', org: '', interesse: 'Palestra', mensagem: '' })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setStatus('error')
    }
  }

  return (
    <>
      <Head>
        <title>Contato | Edu Prado</title>
        <meta name="description" content="Entre em contato com Eduardo Prado para palestras, workshops, mentorias, parcerias, projetos de IA aplicada e conversas sobre tecnologia." />
        <meta property="og:title" content="Contato | Edu Prado" />
        <meta property="og:description" content="Entre em contato com Eduardo Prado para palestras, workshops, mentorias, parcerias, projetos de IA aplicada e conversas sobre tecnologia." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduprado.me/contato/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contato | Edu Prado" />
        <meta name="twitter:description" content="Entre em contato com Eduardo Prado para palestras, workshops, mentorias, parcerias, projetos de IA aplicada e conversas sobre tecnologia." />

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
                  "name": "Contato",
                  "item": "https://eduprado.me/contato/"
                }
              ]
            })
          }}
        />
      </Head>

      <Navbar />

      <main className="pt-24 pb-16 bg-slate-50/50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          
          {/* Header Section */}
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="px-3.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Fale Comigo
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Vamos conversar?
            </h1>
            <p className="text-base sm:text-lg text-slate-650 leading-relaxed font-light">
              Se você quer falar sobre palestras, workshops, mentorias corporativas, parcerias de conteúdo ou tirar dúvidas sobre tecnologia aplicada, envie sua mensagem.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-3xl mx-auto">
            {/* Form Column */}
            <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
              
              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3.5 rounded-xl text-sm mb-6" role="alert">
                  <strong className="font-bold">Mensagem enviada com sucesso!</strong>
                  <span className="block sm:inline"> Retornarei seu e-mail o mais breve possível.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm mb-6" role="alert">
                  <strong className="font-bold">Erro no envio.</strong>
                  <span className="block sm:inline"> Ocorreu um problema. Se preferir, me acione diretamente via LinkedIn.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-1.5 font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="nome">Nome Completo</label>
                  <input
                    required
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-slate-800 transition"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="email">E-mail Corporativo / Pessoal</label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-slate-800 transition"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="org">Empresa / Organização</label>
                  <input
                    id="org"
                    name="org"
                    type="text"
                    placeholder="Ex: Minha Empresa"
                    value={formData.org}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-slate-800 transition"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="interesse">Principal Interesse</label>
                  <select
                    id="interesse"
                    name="interesse"
                    value={formData.interesse}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-slate-800 transition cursor-pointer"
                  >
                    <option value="Palestra">Palestra</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Mentoria">Mentoria</option>
                    <option value="Consultoria/conversa estratégica">Consultoria / conversa estratégica</option>
                    <option value="Conteúdo/parceria">Parceria de Conteúdo</option>
                    <option value="Outro assunto">Outro assunto</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 font-bold text-xs uppercase tracking-wider text-slate-500" htmlFor="mensagem">Sua Mensagem</label>
                  <textarea
                    required
                    id="mensagem"
                    name="mensagem"
                    rows="4"
                    placeholder="Descreva brevemente sua necessidade ou projeto..."
                    value={formData.mensagem}
                    onChange={handleChange}
                    className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-slate-800 transition outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm disabled:opacity-50 text-sm"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar mensagem ➔'}
                </button>
              </form>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center md:text-left">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-4">Canais Diretos</h4>
                <div className="space-y-4">
                  <a 
                    href="https://www.linkedin.com/in/eduardopradojunior/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 hover:border-blue-200/50 text-slate-700 hover:text-blue-700 text-sm font-bold transition duration-200"
                  >
                    <span className="text-xs">LinkedIn Profissional</span>
                  </a>
                  <a 
                    href="mailto:epradojunior@hotmail.com"
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 hover:border-blue-200/50 text-slate-700 hover:text-blue-700 text-sm font-bold transition duration-200"
                  >
                    <span className="text-xs">epradojunior@hotmail.com</span>
                  </a>
                  <Link 
                    href="/#newsletter"
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 hover:border-blue-200/50 text-slate-700 hover:text-blue-700 text-sm font-bold transition duration-200"
                  >
                    <span className="text-xs">Assinar Newsletter</span>
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-3xl border border-blue-100 text-center md:text-left">
                <h4 className="font-extrabold text-blue-900 text-sm uppercase tracking-wider mb-2">Compromisso Pragmático</h4>
                <p className="text-blue-950 text-xs leading-relaxed font-light">
                  A tecnologia deve estar a serviço dos resultados, sem jargões. Responderei à sua solicitação em até 24 horas úteis para combinarmos um bate-papo objetivo.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
