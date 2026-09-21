export function absoluteUrl(value) {
  if (!value) return undefined
  try {
    const url = new URL(value, 'https://eduprado.me/')
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined
  } catch { return undefined }
}

function validDate(value) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function articleMetadata(post) {
  const image = absoluteUrl(post.image_url)
  const url = `https://eduprado.me/blog/${encodeURIComponent(post.slug)}/`
  return { image, schema: {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title, description: post.excerpt,
    url, mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: image ? [image] : undefined,
    datePublished: validDate(post.created_at),
    dateModified: validDate(post.updated_at),
    inLanguage: 'pt-BR',
    author: { '@type': 'Person', name: 'Eduardo Prado', url: 'https://eduprado.me/sobre/' },
    publisher: { '@type': 'Person', name: 'Eduardo Prado', url: 'https://eduprado.me/' },
  } }
}

export function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
