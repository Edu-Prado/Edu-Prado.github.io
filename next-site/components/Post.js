import Head from 'next/head'
import AdSense from './AdSense'

function readingTime(text) {
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200)
}

export default function Post({ post }) {
  const minutes = readingTime(post.content)
  return (
    <>
      <Head>
        <title>{post.title} | Edu Prado</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {/* AdSense Script */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7782077901383981" crossOrigin="anonymous"></script>
      </Head>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{post.tag}</span>
            <span className="text-gray-500 text-sm">• {minutes} min de leitura</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
        </header>

        <div className="prose prose-lg prose-blue mx-auto text-gray-800">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Aplicar na prática
          </h2>
          <p className="text-blue-800">{post.apply}</p>
        </div>

        {/* AdSense Slot - Bottom of Article */}
        <AdSense slot="2887166563" />
      </article>
    </>
  )
}
