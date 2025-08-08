import Head from 'next/head'

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre | Edu Prado</title>
        <meta name="description" content="Ajudo líderes a decidir e executar IA onde faz diferença." />
        <meta property="og:title" content="Sobre | Edu Prado" />
        <meta property="og:description" content="Ajudo líderes a decidir e executar IA onde faz diferença." />
      </Head>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Sobre</h1>
        <p className="mb-6">Ajudo líderes a decidir e executar IA onde faz diferença. Minha abordagem é prática, mensurável e livre de hype.</p>
        <h2 className="text-2xl font-semibold mb-2">Hoje eu atuo em</h2>
        <ul className="list-disc list-inside mb-6">
          <li>Consultoria e projetos-piloto de IA</li>
          <li>Palestras e workshops executivos</li>
          <li>Mentorias 1:1 e advisory</li>
          <li>Conteúdo aberto em blog e newsletter</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-2">Como cheguei aqui</h2>
        <p className="mb-6">Foram mais de duas décadas no mercado financeiro liderando times de tecnologia, dados e Open Finance. Vivi a transição de sistemas legados para plataformas abertas e vi de perto o que funciona e o que é apenas buzzword. Hoje aplico essa experiência para conectar IA a problemas reais de negócios e setor público.</p>
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/eduprado" className="text-blue-600">LinkedIn</a>
          <a href="/blog" className="text-blue-600">Blog</a>
        </div>
      </main>
    </>
  )
}
