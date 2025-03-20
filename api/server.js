require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
    origin: ['https://eduprado.me', 'http://localhost:5500'],
    credentials: true
}));

app.use(express.json());

// Inicializa o cliente Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Rotas da API
// Listar todos os posts
app.get('/api/posts', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Erro ao buscar posts:', err);
        res.status(500).json({ error: 'Erro ao buscar posts' });
    }
});

// Buscar post específico
app.get('/api/posts/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        res.json(data);
    } catch (err) {
        console.error('Erro ao buscar post:', err);
        res.status(500).json({ error: 'Erro ao buscar post' });
    }
});

// Criar novo post
app.post('/api/posts', async (req, res) => {
    const { title, category, content, imageUrl } = req.body;
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

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Erro ao criar post:', err);
        res.status(500).json({ error: 'Erro ao criar post' });
    }
});

// Atualizar post
app.put('/api/posts/:id', async (req, res) => {
    const { title, category, content, imageUrl } = req.body;
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

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        res.json(data);
    } catch (err) {
        console.error('Erro ao atualizar post:', err);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
});

// Deletar post
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Post excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir post:', err);
        res.status(500).json({ error: 'Erro ao excluir post' });
    }
});

// Deletar todos os posts
app.delete('/api/posts', async (req, res) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .neq('id', 0);

        if (error) throw error;
        res.json({ message: 'Todos os posts foram excluídos com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir posts:', err);
        res.status(500).json({ error: 'Erro ao excluir posts' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 