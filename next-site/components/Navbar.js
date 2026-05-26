import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 fixed w-full z-50 top-0 left-0">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-extrabold text-blue-900 tracking-tight">
          <Link href="/">
            EduPrado<span className="text-blue-600">.me</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-700 hover:text-blue-600 focus:outline-none transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu principal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-semibold text-[15px] text-slate-600">
          <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
          <li><Link href="/sobre" className="hover:text-blue-600 transition">Sobre</Link></li>
          <li><Link href="/blog" className="hover:text-blue-600 transition">Blog</Link></li>
          <li><Link href="/palestras" className="hover:text-blue-600 transition">Palestras & Workshops</Link></li>
          <li><Link href="/projetos" className="hover:text-blue-600 transition">Projetos</Link></li>
          <li><Link href="/contato" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition shadow-sm font-bold">Contato</Link></li>
        </ul>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-slideDown">
          <ul className="flex flex-col p-4 space-y-4 font-bold text-slate-700">
            <li><Link href="/" onClick={() => setIsOpen(false)} className="block py-1 hover:text-blue-600 transition">Home</Link></li>
            <li><Link href="/sobre" onClick={() => setIsOpen(false)} className="block py-1 hover:text-blue-600 transition">Sobre</Link></li>
            <li><Link href="/blog" onClick={() => setIsOpen(false)} className="block py-1 hover:text-blue-600 transition">Blog</Link></li>
            <li><Link href="/palestras" onClick={() => setIsOpen(false)} className="block py-1 hover:text-blue-600 transition">Palestras & Workshops</Link></li>
            <li><Link href="/projetos" onClick={() => setIsOpen(false)} className="block py-1 hover:text-blue-600 transition">Projetos</Link></li>
            <li><Link href="/contato" onClick={() => setIsOpen(false)} className="block text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold">Contato</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
