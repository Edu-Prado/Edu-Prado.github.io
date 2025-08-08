import Head from 'next/head'

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
      </Head>
      <article className="prose lg:prose-xl mx-auto py-8">
        <h1>{post.title}</h1>
        <p className="text-sm text-gray-500">{post.date} • {minutes} min de leitura</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="p-4 border rounded mt-8 bg-gray-50">
          <h2 className="font-semibold mb-2">Aplicar na prática</h2>
          <p>{post.apply}</p>
        </div>
      </article>
    </>
  )
}
