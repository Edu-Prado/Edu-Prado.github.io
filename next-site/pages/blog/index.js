import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Blog({ allPosts }) {
    const [posts, setPosts] = useState(allPosts || [])
    const [filteredPosts, setFilteredPosts] = useState(allPosts || [])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todos')

    const categories = [
        'Todos',
        'IA na prática',
        'IA e negócios',
        'Dados e Open Finance',
        'Ferramentas de IA',
        'Carreira e futuro do trabalho',
        'Opinião e tendências'
    ]

    useEffect(() => {
        let filtered = posts;

        // 1. Search filter
        if (searchTerm.trim() !== '') {
            const lowerTerm = searchTerm.toLowerCase()
            filtered = filtered.filter(post =>
                (post.title && post.title.toLowerCase().includes(lowerTerm)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(lowerTerm)) ||
                (post.category && post.category.toLowerCase().includes(lowerTerm)) ||
                (post.tag && post.tag.toLowerCase().includes(lowerTerm))
            )
        }

        // 2. Category filter
        if (selectedCategory !== 'Todos') {
            filtered = filtered.filter(post => {
                const postCat = post.category || post.tag || '';
                return postCat.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
            })
        }

        setFilteredPosts(filtered)
    }, [searchTerm, selectedCategory, posts])

    return (
        <>
            <Head>
                <title>Blog | IA, dados e transformação digital sem tech-ês</title>
                <meta name="description" content="Artigos práticos e acessíveis sobre inteligência artificial, dados, tecnologia, carreira, negócios e futuro do trabalho." />
                <meta property="og:title" content="Blog | IA, dados e transformação digital sem tech-ês" />
                <meta property="og:description" content="Artigos práticos e acessíveis sobre inteligência artificial, dados, tecnologia, carreira, negócios e futuro do trabalho." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://eduprado.me/blog/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Blog | IA, dados e transformação digital sem tech-ês" />
                <meta name="twitter:description" content="Artigos práticos e acessíveis sobre inteligência artificial, dados, tecnologia, carreira, negócios e futuro do trabalho." />

                {/* Breadcrumb List Schema Markup */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      "itemListElement": [
                        {
                          "@type": "ListItem",
                          "position": 1,
                          "name": "Home",
                          "item": "https://eduprado.me/"
                        },
                        {
                          "@type": "ListItem",
                          "position": 2,
                          "name": "Blog",
                          "item": "https://eduprado.me/blog/"
                        }
                      ]
                    })
                  }}
                />
            </Head>

            <Navbar />

            <main className="pt-24 pb-16 bg-slate-50/50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6">
                    
                    {/* Magazine Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="px-3.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                            Vitrine Editorial
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            Artigos sobre IA, dados e transformação digital
                        </h1>
                        <p className="text-base sm:text-lg text-slate-650 leading-relaxed font-light mb-8 max-w-xl mx-auto">
                            Reflexões práticas, críticas e acessíveis sobre inteligência artificial, tecnologia, carreira, negócios e o futuro do trabalho.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto relative shadow-sm rounded-full overflow-hidden">
                            <input
                                type="text"
                                placeholder="Buscar artigos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-5 py-3.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full text-sm placeholder:text-slate-400 transition"
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute right-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Interactive Category Pills */}
                    <div className="max-w-4xl mx-auto mb-10 overflow-x-auto scrollbar-hide py-2 flex justify-start sm:justify-center items-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition shrink-0 duration-200 ${
                                    selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                                        : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200/80'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                            {filteredPosts.map(post => {
                                // Dynamic reading time estimation
                                const words = post.content ? post.content.split(/\s+/).length : 0
                                const minutes = Math.max(1, Math.ceil(words / 200))
                                
                                return (
                                    <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col border border-slate-100 hover:border-slate-200/70 duration-300">
                                        {post.image_url && (
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover hover:scale-[1.02] transition duration-500"
                                                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none' }}
                                                />
                                            </div>
                                        )}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-4 text-xs font-bold">
                                                <span className="tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                                    {post.category || post.tag || 'Geral'}
                                                </span>
                                                <span className="text-slate-400 font-medium flex items-center gap-1">
                                                    <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                                                    <span>•</span>
                                                    <span>{minutes} min</span>
                                                </span>
                                            </div>

                                            <h2 className="text-[19px] font-extrabold mb-3 text-slate-800 leading-snug hover:text-blue-600 transition">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {post.title}
                                                </Link>
                                            </h2>

                                            <p className="text-slate-650 text-[14px] leading-relaxed mb-6 flex-1 line-clamp-3 font-light">
                                                {post.excerpt}
                                            </p>

                                            <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline mt-auto">
                                                Ler artigo
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </Link>
                                        </div>
                                    </article>
                                )
                            })}
                            {filteredPosts.length === 0 && (
                                <div className="col-span-full text-center text-slate-500 py-16 bg-white rounded-2xl border border-slate-100/60 shadow-sm max-w-xl mx-auto w-full">
                                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-bold text-slate-800 mb-1">Nenhum artigo encontrado</p>
                                    <p className="text-sm font-light text-slate-400">Tente buscar por outro termo ou selecione a categoria "Todos".</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    )
}

export async function getStaticProps() {
    try {
        const { supabase } = await import('../../lib/supabaseClient');
        
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return {
            props: {
                allPosts: posts || []
            }
        };
    } catch (error) {
        console.error('Error in getStaticProps for blog index:', error);
        return {
            props: {
                allPosts: []
            }
        };
    }
}
