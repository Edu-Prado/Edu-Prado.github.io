import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Admin() {
    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [view, setView] = useState('list') // 'list', 'form', 'messages'
    const [posts, setPosts] = useState([])
    const [messages, setMessages] = useState([])

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        excerpt: '',
        content: '',
        tag: 'IA',
        apply: '',
        image_url: ''
    })

    useEffect(() => {
        const auth = localStorage.getItem('admin_auth')
        if (auth === 'true') {
            setIsAuthenticated(true)
            fetchPosts()
            fetchMessages()
        }
    }, [])

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setPosts(data)
    }

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setMessages(data)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        if (password === 'admin123') {
            setIsAuthenticated(true)
            localStorage.setItem('admin_auth', 'true')
            fetchPosts()
            fetchMessages()
        } else {
            alert('Senha incorreta')
        }
    }

    const handleEdit = (post) => {
        setFormData({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            tag: post.tag || 'IA',
            apply: post.apply || '',
            image_url: post.image_url || ''
        })
        setView('form')
        setMessage('')
    }

    const handleNew = () => {
        setFormData({
            id: null,
            title: '',
            excerpt: '',
            content: '',
            tag: 'IA',
            apply: '',
            image_url: ''
        })
        setView('form')
        setMessage('')
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const postData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                tag: formData.tag,
                apply: formData.apply,
                image_url: formData.image_url,
                date: new Date().toISOString().split('T')[0]
            }

            let error
            if (formData.id) {
                // Update
                const result = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', formData.id)
                error = result.error
            } else {
                // Insert
                const result = await supabase
                    .from('posts')
                    .insert([{ ...postData, created_at: new Date().toISOString() }])
                error = result.error
            }

            if (error) throw error

            setMessage(formData.id ? 'Post atualizado!' : 'Post criado!')
            fetchPosts()
            if (!formData.id) {
                setFormData({ ...formData, title: '' }) // Clear some fields
            }
            setTimeout(() => setView('list'), 1500)
        } catch (error) {
            console.error('Erro:', error)
            setMessage('Erro: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este post?')) return
        try {
            const { error } = await supabase.from('posts').delete().eq('id', id)
            if (error) throw error
            fetchPosts()
        } catch (error) {
            alert('Erro ao excluir: ' + error.message)
        }
    }

    const handleDeleteMessage = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return
        try {
            const { error } = await supabase.from('messages').delete().eq('id', id)
            if (error) throw error
            fetchMessages()
        } catch (error) {
            alert('Erro ao excluir: ' + error.message)
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 py-2 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Artigos
                        </button>
                        <button
                            onClick={() => setView('messages')}
                            className={`px-4 py-2 rounded ${view === 'messages' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Mensagens
                        </button>
                        {view === 'list' && (
                            <button onClick={handleNew} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4">
                                + Novo Artigo
                            </button>
                        )}
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded mb-6 ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                {view === 'messages' && (
                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">De</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organização</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagem</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {messages.map(msg => (
                                    <tr key={msg.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                                            <div className="text-sm text-gray-500">{msg.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {msg.organization}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {msg.message}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                                {messages.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Nenhuma mensagem recebida.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {view === 'list' && (
                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map(post => (
                                    <tr key={post.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(post)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                            <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {view === 'form' && (
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 bg-white p-6 rounded shadow">
                        <div>
                            <label className="block font-medium mb-1">Título</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" />
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

                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button disabled={loading} type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50">
                                {loading ? 'Salvando...' : (formData.id ? 'Atualizar Artigo' : 'Publicar Artigo')}
                            </button>
                        </div>
                    </form>
                )}
            </main>
            <Footer />
        </>
    )
}
