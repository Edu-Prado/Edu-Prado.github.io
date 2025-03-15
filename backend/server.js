require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

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
            cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.'));
        }
    }
});

// Rota para upload de imagem
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const timestamp = Date.now();
        const originalName = req.file.originalname;
        const fileName = `${timestamp}-${originalName}`;
        const outputPath = path.join(process.env.UPLOAD_DIR, fileName);

        // Criar diretório se não existir
        await fs.mkdir(process.env.UPLOAD_DIR, { recursive: true });

        // Processar e otimizar a imagem
        await sharp(req.file.buffer)
            .resize(1200, 630, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 })
            .toFile(outputPath);

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
        const filePath = path.join(process.env.UPLOAD_DIR, req.params.filename);
        await fs.unlink(filePath);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        res.status(500).json({ error: 'Erro ao excluir a imagem' });
    }
});

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 