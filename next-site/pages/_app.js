import '../styles/globals.css'
import Script from 'next/script'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
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
