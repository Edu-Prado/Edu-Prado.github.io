import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { projects } from '../../data/projects'

export default function Projeto({ project }) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </main>
        <Footer />
      </>
    )
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Projeto não encontrado</h1>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{project.title} | Projeto | Edu Prado</title>
        <meta name="description" content={project.excerpt} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.excerpt} />
      </Head>
      <Navbar />
      <main className="container mx-auto px-4 py-24 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <p className="mb-6 text-gray-600 text-lg">{project.excerpt}</p>
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Desafio</h2>
            <p className="text-gray-700 leading-relaxed">{project.challenge}</p>
          </section>
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Abordagem</h2>
            <p className="text-gray-700 leading-relaxed">{project.approach}</p>
          </section>
          {project.result && (
            <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Resultado</h2>
              <p className="text-gray-700 leading-relaxed">{project.result}</p>
            </section>
          )}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Aprendizados</h2>
            <p className="text-gray-700 leading-relaxed">{project.learnings}</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  const paths = projects.map(p => ({
    params: { slug: p.slug }
  }))
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const project = projects.find(p => p.slug === params.slug) || null
  return {
    props: {
      project
    }
  }
}

