import Head from 'next/head'

export default function Contato() {
  return (
    <>
      <Head>
        <title>Contato | Edu Prado</title>
        <meta name="description" content="Agende 30 minutos para mapear oportunidades reais." />
        <meta property="og:title" content="Contato | Edu Prado" />
        <meta property="og:description" content="Agende 30 minutos para mapear oportunidades reais." />
      </Head>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Contato</h1>
        <form className="max-w-xl space-y-4">
          <div>
            <label className="block mb-1" htmlFor="nome">Nome</label>
            <input id="nome" name="nome" type="text" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-1" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-1" htmlFor="org">Organização</label>
            <input id="org" name="org" type="text" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-1" htmlFor="mensagem">Mensagem</label>
            <textarea id="mensagem" name="mensagem" rows="4" className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded">Enviar</button>
        </form>
        <p className="mt-6">Ou <a href="https://calendly.com" className="text-blue-600">agende 30 min</a>.</p>
      </main>
    </>
  )
}
