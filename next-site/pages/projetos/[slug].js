import { useRouter } from 'next/router'
import Head from 'next/head'
import { projects } from '../../data/projects'

export default function Projeto() {
  const router = useRouter()
  const { slug } = router.query
  const project = projects.find(p => p.slug === slug)
  if (!project) return null
  return (
    <>
      <Head>
        <title>{project.title} | Projeto | Edu Prado</title>
        <meta name="description" content={project.excerpt} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.excerpt} />
      </Head>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <p className="mb-6">{project.excerpt}</p>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Desafio</h2>
            <p>{project.challenge}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">Abordagem</h2>
            <p>{project.approach}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">Resultado</h2>
            <p>{project.result}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">Aprendizados</h2>
            <p>{project.learnings}</p>
          </section>
        </div>
      </main>
    </>
  )
}
