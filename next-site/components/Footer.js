import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">EduPrado.me</h3>
                        <p className="text-gray-400">
                            Transformando o futuro com tecnologia e inteligência artificial.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/#home" className="hover:text-white transition">Home</Link></li>
                            <li><Link href="/#about" className="hover:text-white transition">Sobre</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                            <li><Link href="/#projects" className="hover:text-white transition">Projetos</Link></li>
                            <li><Link href="/contato" className="hover:text-white transition">Contato</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
                        <div className="flex space-x-4">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                                LinkedIn
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
                                Instagram
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} EduPrado.me. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
