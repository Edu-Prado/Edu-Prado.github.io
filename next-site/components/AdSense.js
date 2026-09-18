import { useEffect, useRef } from 'react'

let loader
function loadAdSense() {
  if (!loader) loader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.crossOrigin = 'anonymous'
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7782077901383981'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
  return loader
}

export default function AdSense({ slot }) {
  const element = useRef(null)
  const requested = useRef(false)
  useEffect(() => {
    // Local previews never request live ads.
    if (!['eduprado.me', 'www.eduprado.me'].includes(window.location.hostname)) return
    let cancelled = false
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || requested.current) return
      try {
        await loadAdSense()
        if (cancelled || requested.current || !element.current?.offsetWidth) return
        requested.current = true
        observer.disconnect()
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {
        // Ad blockers and unavailable inventory must not interrupt reading.
      }
    }, { rootMargin: '200px' })
    observer.observe(element.current)
    return () => { cancelled = true; observer.disconnect() }
  }, [])
  return (
    <aside className="editorial-ad" aria-label="Publicidade">
      <span className="editorial-ad-label">Publicidade</span>
      <ins ref={element} className="adsbygoogle" style={{ display: 'block' }}
        data-ad-client="ca-pub-7782077901383981" data-ad-slot={slot}
        data-ad-format="horizontal" data-ad-full-width-responsive="false" />
    </aside>
  )
}
