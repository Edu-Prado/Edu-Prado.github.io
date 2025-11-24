import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Blog() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPosts(data || [])
        } catch (error) {
            console.error('Erro ao buscar posts:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Head>
                <title>Blog | Edu Prado</title>
                <meta name="description" content="Artigos práticos sobre IA, dados e transformação digital." />
            </Head>

            <Navbar />

            <main className="pt-24 pb-12 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 text-gray-900">Blog</h1>
                        <p className="text-xl text-gray-600">Insights práticos sobre tecnologia e inovação.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map(post => (
                                <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col border border-gray-100">
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                {post.tag || 'Geral'}
                                            </span>
                                            <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                                        </div>

                                        <h2 className="text-xl font-bold mb-3 text-gray-900 leading-tight">
                                            <Link href={`/post?slug=${post.slug}`} className="hover:text-blue-600 transition">
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <Link href={`/post?slug=${post.slug}`} className="inline-flex items-center text-blue-600 font-semibold hover:underline mt-auto">
                                            Ler artigo
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    )
}
