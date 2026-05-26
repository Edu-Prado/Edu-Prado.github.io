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
            Ajudo profissionais, equipes e organizações a entenderem a inteligência artificial com clareza, senso crítico e foco em aplicações reais.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contato" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/10 transition">
              Quero conversar sobre uma palestra ou workshop ➔
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
                Treinamentos práticos e de imersão ("mão na massa") projetados para capacitar seus colaboradores na prática, saindo com ideias e fluxogramas prontos para execução.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Como identificar bons casos de uso de IA</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light mb-3">Treinamento prático focado em capacitar gestores a aplicarem matrizes de priorização (Impacto vs. Viabilidade) em seus próprios setores de atuação.</p>
                <span className="inline-block text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">Entregável: Matriz de backlog de prioridades</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Como usar IA para produtividade pessoal e profissional</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light mb-3">Capacitação focada no uso cotidiano de IA Generativa. Seus colaboradores aprenderão engenharia de prompts avançada, técnicas de síntese de documentos e automação de fluxos de trabalho.</p>
                <span className="inline-block text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">Entregável: Biblioteca de Prompts e Guias Internos</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Como estruturar um backlog de oportunidades com IA</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light mb-3">Mapeamento estruturado de frentes operacionais que podem ser otimizadas com inteligência analítica, desenhando uma esteira ágil de prototipação e testes.</p>
                <span className="inline-block text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">Entregável: Pipeline de protótipos de IA</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">IA aplicada a áreas de negócio</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light mb-3">Alinhamento tático de frentes operacionais (vendas, marketing, finanças, RH ou jurídico) para a utilização segura e orientada a resultados de novas ferramentas analíticas.</p>
                <span className="inline-block text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">Entregável: Playbook prático por setor</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Dados como base para inovação</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light mb-3">Como arrumar a casa dos dados, estruturar barramentos inteligentes e preparar a infraestrutura corporativa antes de iniciar projetos analíticos complexos.</p>
                <span className="inline-block text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">Entregável: Roadmap de Maturidade de Dados</span>
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
                  Também realizo conversas individuais ou em pequenos grupos para profissionais que querem entender como aplicar IA em sua carreira, rotina, liderança ou projetos.
                </p>
                <p className="text-slate-600 leading-relaxed font-light text-sm sm:text-base">
                  Ideal para executivos e profissionais que buscam direcionamento pragmático sem rodeios, desmistificando o hype técnico para focar em oportunidades reais.
                </p>
              </div>
              <div className="w-full md:w-max shrink-0 bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 block">Formato Flexível</span>
                <div className="font-bold text-slate-800 mb-4 text-[15px]">Online ou Presencial</div>
                <Link href="/contato" className="inline-block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition">
                  Agendar conversa ➔
                </Link>
              </div>
            </div>
          </section>

          {/* New Section: Por que conversar comigo sobre isso? */}
          <section className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
                Por que conversar comigo sobre isso?
              </h2>
              <div className="grid gap-6 md:grid-cols-2 text-slate-300 text-[15px] font-light leading-relaxed">
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Mais de 20 anos de experiência</strong> no setor financeiro liderando equipes de ponta.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Atuação estratégica real em <strong>dados, Open Finance, IA aplicada e transformação digital</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Sólida experiência em <strong>liderança corporativa em ambientes regulados e complexos</strong>.</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Extrema capacidade de <strong>traduzir tecnologia complexa para valor real de negócios</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Foco inabalável em aplicação prática</strong>, livre de jargões técnicos excessivos ("tech-ês") e hype publicitário.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Formatos Possíveis (Sem Preços) */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Formatos disponíveis</h2>
              <p className="text-slate-500 text-sm font-light mt-2">Escolha o formato que melhor se adapta à necessidade da sua equipe ou organização.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full block w-max mb-4">Palestra</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Palestra Executiva</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Ideal para eventos corporativos, kickoff de projetos ou alinhamentos anuais. Foco inspirador e prático.</p>
                </div>
                <div className="text-xs font-bold text-slate-400 pt-4 border-t border-slate-50">Duração: 45 a 60 min</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-full block w-max mb-4">Workshop</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Workshop Prático</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Formato "mão na massa" para capacitar equipes a desenharem fluxos reais com ferramentas e frameworks analíticos.</p>
                </div>
                <div className="text-xs font-bold text-slate-400 pt-4 border-t border-slate-50">Duração: 2h a 4h</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2.5 py-1 rounded-full block w-max mb-4">Mentoria</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Mentoria Estratégica</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Sessão individual dedicada para aceleração profissional de lideranças, alinhamento de carreira ou projetos.</p>
                </div>
                <div className="text-xs font-bold text-slate-400 pt-4 border-t border-slate-50">Formato: Individual</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2.5 py-1 rounded-full block w-max mb-4">Diagnóstico</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Conversa Inicial</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Alinhamento consultivo inicial para mapear as dores e oportunidades da sua organização antes da customização.</p>
                </div>
                <div className="text-xs font-bold text-slate-400 pt-4 border-t border-slate-50">Formato: Diagnóstico</div>
              </div>
            </div>

            <div className="text-center pt-6">
              <Link href="/contato" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/10 transition">
                Quero conversar sobre uma palestra ou workshop ➔
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
