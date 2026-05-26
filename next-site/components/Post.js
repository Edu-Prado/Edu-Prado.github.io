import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AdSense from './AdSense'
import { parseMarkdown } from '../lib/markdown'

function readingTime(text) {
  if (!text) return 0
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200)
}

export default function Post({ post }) {
  const minutes = readingTime(post.content)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
  }, [])

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <>
      <Head>
        <title>{post.title} | Edu Prado</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://eduprado.me/blog/${post.slug}/`} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.image_url && <meta name="twitter:image" content={post.image_url} />}
      </Head>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
            {post.category || post.tag || 'Geral'}
          </span>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-500 text-sm font-medium">{minutes} min de leitura</span>
        </div>

        {/* Title & Subtitle */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
            {post.excerpt}
          </p>

          {/* Author & Date Details */}
          <div className="flex items-center justify-center gap-3 mt-8 pb-8 border-b border-slate-100 max-w-lg mx-auto">
            <img 
              src="/images/profile.jpg" 
              alt="Edu Prado" 
              className="w-12 h-12 rounded-full object-cover ring-4 ring-blue-50 shadow-sm"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250' }}
            />
            <div className="text-left">
              <div className="font-bold text-slate-800 text-[15px]">Eduardo Prado</div>
              <div className="text-[13px] text-slate-400 font-normal">
                Publicado em {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Immersive Cover Image */}
          {post.image_url && (
            <div className="mt-10 rounded-2xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition duration-500 group">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-auto object-cover max-h-[480px] group-hover:scale-[1.01] transition duration-700" 
              />
            </div>
          )}
        </header>

        {/* AdSense Slot - Top of Article wrapped in clean editorial format */}
        <div className="my-10 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/85 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Publicidade</span>
          <div className="w-full min-h-[90px] flex justify-center items-center">
            <AdSense slot="2887166563" />
          </div>
        </div>

        {/* Main Content Body */}
        <div className="prose prose-base sm:prose-lg prose-slate mx-auto text-slate-800 leading-relaxed font-normal
          prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
          prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-p:mb-6 prose-p:leading-8
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-ul:my-6 prose-li:my-2
          prose-img:rounded-2xl prose-img:shadow-md">
          <div dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />
        </div>

        {/* Practical Application Box (High Contrast Glow Treatment) */}
        {post.apply && (
          <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100/70 shadow-sm relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Aplicar na prática
            </h3>
            <p className="text-blue-950 leading-relaxed text-[16px] whitespace-pre-line relative z-10 font-medium">
              {post.apply}
            </p>
          </div>
        )}

        {/* Social Sharing bar */}
        {shareUrl && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 py-5 border-y border-slate-100 text-slate-500 text-sm">
            <span className="font-medium">Gostou deste artigo? Compartilhe com sua rede:</span>
            <div className="flex items-center gap-3">
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-[#0077b5] hover:bg-slate-50 rounded-lg transition duration-200"
                title="Compartilhar no LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Veja esse artigo de Edu Prado: ${post.title} - ${shareUrl}`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-[#25D366] hover:bg-slate-50 rounded-lg transition duration-200"
                title="Enviar por WhatsApp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.839.002-2.628-1.023-5.1-2.885-6.963C16.58 1.94 14.113.916 11.49.914 6.052.914 1.628 5.326 1.625 10.75c-.001 1.639.499 3.242 1.448 4.82l-.999 3.647 3.573-.973z"/>
                </svg>
              </a>
              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition duration-200 ${
                  copied 
                    ? 'bg-green-50 border-green-200 text-green-600' 
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
                title="Copiar link"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Link copiado!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copiar link
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Premium Author Bio Footer Box */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left bg-slate-50/40 p-6 sm:p-8 rounded-2xl border border-slate-100/60 shadow-sm">
          <img 
            src="/images/profile.jpg" 
            alt="Edu Prado" 
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md shrink-0"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250' }}
          />
          <div>
            <h4 className="font-extrabold text-lg text-slate-800 mb-2">Eduardo Prado</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Executivo do mercado financeiro, apaixonado por tecnologia, games e gadgets. Traduzo o universo da inteligência artificial e transformação digital para a vida prática, sem rodeios ou termos técnicos complexos.
            </p>
            <div className="flex justify-center sm:justify-start">
              <Link href="/contato" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
                Agendar uma mentoria ou bate-papo ➔
              </Link>
            </div>
          </div>
        </div>

        {/* AdSense Slot - Bottom of Article wrapped in clean editorial format */}
        <div className="my-10 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/85 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Publicidade</span>
          <div className="w-full min-h-[90px] flex justify-center items-center">
            <AdSense slot="2887166563" />
          </div>
        </div>

        {/* Back to Blog footer link */}
        <div className="text-center mt-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a lista de artigos
          </Link>
        </div>
      </article>
    </>
  )
}
