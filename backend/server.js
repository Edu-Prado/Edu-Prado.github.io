require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuração do CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
console.log('Origens permitidas:', allowedOrigins);

app.use(cors({
    origin: function(origin, callback) {
        console.log('Origem da requisição:', origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Origem bloqueada:', origin);
            callback(new Error('Origem não permitida pelo CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Verificar e criar diretórios necessários
const uploadDir = path.resolve(process.env.UPLOAD_DIR);
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
app.use('/images', express.static(uploadDir));
app.use(express.static(__dirname));

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        console.log('Tipo do arquivo:', file.mimetype);
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            console.log('Tipo de arquivo não suportado:', file.mimetype);
            cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.'));
        }
    }
});

// Função auxiliar para ler/salvar posts
async function readPosts() {
    try {
        const data = await fs.readFile(path.join(dataDir, 'posts.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function savePosts(posts) {
    await fs.writeFile(
        path.join(dataDir, 'posts.json'),
        JSON.stringify(posts, null, 2),
        'utf8'
    );
}

// Rotas para o blog
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await readPosts();
        res.json(posts);
    } catch (error) {
        console.error('Erro ao ler posts:', error);
        res.status(500).json({ error: 'Erro ao ler posts' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const posts = await readPosts();
        const newPost = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        posts.unshift(newPost);
        await savePosts(posts);
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Erro ao criar post:', error);
        res.status(500).json({ error: 'Erro ao criar post' });
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
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('Nenhum arquivo enviado');
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const timestamp = Date.now();
        const originalName = req.file.originalname;
        const fileName = `${timestamp}-${originalName}`;
        const outputPath = path.join(uploadDir, fileName);

        console.log('Processando upload:', {
            originalName,
            fileName,
            outputPath,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });

        // Criar diretório se não existir
        await fs.mkdir(uploadDir, { recursive: true });

        // Processar e otimizar a imagem
        await sharp(req.file.buffer)
            .resize(1200, 630, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 })
            .toFile(outputPath);

        console.log('Upload concluído:', fileName);

        res.json({
            success: true,
            imagePath: `/images/${fileName}`
        });
    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({ error: `Erro ao processar o upload da imagem: ${error.message}` });
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
            allowedOrigins,
            port
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ error: `Erro interno do servidor: ${err.message}` });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log('Ambiente:', {
        NODE_ENV: process.env.NODE_ENV,
        uploadDir,
        dataDir,
        allowedOrigins,
        port
    });
}); 