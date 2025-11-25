import Head from 'next/head'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    org: '',
    mensagem: ''
  })
  const [status, setStatus] = useState('') // 'loading', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.nome,
            email: formData.email,
            organization: formData.org,
            message: formData.mensagem
          }
        ])

      if (error) throw error

      setStatus('success')
      setFormData({ nome: '', email: '', org: '', mensagem: '' })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setStatus('error')
    }
  }

  return (
    <>
      <Head>
        <title>Contato | Edu Prado</title>
        <meta name="description" content="Agende 30 minutos para mapear oportunidades reais." />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-24 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Contato</h1>

        {status === 'success' ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Mensagem enviada!</strong>
            <span className="block sm:inline"> Entrarei em contato em breve.</span>
            <button onClick={() => setStatus('')} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <span className="text-green-500 font-bold">×</span>
            </button>
          </div>
        ) : null}

        {status === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Erro ao enviar.</strong>
            <span className="block sm:inline"> Por favor, tente novamente ou me chame no LinkedIn.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="nome">Nome</label>
            <input
              required
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="email">E-mail</label>
            <input
              required
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="org">Organização</label>
            <input
              id="org"
              name="org"
              type="text"
              value={formData.org}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="mensagem">Mensagem</label>
            <textarea
              required
              id="mensagem"
              name="mensagem"
              rows="4"
              value={formData.mensagem}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">Preferir agendar direto?</p>
          <a href="https://calendly.com/edu-prado" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-blue-600 font-semibold hover:underline">
            Agendar 30 min no Calendly
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </main>

      <Footer />
    </>
  )
}
