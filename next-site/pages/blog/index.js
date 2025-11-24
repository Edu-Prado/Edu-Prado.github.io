import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { posts } from '../../data/posts'

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog | Edu Prado</title>
        <meta name="description" content="Artigos práticos sobre IA, dados e transformação digital." />
        <meta property="og:title" content="Blog | Edu Prado" />
        <meta property="og:description" content="Artigos práticos sobre IA, dados e transformação digital." />
      </Head>

      <Navbar />

      <main className="pt-24 pb-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Blog</h1>
            <p className="text-xl text-gray-600">Insights práticos sobre tecnologia e inovação.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <article key={post.slug} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col border border-gray-100">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {post.tag}
                    </span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-gray-900 leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-blue-600 font-semibold hover:underline mt-auto">
                    Ler artigo
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
