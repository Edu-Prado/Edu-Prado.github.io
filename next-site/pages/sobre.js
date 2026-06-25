import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre Eduardo Prado | Especialista em Inteligência Artificial e Transformação Digital</title>
        <meta name="description" content="Conheça Eduardo Prado, especialista com mais de 20 anos de experiência. Aprenda como aplicar Inteligência Artificial, dados e Open Finance aos negócios de forma prática e sem tech-ês." />
        <meta property="og:title" content="Sobre Eduardo Prado | Especialista em Inteligência Artificial e Transformação Digital" />
        <meta property="og:description" content="Conheça Eduardo Prado, especialista com mais de 20 anos de experiência. Aprenda como aplicar Inteligência Artificial, dados e Open Finance aos negócios de forma prática e sem tech-ês." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduprado.me/sobre/" />
        <meta property="og:image" content="https://eduprado.me/images/profile.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sobre Eduardo Prado | Especialista em Inteligência Artificial e Transformação Digital" />
        <meta name="twitter:description" content="Conheça Eduardo Prado, especialista com mais de 20 anos de experiência. Aprenda como aplicar Inteligência Artificial, dados e Open Finance aos negócios de forma prática e sem tech-ês." />
        <meta name="twitter:image" content="https://eduprado.me/images/profile.jpg" />

        {/* Person Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Eduardo Prado",
              "url": "https://eduprado.me/sobre/",
              "image": "https://eduprado.me/images/profile.jpg",
              "jobTitle": "Executivo de IA, Dados e Inovação Financeira",
              "worksFor": {
                "@type": "Organization",
                "name": "Setor Financeiro"
              },
              "description": "Profissional com mais de 20 anos de experiência no setor financeiro, atuando com liderança, dados, Open Finance, inteligência artificial aplicada e transformação digital.",
              "sameAs": [
                "https://www.linkedin.com/in/eduardo-prado-bb5174123/"
              ]
            })
          }}
        />
      </Head>

      <Navbar />

      <main className="pt-24 pb-16 bg-slate-50/50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-16 pb-12 border-b border-slate-100">
            <div className="relative shrink-0">
              <img 
                src="/images/profile.jpg" 
                alt="Eduardo Prado" 
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover ring-8 ring-white shadow-lg"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250' }}
              />
            </div>
            <div className="text-center md:text-left">
              <span className="px-3.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                Quem Sou Eu
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                Sobre Eduardo Prado
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed font-light max-w-lg">
                Traduzindo inteligência artificial, dados e tecnologia em linguagem prática, sem tech-ês e focada em valor de verdade.
              </p>
            </div>
          </div>

          {/* Biography Content Blocks */}
          <div className="space-y-12 text-slate-800 leading-relaxed text-[16px] sm:text-[17px] font-normal prose prose-slate max-w-none">
            
            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Minha Trajetória
              </h2>
              <p className="mb-4">
                Sou um profissional do setor financeiro com **mais de 20 anos de experiência corporativa**. Ao longo da minha carreira, atuei em ambientes dinâmicos e altamente regulados, liderando frentes de **dados, Open Finance, integração de sistemas complexos, inteligência artificial aplicada e transformação digital**.
              </p>
              <p>
                Minha jornada é marcada por conectar pontas: tecnologia, estratégia de negócios, regulação e pessoas. Vivi de perto a transição de arquiteturas legadas para ecossistemas financeiros abertos e conheço bem o abismo que costuma existir entre o que a tecnologia promete e o que a operação real consegue entregar.
              </p>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Por que este site existe?
              </h2>
              <p className="mb-4">
                Criei o **EduPrado.me** com um objetivo muito claro: **traduzir a tecnologia para o mundo dos negócios sem "tech-ês"**. 
              </p>
              <p>
                O ecossistema corporativo atual está saturado de buzzwords, termos acadêmicos excessivamente complexos e discursos messiânicos de inteligência artificial. Meu papel aqui não é vender hype ou falsas soluções mágicas de inteligência artificial. O foco deste canal é **ajudar profissionais, líderes e organizações a entenderem o que realmente funciona** na prática e o que faz sentido financeiro e operacional aplicar em cada realidade.
              </p>
            </section>

            {/* Premium Position Statement Quote Box */}
            <section className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <h3 className="text-blue-900/40 text-5xl font-serif absolute top-3 left-4 select-none">“</h3>
              <p className="text-blue-950 font-medium text-lg leading-relaxed relative z-10 pl-6 italic">
                Acredito que a inteligência artificial não deve ser assunto restrito a especialistas. Ela precisa ser entendida por líderes, profissionais, estudantes, criadores e qualquer pessoa que queira participar melhor das decisões do presente e do futuro.
              </p>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Como penso sobre IA e Tecnologia
              </h2>
              <ul className="space-y-3 pl-4 list-disc marker:text-blue-600 text-slate-700">
                <li><strong>IA como Mudança de Processo:</strong> Integrar inteligência artificial não é sobre adicionar um novo robô de bate-papo, mas sobre reinventar a forma como tarefas são executadas no cotidiano corporativo.</li>
                <li><strong>Os Dados como Fundação:</strong> Não existe inteligência brilhante sem dados estruturados, limpos e acessíveis. A casa dos dados é a primeira tarefa obrigatória.</li>
                <li><strong>Linguagem Humana e Direta:</strong> Se você não consegue explicar como uma inovação tecnológica ajuda o seu negócio em duas frases simples e sem jargões, provavelmente você não entendeu o seu real valor.</li>
              </ul>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Temas que costumo explorar
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 mt-4 text-slate-700">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800 mb-1">IA Aplicada & Produtividade</div>
                  <div className="text-xs text-slate-500 font-light">Casos práticos de uso e eficiência na rotina profissional.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800 mb-1">Dados & Open Finance</div>
                  <div className="text-xs text-slate-500 font-light">Estratégia regulatória, inteligência de negócios e integrações financeiras.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800 mb-1">Liderança na Era Digital</div>
                  <div className="text-xs text-slate-500 font-light">Tomada de decisão baseada em fatos e direção analítica de equipes.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800 mb-1">Conteúdo e Educação Corporativa</div>
                  <div className="text-xs text-slate-500 font-light">Como capacitar equipes não técnicas para navegar pelas novas ferramentas.</div>
                </div>
              </div>
            </section>

            {/* Call to action */}
            <div className="text-center bg-blue-900 text-white rounded-3xl p-8 shadow-md">
              <h3 className="text-xl font-bold mb-3 text-white">Quer trazer esse debate para o seu time ou organização?</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-xl mx-auto font-light">
                Realizo palestras, workshops e conversas para apoiar seu time ou organização nessa jornada.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <Link href="/palestras" className="w-full sm:w-auto px-6 py-3 bg-white text-blue-900 font-bold rounded-xl transition hover:bg-blue-50 text-sm text-center">
                  Ver temas de palestras
                </Link>
                <Link href="/contato" className="w-full sm:w-auto px-6 py-3 bg-blue-800 text-white font-bold rounded-xl border border-blue-700 transition hover:bg-blue-850 text-sm text-center">
                  Falar comigo agora ➔
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
