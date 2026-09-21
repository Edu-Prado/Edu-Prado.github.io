import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
const source = await readFile('lib/seo.js', 'utf8')
const { articleMetadata, safeJson } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
assert.equal(articleMetadata({ image_url: 'images/blog/test.png', slug: 'test' }).image, 'https://eduprado.me/images/blog/test.png')
const maliciousTitle = '</script><script>alert(1)</script>'
const escaped = safeJson({ title: maliciousTitle })
assert(!escaped.includes('<'))
assert.equal(JSON.parse(escaped).title, maliciousTitle)
const sitemap = await readFile('out/sitemap.xml', 'utf8')
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
assert.equal(new Set(locations).size, locations.length)
assert(!locations.some(url => /\/(admin|palestras|404)\//.test(url)))
let articles = 0
for (const url of locations) {
  const pathname = new URL(url).pathname
  const html = await readFile(`out${pathname}index.html`, 'utf8')
  const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)]
  assert.equal(canonical.length, 1, url)
  assert(canonical[0][0].includes(`href="${url}"`), url)
  assert(!html.includes('href="/palestras/"') && !html.includes('Agendar uma mentoria'), url)
  if (!pathname.startsWith('/blog/')) assert(!/palestras|workshops|mentoria/i.test(html.replace(/<script[\s\S]*?<\/script>/g, '')), url)
  assert.equal((html.match(/<h1\b/g) || []).length, 1, url)
  if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
    articles++
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]))
    const article = schemas.find(schema => schema['@type'] === 'BlogPosting')
    assert(article && article.headline && article.author.url && article.datePublished, url)
    assert.equal(article.url, url)
    if (article.image) assert(article.image.every(image => /^https?:\/\//.test(image)))
  }
}
const articleDirs = (await readdir('out/blog', { withFileTypes: true })).filter(entry => entry.isDirectory()).length
assert.equal(articles, articleDirs)
for (const page of ['admin/index.html', '404.html', 'palestras/index.html']) {
  assert((await readFile(`out/${page}`, 'utf8')).includes('noindex'), page)
}
assert((await readFile('out/palestras/index.html', 'utf8')).includes('0;url=https://eduprado.me/contato/'))
console.log(`SEO checks passed: ${locations.length} canonical URLs, ${articles} articles with schema, full sitemap coverage, no service offers, excluded utility pages.`)
