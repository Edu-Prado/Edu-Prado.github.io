require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
    origin: ['https://eduprado.me', 'http://eduprado.me', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Inicializa o cliente Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

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
app.post('/api/posts', async (req, res) => {
    const { title, category, content, imageUrl } = req.body;
    console.log('Criando novo post:', { title, category, imageUrl });

    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title,
                    category,
                    content,
                    image_url: imageUrl,
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
        res.status(201).json(data);
    } catch (err) {
        console.error('Erro ao criar post:', err);
        res.status(500).json({ error: 'Erro ao criar post' });
    }
});

// Atualizar post
app.put('/api/posts/:id', async (req, res) => {
    const { title, category, content, imageUrl } = req.body;
    console.log(`Atualizando post ${req.params.id}:`, { title, category, imageUrl });

    try {
        const { data, error } = await supabase
            .from('posts')
            .update({
                title,
                category,
                content,
                image_url: imageUrl,
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
        res.json(data);
    } catch (err) {
        console.error('Erro ao atualizar post:', err);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
});

// Deletar post
app.delete('/api/posts/:id', async (req, res) => {
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
        res.json({ message: 'Post excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar post:', err);
        res.status(500).json({ error: 'Erro ao deletar post' });
    }
});

// Deletar todos os posts
app.delete('/api/posts', async (req, res) => {
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
        res.json({ message: 'Todos os posts foram excluídos com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar todos os posts:', err);
        res.status(500).json({ error: 'Erro ao deletar posts' });
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