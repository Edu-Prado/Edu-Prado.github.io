import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('out')
async function pages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const found = await Promise.all(entries.map(entry => entry.isDirectory()
    ? (entry.name === '_next' ? [] : pages(path.join(dir, entry.name)))
    : entry.name === 'index.html' ? [path.join(dir, entry.name)] : []))
  return found.flat()
}
const escapeXml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
const entries = []
for (const file of await pages(root)) {
  const html = await readFile(file, 'utf8')
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => match[0])
  if (meta.some(tag => /name="robots"/.test(tag) && /noindex/.test(tag))) continue
  const relative = path.relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '')
  const url = `https://eduprado.me/${relative}`
  const json = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)?.[1]
  const post = json ? JSON.parse(json).props?.pageProps?.post : undefined
  const date = post?.updated_at || post?.created_at
  const lastmod = date && !Number.isNaN(Date.parse(date)) ? `<lastmod>${new Date(date).toISOString()}</lastmod>` : ''
  entries.push(`<url><loc>${escapeXml(url)}</loc>${lastmod}</url>`)
}
if (!entries.some(entry => entry.includes('/blog/') && entry.includes('<lastmod>'))) throw new Error('No article entries in sitemap')
await writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.sort().join('\n')}\n</urlset>\n`)
console.log(`Sitemap generated with ${entries.length} indexable pages.`)
