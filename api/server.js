require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { draftArticles } = require('./draft_posts');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
    origin: ['https://eduprado.me', 'http://eduprado.me', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Inicializa o cliente Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const getUserRole = (user) => user?.app_metadata?.role || user?.user_metadata?.role;

const getBearerToken = (req) => {
    const authHeader = req.headers.authorization || '';
    return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
};

const getAuthenticatedAdmin = async (req, res) => {
    const token = getBearerToken(req);

    if (!token) {
        res.status(401).json({ error: 'Token não fornecido' });
        return null;
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
        res.status(401).json({ error: 'Token inválido' });
        return null;
    }

    const role = getUserRole(data.user);
    if (role !== 'admin') {
        res.status(403).json({ error: 'Acesso negado' });
        return null;
    }

    return data.user;
};

const requireAdminAuth = async (req, res, next) => {
    try {
        const user = await getAuthenticatedAdmin(req, res);
        if (!user) return;

        req.user = user;
        next();
    } catch (err) {
        console.error('Erro ao validar autenticação:', err);
        res.status(500).json({ error: 'Erro ao validar autenticação' });
    }
};

const validatePostPayload = (req, res, next) => {
    const { title, category, content, imageUrl, slug, excerpt, apply } = req.body;
    if (!title || !category || !content) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    if ([title, category].some(field => typeof field !== 'string' || field.length > 200)) {
        return res.status(400).json({ error: 'Título/categoria inválidos' });
    }

    if (typeof content !== 'string' || content.length > 500000) {
        return res.status(400).json({ error: 'Conteúdo inválido' });
    }

    if (imageUrl && (typeof imageUrl !== 'string' || imageUrl.length > 2000)) {
        return res.status(400).json({ error: 'URL da imagem inválida' });
    }

    if (slug && (typeof slug !== 'string' || slug.length > 200)) {
        return res.status(400).json({ error: 'Slug inválido' });
    }

    if (excerpt && (typeof excerpt !== 'string' || excerpt.length > 1000)) {
        return res.status(400).json({ error: 'Resumo inválido' });
    }

    if (apply && (typeof apply !== 'string' || apply.length > 1000)) {
        return res.status(400).json({ error: 'Dica prática inválida' });
    }

    next();
};

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rota raiz/healthcheck para facilitar diagnóstico no navegador e no Render
app.get('/', (req, res) => {
    res.json({
        message: 'EduPrado API está online',
        endpoints: {
            health: '/api/test',
            login: '/api/auth/login',
            verify: '/api/auth/verify',
            posts: '/api/posts'
        }
    });
});

// Rotas de autenticação do admin usando Supabase Auth
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha email e senha' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data?.session?.access_token || !data?.user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        if (getUserRole(data.user) !== 'admin') {
            return res.status(403).json({ message: 'Usuário sem permissão de administrador' });
        }

        res.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                name: data.user.user_metadata?.name || data.user.email,
                email: data.user.email
            }
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.get('/api/auth/verify', async (req, res) => {
    try {
        const user = await getAuthenticatedAdmin(req, res);
        if (!user) return;

        res.json({
            user: {
                id: user.id,
                name: user.user_metadata?.name || user.email,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        res.status(500).json({ message: 'Erro ao verificar autenticação' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production' && process.env.ENABLE_PUBLIC_REGISTER !== 'true') {
            return res.status(403).json({ message: 'Registro público desabilitado em produção' });
        }

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha nome, email e senha' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres' });
        }

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            app_metadata: { role: 'admin' },
            user_metadata: { name, role: 'admin' }
        });

        if (error || !data?.user) {
            return res.status(400).json({ message: error?.message || 'Erro ao criar usuário' });
        }

        res.status(201).json({
            message: 'Usuário admin criado com sucesso',
            user: {
                id: data.user.id,
                name: data.user.user_metadata?.name || data.user.email,
                email: data.user.email
            }
        });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

// Função auxiliar para gerar resumo automático caso venha em branco
const generateExcerpt = (content) => {
    if (!content) return '';
    const cleanText = content
        .replace(/[#*`_\-\[\]\(\)]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return cleanText.slice(0, 180) + (cleanText.length > 180 ? '...' : '');
};

// Função para disparar o rebuild no GitHub Actions quando houver alteração nos posts
const triggerGithubRebuild = async () => {
    const githubToken = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'Edu-Prado';
    const repoName = process.env.GITHUB_REPO_NAME || 'Edu-Prado.github.io';
    const workflowId = process.env.GITHUB_WORKFLOW_ID || 'pages.yml';

    if (!githubToken) {
        console.log('[GitHub Build] GITHUB_PAT não configurado no Render. O rebuild automático do GitHub Pages foi pulado.');
        return false;
    }

    try {
        console.log(`[GitHub Build] Disparando rebuild automático no GitHub Actions para ${repoOwner}/${repoName}...`);
        
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'EduPrado-Backend-API'
            },
            body: JSON.stringify({
                ref: 'main'
            })
        });

        if (response.ok) {
            console.log('[GitHub Build] Rebuild do GitHub Actions disparado com sucesso!');
            return true;
        } else {
            const errText = await response.text();
            console.error('[GitHub Build] Erro ao disparar rebuild no GitHub Actions:', response.status, errText);
            return false;
        }
    } catch (err) {
        console.error('[GitHub Build] Falha de conexão com a API do GitHub:', err);
        return false;
    }
};

// Rotas da API
// Listar todos os posts
app.get('/api/posts', async (req, res) => {
    try {
        console.log('Buscando posts no Supabase...');
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar posts:', error);
            throw error;
        }

        console.log(`Encontrados ${data.length} posts`);
        res.json(data);
    } catch (err) {
        console.error('Erro ao buscar posts:', err);
        res.status(500).json({ error: 'Erro ao buscar posts' });
    }
});

