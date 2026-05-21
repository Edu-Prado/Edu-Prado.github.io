import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7782077901383981"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body className="bg-gray-50 text-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
