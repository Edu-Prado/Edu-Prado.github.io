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
            Conversas & Prática
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
            Palestras, workshops e conversas sobre IA aplicada
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-light max-w-3xl mx-auto">
            Uso minha experiência em liderança, dados, Open Finance e transformação digital para construir conversas práticas sobre inteligência artificial, especialmente para públicos não técnicos.
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
                1. Temas para palestras e conversas
              </h2>
              <p className="text-slate-600 leading-relaxed font-light">
                Temas que posso desenvolver em apresentações, rodas de conversa, eventos internos ou encontros com equipes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h3 className="font-bold text-slate-800 text-lg mb-2">IA sem hype: como separar valor real de modinha</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">Uma análise honesta e focada em resultados sobre onde a IA realmente brilha e como as empresas podem evitar armadilhas de investimentos guiados por hype, pressão de mercado ou modismo tecnológico.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h3 className="font-bold text-slate-800 text-lg mb-2">IA para profissionais não técnicos</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">Como gerentes de negócios, advogados, analistas financeiros, administrativos e outros profissionais podem usar IA generativa para melhorar sua rotina de trabalho com mais clareza, velocidade e qualidade, sem precisar programar.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h3 className="font-bold text-slate-800 text-lg mb-2">Como líderes podem tomar melhores decisões sobre IA</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">Um guia prático para líderes e executivos priorizarem oportunidades reais de aplicação de IA, gerenciarem custos, riscos e expectativas, e prepararem bases sólidas para adoção.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h3 className="font-bold text-slate-800 text-lg mb-2">O futuro do trabalho na era da IA</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">As novas competências exigidas pelo mercado de trabalho contemporâneo, com foco em pensamento analítico, curadoria crítica e prompting de negócios — a capacidade de formular boas perguntas, contextos e instruções para usar IA melhor.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition md:col-span-2">
                <h3 className="font-bold text-slate-800 text-lg mb-2">Dados, Open Finance e transformação digital</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">Uma conversa sobre como dados compartilhados, Open Finance e leitura estratégica da informação podem transformar produtos, jornadas e decisões no setor financeiro.</p>
              </div>
            </div>
          </section>

          {/* Section: Workshops */}
          <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
                2. Workshops sob demanda
              </h2>
              <p className="text-slate-600 leading-relaxed font-light mb-4">
                Formatos práticos, desenhados conforme a necessidade de cada equipe, para transformar conceitos de IA, dados e produtividade em discussões aplicáveis.
              </p>
              <p className="text-sm text-slate-500 font-normal italic bg-slate-50 border border-slate-100 p-4 rounded-xl inline-block">
                <strong>Possíveis entregáveis, conforme o formato combinado:</strong> matriz de oportunidades, roteiro de experimentação, guia de prompts, mapa de riscos e próximos passos.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Como identificar bons casos de uso de IA</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light">Treinamento prático focado em capacitar gestores a aplicarem matrizes de priorização (Impacto vs. Viabilidade) em seus próprios setores de atuação.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Como usar IA para produtividade pessoal e profissional</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light">Capacitação focada no uso cotidiano de IA generativa. Os participantes aprendem técnicas práticas de prompts, síntese de documentos e automação de fluxos simples de trabalho.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Como estruturar um backlog de oportunidades com IA</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light">Mapeamento estruturado de frentes operacionais que podem ser otimizadas com inteligência analítica, desenhando um caminho prático para prototipar, testar e aprender com menor risco.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">IA aplicada a áreas de negócio</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light">Discussão prática sobre como áreas como vendas, marketing, finanças, RH ou jurídico podem usar IA de forma segura, útil e orientada a resultados.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition">
                <h4 className="font-bold text-slate-800 text-lg mb-2">Dados como base para inovação</h4>
                <p className="text-slate-650 text-sm leading-relaxed font-light">Como arrumar a casa dos dados, organizar fluxos de dados, integrações e bases confiáveis antes de iniciar projetos analíticos complexos.</p>
              </div>
            </div>
          </section>

          {/* Section: Mentorias */}
          <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
                  3. Conversas estratégicas individuais
                </h2>
                <p className="text-slate-600 leading-relaxed font-light text-sm sm:text-base">
                  Conversas individuais ou em pequenos grupos para profissionais que querem discutir IA, carreira, produtividade, liderança, dados ou transformação digital com uma visão prática e sem jargões.
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
                    <span>Mais de 20 anos de experiência no setor financeiro.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Vivência em liderança, crédito, dados, Open Finance, integração de sistemas e transformação digital.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Experiência em ambientes corporativos regulados e complexos.</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Capacidade de traduzir temas técnicos para decisões de negócio.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Foco em aplicação prática, linguagem clara e senso crítico.</span>
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
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Apresentação</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Ideal para eventos corporativos, encontros de equipes ou alinhamentos internos. Foco inspirador e prático.</p>
                </div>
                <div className="text-xs font-bold text-slate-400 pt-4 border-t border-slate-50">Duração: 45 a 60 min</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-full block w-max mb-4">Workshop</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Workshop sob demanda</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Formato prático para capacitar equipes a discutirem problemas reais, priorizarem oportunidades e estruturarem próximos passos com IA e dados.</p>
                </div>
                <div className="text-xs font-bold text-slate-400 pt-4 border-t border-slate-50">Duração: 2h a 4h</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2.5 py-1 rounded-full block w-max mb-4">Conversa</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Conversa Individual</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Discussão focada para alinhar caminhos, discutir carreira, produtividade, dados ou transformação digital de forma prática.</p>
                </div>
                <div className="text-xs font-bold text-slate-400 pt-4 border-t border-slate-50">Formato: Individual</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2.5 py-1 rounded-full block w-max mb-4">Alinhamento</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">Bate-papo Inicial</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Alinhamento inicial rápido para entender o contexto e alinhar as expectativas da equipe ou organização.</p>
                </div>
                <div className="text-xs font-bold text-slate-400 pt-4 border-t border-slate-50">Formato: Alinhamento</div>
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
