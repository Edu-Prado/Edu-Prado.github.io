require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'data', 'images', 'blog');

// Middleware
app.use(cors());
app.use(express.json());

// Logs personalizados
const logger = {
    info: (message, data = {}) => {
        console.log(`[INFO] ${message}`, data);
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);
    }
};

// Garante que o diretório de dados existe
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        logger.info(`Diretório de dados criado/verificado: ${DATA_DIR}`);
    } catch (error) {
        logger.error('Erro ao criar diretório de dados:', error);
        throw error;
    }
}

// Carrega os posts do arquivo
async function loadPosts() {
    try {
        await ensureDataDir();
        
        try {
            const data = await fs.readFile(POSTS_FILE, 'utf8');
            logger.info('Posts carregados com sucesso');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.info('Arquivo de posts não encontrado, criando novo...');
                await fs.writeFile(POSTS_FILE, '[]');
                return [];
            }
            throw error;
        }
    } catch (error) {
        logger.error('Erro ao carregar posts:', error);
        throw error;
    }
}

// Salva os posts no arquivo
async function savePosts(posts) {
    try {
        await ensureDataDir();
        await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
        logger.info('Posts salvos com sucesso');
    } catch (error) {
        logger.error('Erro ao salvar posts:', error);
        throw error;
    }
}

// Rotas
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await loadPosts();
        logger.info(`Retornando ${posts.length} posts`);
        res.json(posts);
    } catch (error) {
        logger.error('Erro ao buscar posts:', error);
        res.status(500).json({ error: 'Erro ao buscar posts' });
    }
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        const posts = await loadPosts();
        const post = posts.find(p => p.id === req.params.id);
        
        if (!post) {
            logger.info(`Post não encontrado: ${req.params.id}`);
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        
        logger.info(`Post encontrado: ${post.title}`);
        res.json(post);
    } catch (error) {
        logger.error('Erro ao buscar post:', error);
        res.status(500).json({ error: 'Erro ao buscar post' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { title, description, content, category } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
        }
        
        const posts = await loadPosts();
        const newPost = {
            id: Date.now().toString(),
            title,
            description,
            content,
            category: category || 'Geral',
            createdAt: new Date().toISOString()
        };
        
        posts.push(newPost);
        await savePosts(posts);
        
        logger.info('Novo post criado:', { title: newPost.title });
        res.status(201).json(newPost);
    } catch (error) {
        logger.error('Erro ao criar post:', error);
        res.status(500).json({ error: 'Erro ao criar post' });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    try {
        const { title, description, content, category } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
        }
        
        const posts = await loadPosts();
        const index = posts.findIndex(p => p.id === req.params.id);
        
        if (index === -1) {
            logger.info(`Post não encontrado para atualização: ${req.params.id}`);
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        
        const updatedPost = {
            ...posts[index],
            title,
            description,
            content,
            category: category || posts[index].category,
            updatedAt: new Date().toISOString()
        };
        
        posts[index] = updatedPost;
        await savePosts(posts);
        
        logger.info('Post atualizado:', { title: updatedPost.title });
        res.json(updatedPost);
    } catch (error) {
        logger.error('Erro ao atualizar post:', error);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const posts = await loadPosts();
        const index = posts.findIndex(p => p.id === req.params.id);
        
        if (index === -1) {
            logger.info(`Post não encontrado para exclusão: ${req.params.id}`);
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        
        const deletedPost = posts[index];
        posts.splice(index, 1);
        await savePosts(posts);
        
        logger.info('Post excluído:', { title: deletedPost.title });
        res.json({ message: 'Post excluído com sucesso' });
    } catch (error) {
        logger.error('Erro ao excluir post:', error);
        res.status(500).json({ error: 'Erro ao excluir post' });
    }
});

// Servir arquivos estáticos
app.use('/images/blog', express.static(uploadDir));
app.use(express.static(__dirname));

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Destino do upload:', uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        console.log('Nome do arquivo:', file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    }
});

// Rota para upload de imagem atualizada
app.post('/api/upload', upload.single('image'), (req, res) => {
    console.log('[Upload] Iniciando processamento do upload');
    console.log('[Upload] Headers:', JSON.stringify(req.headers, null, 2));
    console.log('[Upload] File:', req.file);
    console.log('[Upload] Body:', req.body);

    try {
        if (!req.file) {
            console.error('[Upload] Erro: Nenhum arquivo recebido');
            return res.status(400).json({ 
                error: 'Nenhum arquivo recebido',
                requestHeaders: req.headers,
                requestBody: req.body
            });
        }

        console.log('[Upload] Arquivo recebido com sucesso:', req.file);
        const imageUrl = `/images/blog/${req.file.filename}`;
        console.log('[Upload] URL da imagem gerada:', imageUrl);

        res.json({ 
            message: 'Upload realizado com sucesso',
            imageUrl: imageUrl,
            file: req.file
        });
    } catch (error) {
        console.error('[Upload] Erro durante o upload:', error);
        res.status(500).json({ 
            error: 'Erro ao fazer upload da imagem',
            details: error.message,
            stack: error.stack,
            requestInfo: {
                headers: req.headers,
                body: req.body,
                file: req.file
            }
        });
    }
});

// Rota para excluir imagem
app.delete('/api/images/:filename', async (req, res) => {
    try {
        const filePath = path.join(uploadDir, req.params.filename);
        console.log('Tentando excluir arquivo:', filePath);
        
        await fs.unlink(filePath);
        console.log('Arquivo excluído com sucesso:', filePath);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        res.status(500).json({ error: 'Erro ao excluir a imagem' });
    }
});

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Servidor funcionando!',
        env: {
            uploadDir,
            dataDir: DATA_DIR,
            allowedOrigins: '*',
            port: PORT
        }
    });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
    console.log('Configurações:');
    console.log('- Upload dir:', uploadDir);
    console.log('- Max file size:', process.env.MAX_FILE_SIZE || '5MB');
}); 