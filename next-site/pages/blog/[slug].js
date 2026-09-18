import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Post from '../../components/Post'

export default function BlogPost({ post }) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <>
        <Navbar />
        <main id="conteudo" className="pt-32 pb-12 min-h-screen flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main id="conteudo" className="pt-32 pb-12 min-h-screen container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Artigo não encontrado</h1>
          <button onClick={() => router.push('/blog')} className="mt-4 text-blue-600 hover:underline">Voltar para o Blog</button>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main id="conteudo" className="pt-20">
        <Post post={post} />
      </main>
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  const { getPublishedPosts } = await import('../../lib/posts.server')
  const posts = await getPublishedPosts()
  const slugs = [...new Set(posts.filter(post => post.slug).map(post => String(post.slug).trim()))]
  return { paths: slugs.map(slug => ({ params: { slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const { getPublishedPosts } = await import('../../lib/posts.server')
  const posts = await getPublishedPosts()
  const post = posts.find(post => String(post.slug).trim() === params.slug)
  if (!post) return { notFound: true }
  return { props: { post } }
}
