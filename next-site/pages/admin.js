import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Admin() {
    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tag: 'IA',
        apply: '',
        image_url: ''
    })

    useEffect(() => {
        const auth = localStorage.getItem('admin_auth')
        if (auth === 'true') setIsAuthenticated(true)
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()
        // Senha simples como solicitado "como era antes"
        if (password === 'admin123') { // Você pode mudar essa senha depois
            setIsAuthenticated(true)
            localStorage.setItem('admin_auth', 'true')
        } else {
            alert('Senha incorreta')
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { error } = await supabase
                .from('posts')
                .insert([
                    {
                        ...formData,
                        created_at: new Date().toISOString(),
                        date: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD para compatibilidade
                    }
                ])

            if (error) throw error

            setMessage('Post criado com sucesso!')
            setFormData({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                tag: 'IA',
                apply: '',
                image_url: ''
            })
        } catch (error) {
            console.error('Erro:', error)
            setMessage('Erro ao criar post: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        className="border p-2 rounded w-full mb-4"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Entrar</button>
                </form>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-24">
                <h1 className="text-3xl font-bold mb-8">Novo Artigo</h1>

                {message && (
                    <div className={`p-4 rounded mb-6 ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <div>
                        <label className="block font-medium mb-1">Título</label>
                        <input required name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Slug (URL amigável)</label>
                        <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full border p-2 rounded" placeholder="ex: meu-novo-artigo" />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Categoria (Tag)</label>
                        <select name="tag" value={formData.tag} onChange={handleChange} className="w-full border p-2 rounded">
                            <option>IA</option>
                            <option>Dados</option>
                            <option>Estratégia</option>
                            <option>Carreira</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Resumo</label>
                        <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" className="w-full border p-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Conteúdo (HTML permitido)</label>
                        <textarea required name="content" value={formData.content} onChange={handleChange} rows="10" className="w-full border p-2 rounded font-mono text-sm" placeholder="<p>Seu texto aqui...</p>" />
                        <p className="text-xs text-gray-500 mt-1">Dica: Use &lt;h2&gt; para subtítulos, &lt;p&gt; para parágrafos, &lt;b&gt; para negrito.</p>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Dica Prática (Box Azul)</label>
                        <textarea name="apply" value={formData.apply} onChange={handleChange} rows="2" className="w-full border p-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">URL da Imagem (Opcional)</label>
                        <input name="image_url" value={formData.image_url} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://..." />
                    </div>

                    <button disabled={loading} type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Publicando...' : 'Publicar Artigo'}
                    </button>
                </form>
            </main>
            <Footer />
        </>
    )
}
