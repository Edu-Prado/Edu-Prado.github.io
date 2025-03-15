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

// Verificar e criar diretório de uploads
const uploadDir = path.resolve(process.env.UPLOAD_DIR);
console.log('Diretório de uploads:', uploadDir);

fs.mkdir(uploadDir, { recursive: true })
    .then(() => console.log('Diretório de uploads criado/verificado'))
    .catch(err => console.error('Erro ao criar diretório de uploads:', err));

// Servir arquivos estáticos
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
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
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            console.log('Tipo de arquivo não suportado:', file.mimetype);
            cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.'));
        }
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
            outputPath
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
            imagePath: `/images/blog/${fileName}`
        });
    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({ error: 'Erro ao processar o upload da imagem' });
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
            allowedOrigins,
            port
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log('Ambiente:', {
        NODE_ENV: process.env.NODE_ENV,
        uploadDir,
        allowedOrigins,
        port
    });
}); 