import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Palestras() {
  return (
    <>
      <Head>
        <title>Palestras e Workshops sobre IA aplicada | Edu Prado</title>
        <meta name="description" content="Palestras, workshops e conversas estratégicas sobre inteligência artificial aplicada, dados, produtividade e transformação digital para profissionais e organizações." />
        <meta property="og:title" content="Palestras e Workshops sobre IA aplicada | Edu Prado" />
        <meta property="og:description" content="Palestras, workshops e conversas estratégicas sobre inteligência artificial aplicada, dados, produtividade e transformação digital para profissionais e organizações." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduprado.me/palestras/" />
        <meta property="og:image" content="https://eduprado.me/images/profile.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Palestras e Workshops sobre IA aplicada | Edu Prado" />
        <meta name="twitter:description" content="Palestras, workshops e conversas estratégicas sobre inteligência artificial aplicada, dados, produtividade e transformação digital para profissionais e organizações." />
        <meta name="twitter:image" content="https://eduprado.me/images/profile.jpg" />

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
                  "name": "Palestras",
                  "item": "https://eduprado.me/palestras/"
                }
              ]
            })
          }}
        />
      </Head>

      <Navbar />

      <main className="pt-24 pb-16 bg-slate-50/50 min-h-screen">
        {/* Page Hero */}
        <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
            Serviços Corporativos & Educação
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
            Palestras, workshops e conversas sobre IA aplicada
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
            Ajudo profissionais, equipes corporativas e organizações a entenderem a inteligência artificial com clareza, senso crítico e foco absoluto em aplicações e retornos reais.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contato" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/10 transition">
              Fale comigo ➔
            </Link>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-20">
          
          {/* Section: Palestras */}
          <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
                1. Palestras Corporativas
              </h2>
              <p className="text-slate-600 leading-relaxed font-light">
                Apresentações inspiradoras e realistas, desenhadas para desmistificar a tecnologia e capacitar equipes não técnicas sobre os cenários analíticos e o futuro operacional.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h3 className="font-bold text-slate-800 text-lg mb-2">IA sem hype: como separar valor real de modinha</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">Uma análise honesta e focada em resultados sobre onde a IA realmente brilha e como as empresas podem evitar armadilhas de investimentos publicitários.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h3 className="font-bold text-slate-800 text-lg mb-2">IA para profissionais não técnicos</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">Como gerentes de negócios, advogados, analistas financeiros e administrativos podem adotar ferramentas de IA generativa para turbinar sua rotina produtiva sem programar.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h3 className="font-bold text-slate-800 text-lg mb-2">Como líderes podem tomar melhores decisões sobre IA</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">Um guia prático para diretores e executivos definirem backlogs de oportunidades, gerenciarem custos de infraestrutura e organizarem bases sólidas.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h3 className="font-bold text-slate-800 text-lg mb-2">O futuro do trabalho na era da IA</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">As novas competências exigidas pelo mercado de trabalho contemporâneo, com foco em pensamento analítico, curadoria crítica e prompting de negócios.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition md:col-span-2">
                <h3 className="font-bold text-slate-800 text-lg mb-2">Dados, Open Finance e transformação digital</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">Entenda o ecossistema financeiro aberto nacional (Open Finance) e como a centralização, estruturação e leitura estratégica de dados compartilhados transformam produtos de fintechs e bancos.</p>
              </div>
            </div>
          </section>

          {/* Section: Workshops */}
          <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
                2. Workshops Corporativos Imersivos
              </h2>
              <p className="text-slate-600 leading-relaxed font-light">
                Treinamentos de imersão ("mão na massa") projetados para capacitar seus colaboradores na prática, saindo com ideias e fluxogramas de processos prontos para execução.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Como identificar bons casos de uso de IA</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-light mb-3">Treinamento prático focado em capacitar gestores a aplicarem matrizes de priorização (Impacto vs. Viabilidade) em seus próprios setores de atuação corporativa.</p>
                <span className="inline-block text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">Entregável: Matriz de backlog de prioridades</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Como usar IA para produtividade pessoal e profissional</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-light mb-3">Capacitação focada no uso cotidiano de IA Generativa. Seus colaboradores aprenderão engenharia de prompts avançada, técnicas de síntese documental e automação básica de planilhas e e-mails.</p>
                <span className="inline-block text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">Entregável: Biblioteca de Prompts e Guias Internos</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Dados como base para inovação & Open Finance</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-light mb-3">Alinhamento de equipes de produto, tecnologia e dados para estruturar a inovação e o desenho de jornadas financeiras integradas e de alta conversão usando dados regulatórios abertos.</p>
                <span className="inline-block text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">Entregável: Roteiro de Arquitetura de Valor de Open Data</span>
              </div>
            </div>
          </section>

          {/* Section: Mentorias */}
          <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
                  3. Mentorias & Conversas Estratégicas
                </h2>
                <p className="text-slate-600 leading-relaxed font-light mb-4 text-sm sm:text-base">
                  Realizo sessões individuais exclusivas ou em pequenos comitês corporativos para profissionais, líderes e fundadores de negócios que desejam acelerar ou guiar projetos de tecnologia analítica.
                </p>
                <p className="text-slate-600 leading-relaxed font-light text-sm sm:text-base">
                  Ideal para quem busca direcionamento pragmático de carreira na era digital, governança enxuta de inovação financeira ou alinhamento tático de processos.
                </p>
              </div>
              <div className="w-full md:w-max shrink-0 bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 block">Formato Flexível</span>
                <div className="font-bold text-slate-800 mb-4 text-[15px]">Online ou Presencial</div>
                <Link href="/contato" className="inline-block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition">
                  Agendar conversa
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
