import { Html, Head, Main, NextScript } from 'next/document'
import { advertisingEnabled } from '../lib/advertising'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {advertisingEnabled && <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7782077901383981"
          crossOrigin="anonymous"
        ></script>}
      </Head>
      <body className="bg-gray-50 text-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
