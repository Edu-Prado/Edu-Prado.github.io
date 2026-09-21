import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width">
        <div className="footer-top">
          <div>
            <Link href="/" className="wordmark">
              eduprado<span>.me</span>
            </Link>
            <p>
              IA, dados e transformação digital sem tech-ês. Por Eduardo Prado.
            </p>
          </div>
          <div>
            <h2>EXPLORE</h2>
            <ul>
              <li>
                <Link href="/sobre">Sobre mim</Link>
              </li>
              <li>
                <Link href="/blog">Artigos</Link>
              </li>
              <li>
                <Link href="/projetos">Projetos</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>CONTINUE A CONVERSA</h2>
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/eduardo-prado-bb5174123/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <Link href="/#newsletter">Newsletter</Link>
              </li>
              <li>
                <Link href="/contato">Enviar uma mensagem</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} EduPrado.me. Todos os direitos
            reservados.
          </p>
          <p>Tecnologia com contexto. Decisões com clareza.</p>
        </div>
      </div>
    </footer>
  );
}
