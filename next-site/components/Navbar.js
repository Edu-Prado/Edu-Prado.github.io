import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
const links = [
  ["/", "Início"],
  ["/sobre", "Sobre"],
  ["/blog", "Artigos"],
  ["/projetos", "Projetos"],
  ["/contato", "Vamos conversar"],
];
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggle = useRef(null);
  const active = (href) =>
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <header
        className="site-header"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsOpen(false);
            toggle.current?.focus();
          }
        }}
      >
        <nav className="page-width nav-inner" aria-label="Navegação principal">
          <Link href="/" className="wordmark" aria-label="EduPrado.me — início">
            eduprado<span>.me</span>
          </Link>
          <button
            ref={toggle}
            className="menu-toggle"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="main-navigation"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d={isOpen ? "M6 6l12 12M6 18L18 6" : "M4 8h16M4 16h16"} />
            </svg>
          </button>
          <ul
            id="main-navigation"
            className={`nav-links${isOpen ? " is-open" : ""}`}
          >
            {links.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active(href) ? "page" : undefined}
                  className={href === "/contato" ? "nav-contact" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
