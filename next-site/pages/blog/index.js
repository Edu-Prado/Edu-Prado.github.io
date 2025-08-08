import Head from 'next/head'
import Link from 'next/link'
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
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <div className="space-y-8">
          {posts.map(post => (
            <article key={post.slug} className="border-b pb-6">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-sm text-gray-500 mb-2">{post.date} • {post.tag}</p>
              <p className="mb-2">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium">Ler mais</Link>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
