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

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Configuração do CORS
app.use(cors());

app.use(express.json());

// Verificar e criar diretórios necessários
const dataDir = path.join(path.dirname(uploadDir), 'data');
console.log('Diretório de uploads:', uploadDir);
console.log('Diretório de dados:', dataDir);

Promise.all([
    fs.mkdir(uploadDir, { recursive: true }),
    fs.mkdir(dataDir, { recursive: true })
]).then(() => {
    console.log('Diretórios criados/verificados');
}).catch(err => {
    console.error('Erro ao criar diretórios:', err);
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
        console.log('Tentando ler posts do arquivo...');
        const filePath = path.join(dataDir, 'posts.json');
        console.log('Caminho do arquivo:', filePath);
        
        try {
            await fs.access(filePath);
            console.log('Arquivo de posts existe');
        } catch (error) {
            console.log('Arquivo de posts não existe, criando novo...');
            await fs.writeFile(filePath, '[]', 'utf8');
            return [];
        }
        
        const data = await fs.readFile(filePath, 'utf8');
        console.log('Conteúdo do arquivo:', data);
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler posts:', error);
        return [];
    }
}

async function savePosts(posts) {
    try {
        console.log('Salvando posts...');
        const filePath = path.join(dataDir, 'posts.json');
        console.log('Caminho do arquivo:', filePath);
        console.log('Conteúdo a ser salvo:', JSON.stringify(posts, null, 2));
        
        await fs.writeFile(
            filePath,
            JSON.stringify(posts, null, 2),
            'utf8'
        );
        console.log('Posts salvos com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar posts:', error);
        throw error;
    }
}

// Rotas para o blog
app.get('/api/posts', async (req, res) => {
    try {
        console.log('Recebendo requisição GET /api/posts');
        const posts = await readPosts();
        console.log('Posts encontrados:', posts);
        res.json(posts);
    } catch (error) {
        console.error('Erro ao ler posts:', error);
        res.status(500).json({ error: 'Erro ao ler posts' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        console.log('Recebendo requisição POST /api/posts');
        console.log('Dados recebidos:', req.body);
        
        const posts = await readPosts();
        const newPost = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        
        console.log('Novo post:', newPost);
        posts.unshift(newPost);
        
        await savePosts(posts);
        console.log('Post criado com sucesso!');
        
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Erro ao criar post:', error);
        res.status(500).json({ error: 'Erro ao criar post', details: error.message });
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

// Rota para upload de imagem
app.post('/api/upload', upload.single('image'), (req, res) => {
    console.log('Recebendo requisição de upload:', {
        headers: req.headers,
        file: req.file,
        body: req.body
    });

    try {
        if (!req.file) {
            console.error('Nenhum arquivo recebido');
            return res.status(400).json({ error: 'Nenhum arquivo recebido' });
        }

        console.log('Arquivo recebido com sucesso:', req.file);
        const imageUrl = `/images/blog/${req.file.filename}`;
        console.log('URL da imagem:', imageUrl);

        res.json({ 
            message: 'Upload realizado com sucesso',
            imageUrl: imageUrl,
            file: req.file
        });
    } catch (error) {
        console.error('Erro durante o upload:', error);
        res.status(500).json({ 
            error: 'Erro ao fazer upload da imagem',
            details: error.message,
            stack: error.stack
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