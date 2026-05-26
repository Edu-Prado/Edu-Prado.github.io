import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://eduprado-backend.onrender.com';

const AUTH_TOKEN_KEY = 'adminAuthToken';

export default function Admin() {
    const [email, setEmail] = useState('')
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
        slug: '',
        excerpt: '',
        content: '',
        tag: 'IA',
        apply: '',
        image_url: ''
    })

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem(AUTH_TOKEN_KEY)
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/verify`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        setIsAuthenticated(true)
                        fetchPostsDirectly(token)
                        fetchMessagesDirectly(token)
                    } else {
                        localStorage.removeItem(AUTH_TOKEN_KEY)
                    }
                } catch (err) {
                    console.error('Session verification failed:', err)
                }
            }
        }
        verifySession()
    }, [])

    const fetchPostsDirectly = async (token) => {
        try {
            const response = await fetch(`${API_URL}/api/posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setPosts(data || [])
            }
        } catch (error) {
            console.error('Erro ao buscar posts:', error)
        }
    }

    const fetchMessagesDirectly = async (token) => {
        try {
            const response = await fetch(`${API_URL}/api/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setMessages(data || [])
            }
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error)
        }
    }

    const fetchPosts = async () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY)
        if (token) fetchPostsDirectly(token)
    }

    const fetchMessages = async () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY)
        if (token) fetchMessagesDirectly(token)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok || !data.token) {
                throw new Error(data.message || 'Credenciais inválidas');
            }

            setIsAuthenticated(true)
            localStorage.setItem(AUTH_TOKEN_KEY, data.token)
            
            // Fetch initial data
            fetchPostsDirectly(data.token)
            fetchMessagesDirectly(data.token)
        } catch (error) {
            alert(error.message || 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (post) => {
        setFormData({
            id: post.id,
            title: post.title,
            slug: post.slug || '',
            excerpt: post.excerpt,
            content: post.content,
            tag: post.category || 'IA', // API uses category, database/form maps it to tag
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
            slug: '',
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
            const token = localStorage.getItem(AUTH_TOKEN_KEY)
            if (!token) throw new Error('Sessão expirada')

            const postData = {
                title: formData.title,
                category: formData.tag, // API maps to category
                content: formData.content,
                imageUrl: formData.image_url,
                apply: formData.apply,
                slug: formData.slug,
                excerpt: formData.excerpt
            }

            let response
            if (formData.id) {
                // Update
                response = await fetch(`${API_URL}/api/posts/${formData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                })
            } else {
                // Insert
                response = await fetch(`${API_URL}/api/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                })
            }

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.error || 'Erro ao salvar post')
            }

            setMessage(formData.id ? 'Post atualizado!' : 'Post criado!')
            fetchPostsDirectly(token)
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
            const token = localStorage.getItem(AUTH_TOKEN_KEY)
            if (!token) throw new Error('Sessão expirada')

            const response = await fetch(`${API_URL}/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.error || 'Erro ao excluir post')
            }

            fetchPostsDirectly(token)
        } catch (error) {
            alert('Erro ao excluir: ' + error.message)
        }
    }

    const handleSeedDrafts = async () => {
        if (!confirm('Deseja realmente importar os 6 artigos estratégicos iniciais de rascunho? Isso irá sobrescrever artigos anteriores com os mesmos slugs.')) {
            return;
        }
        setLoading(true)
        setMessage('')
        try {
            const token = localStorage.getItem(AUTH_TOKEN_KEY)
            if (!token) throw new Error('Sessão expirada')

            const response = await fetch(`${API_URL}/api/posts/seed`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()
            if (response.ok) {
                alert('Os 6 artigos iniciais foram importados e o rebuild automático do site foi acionado!')
                fetchPostsDirectly(token)
            } else {
                throw new Error(data.error || 'Erro ao importar artigos')
            }
        } catch (error) {
            alert(error.message || 'Erro ao importar artigos')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteMessage = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return
        try {
            const token = localStorage.getItem(AUTH_TOKEN_KEY)
            if (!token) throw new Error('Sessão expirada')

            const response = await fetch(`${API_URL}/api/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.error || 'Erro ao excluir mensagem')
            }

            fetchMessagesDirectly(token)
        } catch (error) {
            alert('Erro ao excluir: ' + error.message)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail"
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
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
                            <>
                                <button onClick={handleSeedDrafts} className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 ml-4">
                                    Importar Artigos Iniciais
                                </button>
                                <button onClick={handleNew} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4">
                                    + Novo Artigo
                                </button>
                            </>
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
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    // Auto-generate slug if it's new or empty, or if user hasn't manually edited it (simplified: always update if not editing slug directly)
                                    // Better UX: Only auto-update if creating new or if slug matches old title. 
                                    // For simplicity: Auto-update slug only if it's empty or we are in "new" mode and user hasn't touched slug?
                                    // Let's just update title. We'll add a helper to generate slug.
                                    setFormData(prev => ({
                                        ...prev,
                                        title,
                                        slug: !prev.id ? title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : prev.slug
                                    }))
                                }}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Slug (URL Amigável)</label>
                            <input
                                required
                                name="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full border p-2 rounded bg-gray-50"
                                placeholder="ex: titulo-do-artigo"
                            />
                            <p className="text-xs text-gray-500 mt-1">Este será o link do artigo: /blog/{formData.slug || '...'}</p>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Categoria (Tag)</label>
                            <select name="tag" value={formData.tag} onChange={handleChange} className="w-full border p-2 rounded">
                                <option>IA</option>
                                <option>Dados</option>
                                <option>Estratégia</option>
                                <option>Carreira</option>
                                <option>IA para iniciantes</option>
                                <option>Opinião</option>
                                <option>Noticias</option>
                                <option>Games</option>
                                <option>Gadgets</option>
                                <option>Tecnologia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Resumo</label>
                            <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" className="w-full border p-2 rounded" />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Conteúdo (Markdown suportado)</label>
                            <textarea required name="content" value={formData.content} onChange={handleChange} rows="10" className="w-full border p-2 rounded font-mono text-sm" placeholder="Escreva seu texto aqui..." />
                            <p className="text-xs text-gray-500 mt-1">
                                Dica: Use <b>**negrito**</b>, <b>## Subtítulo</b>, <b>- Lista</b>. Para vídeos do YouTube, cole o link em uma linha separada. HTML também é suportado.
                            </p>
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
