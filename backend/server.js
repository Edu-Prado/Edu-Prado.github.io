require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads', 'images', 'blog');
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data', 'blog');

// Logging middleware aprimorado
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', req.body);
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    });
    
    next();
});

// Configuração do CORS mais permissiva
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Verificar e criar diretórios necessários
console.log('[Config] Diretório de uploads:', uploadDir);
console.log('[Config] Diretório de dados:', dataDir);

Promise.all([
    fs.mkdir(uploadDir, { recursive: true }),
    fs.mkdir(dataDir, { recursive: true })
]).then(() => {
    console.log('[Config] Diretórios criados/verificados com sucesso');
}).catch(err => {
    console.error('[Config] Erro ao criar diretórios:', err);
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

// Função auxiliar para ler/salvar posts
async function readPosts() {
    try {
        console.log('[Posts] Tentando ler posts do arquivo...');
        const filePath = path.join(dataDir, 'posts.json');
        console.log('[Posts] Caminho absoluto do arquivo:', path.resolve(filePath));
        
        try {
            await fs.access(filePath);
            console.log('[Posts] Arquivo de posts existe');
            const stats = await fs.stat(filePath);
            console.log('[Posts] Tamanho do arquivo:', stats.size, 'bytes');
        } catch (error) {
            console.log('[Posts] Arquivo de posts não existe, criando novo...');
            await fs.writeFile(filePath, '[]', 'utf8');
            console.log('[Posts] Arquivo vazio criado com sucesso');
            return [];
        }
        
        const data = await fs.readFile(filePath, 'utf8');
        console.log('[Posts] Conteúdo bruto do arquivo:', data);
        
        const posts = JSON.parse(data);
        console.log('[Posts] Total de posts lidos:', posts.length);
        posts.forEach((post, index) => {
            console.log(`[Posts] Post ${index + 1}:`, {
                id: post.id,
                title: post.title,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt
            });
        });
        
        return posts;
    } catch (error) {
        console.error('[Posts] Erro ao ler posts:', error);
        return [];
    }
}

async function savePosts(posts) {
    try {
        console.log('[Posts] Iniciando salvamento de posts...');
        const filePath = path.join(dataDir, 'posts.json');
        console.log('[Posts] Caminho absoluto do arquivo:', path.resolve(filePath));
        console.log('[Posts] Total de posts a salvar:', posts.length);
        
        // Verifica se o diretório existe
        try {
            await fs.access(path.dirname(filePath));
            console.log('[Posts] Diretório de posts existe');
        } catch (error) {
            console.log('[Posts] Criando diretório de posts...');
            await fs.mkdir(path.dirname(filePath), { recursive: true });
        }
        
        // Formata o JSON para melhor legibilidade
        const jsonContent = JSON.stringify(posts, null, 2);
        console.log('[Posts] Conteúdo a ser salvo:', jsonContent);
        
        await fs.writeFile(filePath, jsonContent, 'utf8');
        
        // Verifica se o arquivo foi salvo corretamente
        const savedContent = await fs.readFile(filePath, 'utf8');
        const savedPosts = JSON.parse(savedContent);
        console.log('[Posts] Verificação após salvamento:', {
            postsCount: savedPosts.length,
            fileSize: savedContent.length,
            firstPost: savedPosts[0] ? {
                id: savedPosts[0].id,
                title: savedPosts[0].title
            } : null
        });
        
        console.log('[Posts] Posts salvos com sucesso!');
    } catch (error) {
        console.error('[Posts] Erro ao salvar posts:', error);
        throw error;
    }
}

// Rotas para o blog
app.get('/api/posts', async (req, res) => {
    try {
        console.log('[API] Recebendo requisição GET /api/posts');
        console.log('[API] Headers:', req.headers);
        
        const posts = await readPosts();
        console.log('[API] Total de posts encontrados:', posts.length);
        
        res.json(posts);
        console.log('[API] Resposta enviada com sucesso');
    } catch (error) {
        console.error('[API] Erro ao ler posts:', error);
        res.status(500).json({ 
            error: 'Erro ao ler posts',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        console.log('[API] Recebendo requisição POST /api/posts');
        console.log('[API] Headers:', req.headers);
        console.log('[API] Dados recebidos:', req.body);
        
        const posts = await readPosts();
        const newPost = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        
        console.log('[API] Novo post criado:', newPost);
        posts.unshift(newPost);
        
        await savePosts(posts);
        console.log('[API] Post adicionado com sucesso');
        
        res.status(201).json(newPost);
    } catch (error) {
        console.error('[API] Erro ao criar post:', error);
        res.status(500).json({ 
            error: 'Erro ao criar post',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const posts = await readPosts();
        const filteredPosts = posts.filter(post => post.id !== req.params.id);
        await savePosts(filteredPosts);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir post:', error);
        res.status(500).json({ error: 'Erro ao excluir post' });
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
            dataDir,
            allowedOrigins: '*',
            port
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

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log('Configurações:');
    console.log('- Upload dir:', uploadDir);
    console.log('- Max file size:', process.env.MAX_FILE_SIZE || '5MB');
}); 