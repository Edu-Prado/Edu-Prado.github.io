import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Página não encontrada | Edu Prado</title>
        <meta name="description" content="A página que você está procurando não existe ou foi movida." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <Navbar />

      <main className="pt-24 pb-16 bg-slate-50/50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-xl">
          <span className="px-3.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            Erro 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Página não encontrada
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light mb-10">
            Desculpe, o conteúdo que você tentou acessar não está disponível, foi movido ou o link está incorreto. Vamos voltar para um caminho seguro?
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/" 
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm text-sm text-center"
            >
              Voltar para a Home
            </Link>
            <Link 
              href="/blog" 
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition text-sm text-center"
            >
              Explorar o Blog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
