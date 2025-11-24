import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-900">
          <Link href="/">
            EduPrado.me
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
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
        <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
          <li><Link href="/#home" className="hover:text-blue-600 transition">Home</Link></li>
          <li><Link href="/#about" className="hover:text-blue-600 transition">Sobre</Link></li>
          <li><Link href="/blog" className="hover:text-blue-600 transition">Blog</Link></li>
          <li><Link href="/#projects" className="hover:text-blue-600 transition">Projetos</Link></li>
          <li><Link href="/contato" className="hover:text-blue-600 transition">Contato</Link></li>
        </ul>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <ul className="flex flex-col p-4 space-y-4 font-medium text-gray-700">
            <li><Link href="/#home" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link href="/#about" onClick={() => setIsOpen(false)}>Sobre</Link></li>
            <li><Link href="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
            <li><Link href="/#projects" onClick={() => setIsOpen(false)}>Projetos</Link></li>
            <li><Link href="/contato" onClick={() => setIsOpen(false)}>Contato</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
