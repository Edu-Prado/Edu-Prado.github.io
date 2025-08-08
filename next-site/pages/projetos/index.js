import Head from 'next/head'
import ProjectCard from '../../components/ProjectCard'
import { projects } from '../../data/projects'

export default function Projetos() {
  return (
    <>
      <Head>
        <title>Projetos | Edu Prado</title>
        <meta name="description" content="Estudos de caso com resultados e aprendizados." />
        <meta property="og:title" content="Projetos | Edu Prado" />
        <meta property="og:description" content="Estudos de caso com resultados e aprendizados." />
      </Head>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Projetos</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map(p => (
            <ProjectCard key={p.slug} {...p} />
          ))}
        </div>
      </main>
    </>
  )
}
