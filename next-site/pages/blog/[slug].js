import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Post from '../../components/Post'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchPost(slug)
    }
  }, [slug])

  async function fetchPost(slug) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Erro ao buscar post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
