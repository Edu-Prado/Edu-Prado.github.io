import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Post from '../../components/Post'

export default function BlogPost({ post }) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-12 min-h-screen flex justify-center">
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
        <main className="pt-32 pb-12 min-h-screen container mx-auto px-4 text-center">
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
      <main className="pt-20">
        <Post post={post} />
      </main>
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug')

    if (error) throw error

    const paths = (posts || [])
      .filter(post => post.slug)
      .map(post => ({
        params: { slug: post.slug }
      }))

    return {
      paths,
      fallback: false
    }
  } catch (error) {
    console.error('Error generating static paths for blog:', error)
    return {
      paths: [],
      fallback: false
    }
  }
}

export async function getStaticProps({ params }) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error) throw error

    return {
      props: {
        post
      }
    }
  } catch (error) {
    console.error(`Error generating static props for blog slug ${params?.slug}:`, error)
    return {
      props: {
        post: null
      }
    }
  }
}

