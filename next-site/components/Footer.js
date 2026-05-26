import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-white py-16 border-t border-slate-900">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-4 gap-10 mb-12">
                    {/* Brand column */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-black mb-4 tracking-tight text-white">
                            EduPrado<span className="text-blue-500">.me</span>
                        </h3>
                        <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm mb-4 font-normal">
                            EduPrado.me — IA, dados e transformação digital sem tech-ês.
                        </p>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-light">
                            Descomplicando a tecnologia aplicada para líderes e profissionais acelerarem resultados reais nos negócios.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-5">Navegação</h4>
                        <ul className="space-y-3 text-[14px] text-slate-400 font-medium">
                            <li><Link href="/" className="hover:text-blue-400 transition duration-200">Home</Link></li>
                            <li><Link href="/sobre" className="hover:text-blue-400 transition duration-200">Sobre Mim</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-400 transition duration-200">Blog / Artigos</Link></li>
                            <li><Link href="/palestras" className="hover:text-blue-400 transition duration-200">Palestras & Workshops</Link></li>
                            <li><Link href="/projetos" className="hover:text-blue-400 transition duration-200">Projetos</Link></li>
                            <li><Link href="/contato" className="hover:text-blue-400 transition duration-200">Fale Comigo</Link></li>
                        </ul>
                    </div>

                    {/* Social networks column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-5">Conectar</h4>
                        <div className="flex flex-col space-y-3 text-[14px] text-slate-400 font-medium">
                            <a href="https://www.linkedin.com/in/eduardo-prado-bb5174123/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200 flex items-center gap-1.5">
                                LinkedIn ➔
                            </a>
                            <a href="https://eduprado.me/blog" className="hover:text-blue-400 transition duration-200 flex items-center gap-1.5">
                                Blog do Edu ➔
                            </a>
                            <a href="/contato" className="hover:text-blue-400 transition duration-200 flex items-center gap-1.5">
                                E-mail Direto ➔
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
                    <p>&copy; {new Date().getFullYear()} EduPrado.me. Todos os direitos reservados.</p>
                    <p className="font-light">IA aplicada, dados e inovação financeira sem complicações.</p>
                </div>
            </div>
        </footer>
    );
}
