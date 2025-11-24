import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AdSense from '../components/AdSense'
import Head from 'next/head'

function readingTime(text) {
    if (!text) return 0
    const words = text.split(/\s+/).length
    return Math.ceil(words / 200)
}

export default function PostPage() {
    const router = useRouter()
    const { slug } = router.query
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetchPost()
        }
    }, [slug])

    async function fetchPost() {
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

    const minutes = readingTime(post.content)

    return (
        <>
            <Head>
                <title>{post.title} | Edu Prado</title>
                <meta name="description" content={post.excerpt} />
                {/* AdSense Script */}
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7782077901383981" crossOrigin="anonymous"></script>
            </Head>

            <Navbar />

            <main className="pt-24">
                <article className="max-w-3xl mx-auto px-4 py-12">
                    <header className="mb-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{post.tag || 'Geral'}</span>
                            <span className="text-gray-500 text-sm">• {minutes} min de leitura</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
                        <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
                    </header>

                    <div className="prose prose-lg prose-blue mx-auto text-gray-800">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {post.apply && (
                        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Aplicar na prática
                            </h2>
                            <p className="text-blue-800">{post.apply}</p>
                        </div>
                    )}

                    <AdSense slot="2887166563" />
                </article>
            </main>

            <Footer />
        </>
    )
}