// Buscar post específico
app.get('/api/posts/:id', async (req, res) => {
    try {
        console.log(`Buscando post com ID: ${req.params.id}`);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) {
            console.error('Erro ao buscar post:', error);
            throw error;
        }

        if (!data) {
            console.log('Post não encontrado');
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        console.log('Post encontrado:', data.title);
        res.json(data);
    } catch (err) {
        console.error('Erro ao buscar post:', err);
        res.status(500).json({ error: 'Erro ao buscar post' });
    }
});

// Criar novo post
app.post('/api/posts', requireAdminAuth, validatePostPayload, async (req, res) => {
    const { title, category, content, imageUrl, slug, excerpt, apply } = req.body;
    console.log('Criando novo post:', { title, category, imageUrl, slug });

    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title,
                    category,
                    content,
                    image_url: imageUrl,
                    slug: slug || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
                    excerpt: excerpt || generateExcerpt(content),
                    apply: apply || '',
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar post:', error);
            throw error;
        }

        console.log('Post criado com sucesso:', data);
        triggerGithubRebuild();
        res.status(201).json(data);
    } catch (err) {
        console.error('Erro ao criar post:', err);
        res.status(500).json({ error: 'Erro ao criar post' });
    }
});

// Atualizar post
app.put('/api/posts/:id', requireAdminAuth, validatePostPayload, async (req, res) => {
    const { title, category, content, imageUrl, slug, excerpt, apply } = req.body;
    console.log(`Atualizando post ${req.params.id}:`, { title, category, imageUrl, slug });

    try {
        const { data, error } = await supabase
            .from('posts')
            .update({
                title,
                category,
                content,
                image_url: imageUrl,
                slug: slug || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
                excerpt: excerpt || generateExcerpt(content),
                apply: apply || '',
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar post:', error);
            throw error;
        }

        if (!data) {
            console.log('Post não encontrado para atualização');
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        console.log('Post atualizado com sucesso:', data);
        triggerGithubRebuild();
        res.json(data);
    } catch (err) {
        console.error('Erro ao atualizar post:', err);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
});

// Deletar post
app.delete('/api/posts/:id', requireAdminAuth, async (req, res) => {
    console.log(`Deletando post ${req.params.id}`);

    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            console.error('Erro ao deletar post:', error);
            throw error;
        }

        console.log('Post deletado com sucesso');
        triggerGithubRebuild();
        res.json({ message: 'Post excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar post:', err);
        res.status(500).json({ error: 'Erro ao deletar post' });
    }
});

// Deletar todos os posts
app.delete('/api/posts', requireAdminAuth, async (req, res) => {
    console.log('Deletando todos os posts');

    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .neq('id', 0);

        if (error) {
            console.error('Erro ao deletar todos os posts:', error);
            throw error;
        }

        console.log('Todos os posts foram deletados com sucesso');
        triggerGithubRebuild();
        res.json({ message: 'Todos os posts foram excluídos com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar todos os posts:', err);
        res.status(500).json({ error: 'Erro ao deletar posts' });
    }
});

// Listar todas as mensagens (contatos) - Apenas admin
app.get('/api/messages', requireAdminAuth, async (req, res) => {
    try {
        console.log('Buscando mensagens no Supabase...');
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar mensagens:', error);
            throw error;
        }

        console.log(`Encontradas ${data.length} mensagens`);
        res.json(data);
    } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
        res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});

// Deletar mensagem específica - Apenas admin
app.delete('/api/messages/:id', requireAdminAuth, async (req, res) => {
    console.log(`Deletando mensagem ${req.params.id}`);

    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            console.error('Erro ao deletar mensagem:', error);
            throw error;
        }

        console.log('Mensagem deletada com sucesso');
        res.json({ message: 'Mensagem excluída com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar mensagem:', err);
        res.status(500).json({ error: 'Erro ao deletar mensagem' });
    }
});

// Importar artigos iniciais de rascunho - Apenas admin
app.post('/api/posts/seed', requireAdminAuth, async (req, res) => {
    console.log('[Seed] Iniciando importação de artigos rascunhos estratégicos...');

    try {
        const slugs = draftArticles.map(p => p.slug);
        
        // 1. Limpar rascunhos anteriores para evitar duplicidade
        const { error: deleteError } = await supabase
            .from('posts')
            .delete()
            .in('slug', slugs);

        if (deleteError) {
            console.error('[Seed] Erro ao deletar rascunhos antigos:', deleteError);
            throw deleteError;
        }

        // 2. Inserir os novos artigos de rascunho
        const { data, error: insertError } = await supabase
            .from('posts')
            .insert(draftArticles)
            .select();

        if (insertError) {
            console.error('[Seed] Erro ao inserir novos rascunhos:', insertError);
            throw insertError;
        }

        console.log('[Seed] Artigos importados com sucesso:', data.length);
        triggerGithubRebuild(); // Dispara o rebuild em background para gerar as novas páginas estáticas
        res.json({ message: 'Os 6 artigos iniciais foram importados com sucesso no banco de dados e o build foi disparado!' });
    } catch (err) {
        console.error('[Seed] Falha crítica ao semear artigos:', err);
        res.status(500).json({ error: 'Falha crítica ao semear artigos no banco de dados' });
    }
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`URL do Supabase: ${process.env.SUPABASE_URL}`);
}); 
