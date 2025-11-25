import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Post from '../components/Post'

export default function PostPage() {
    const router = useRouter()
    const { id } = router.query
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (router.isReady) {
            if (id) {
                fetchPost(id)
            } else {
                setLoading(false)
                setErrorMsg('ID não fornecido na URL.')
            }
        }
    }, [router.isReady, id])

    async function fetchPost(postId) {
        try {
            console.log('Fetching post for id:', postId)
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single()

            if (error) throw error
            if (!data) throw new Error('Post não encontrado (data null)')

            setPost(data)
        } catch (error) {
            console.error('Erro ao buscar post:', error)
            setErrorMsg(`Erro: ${error.message || 'Artigo não encontrado'}. ID buscado: ${postId}`)
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
                    <h1 className="text-2xl font-bold text-gray-700">Ops! Algo deu errado.</h1>
                    <p className="text-red-500 mt-2">{errorMsg}</p>
                    <button onClick={() => router.push('/blog')} className="mt-4 text-blue-600 hover:underline">Voltar para o Blog</button>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="pt-24">
                <Post post={post} />
            </main>
            <Footer />
        </>
    )
}
