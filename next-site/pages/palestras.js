import Head from 'next/head'
import Link from 'next/link'

// GitHub Pages static export: preserve old links with an immediate redirect.
export default function LegacyContact() {
  return <>
    <Head>
      <title>Contato | Eduardo Prado</title>
      <meta httpEquiv="refresh" content="0;url=https://eduprado.me/contato/" />
    </Head>
    <main id="conteudo" className="page-width section-space">
      <h1>Vamos conversar</h1>
      <p><Link href="/contato">Continuar para oportunidades profissionais e conexões.</Link></p>
    </main>
  </>
}
