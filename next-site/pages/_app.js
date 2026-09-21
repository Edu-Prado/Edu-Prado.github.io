import '../styles/globals.css'
import '../styles/editorial.css'
import Script from 'next/script'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const path = router.asPath.split(/[?#]/)[0]
  const canonical = 'https://eduprado.me' + (path === '/' ? '/' : path.replace(/\/$/, '') + '/')
  const excluded = ['/admin', '/404', '/palestras'].includes(router.pathname)
  return (
    <>
      <Head>
        {!excluded && <link rel="canonical" href={canonical} key="canonical" />}
        {excluded && <meta name="robots" content="noindex, follow" key="robots" />}
      </Head>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-QYZ06TPTGJ"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QYZ06TPTGJ');
          `,
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
