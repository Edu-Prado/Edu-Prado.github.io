const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { auth, admin } = require('../middleware/auth');
const { upload, deleteImage } = require('../services/upload');

// Listar todos os artigos
router.get('/', async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } }
            ];
        }

        const articles = await Article.find(query)
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Article.countDocuments(query);

        res.json({
            articles,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar artigos.' });
    }
});

// Buscar artigo por ID
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'name');

        if (!article) {
            return res.status(404).json({ message: 'Artigo não encontrado.' });
        }

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar artigo.' });
    }
});

// Criar novo artigo
router.post('/', auth, upload.single('cover'), async (req, res) => {
    try {
        const article = new Article({
            ...req.body,
            author: req.user._id,
            cover: req.file ? {
                url: req.file.path,
                publicId: req.file.filename
            } : undefined
        });

        await article.save();
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar artigo.' });
    }
});

// Atualizar artigo
router.put('/:id', auth, upload.single('cover'), async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Artigo não encontrado.' });
        }

        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado.' });
        }

        const updates = Object.keys(req.body);
        updates.forEach(update => article[update] = req.body[update]);

        if (req.file) {
            // Deletar imagem antiga
            if (article.cover?.publicId) {
                await deleteImage(article.cover.publicId);
            }

            article.cover = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }

        await article.save();
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar artigo.' });
    }
});

// Deletar artigo
router.delete('/:id', auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Artigo não encontrado.' });
        }

        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado.' });
        }

        // Deletar imagem
        if (article.cover?.publicId) {
            await deleteImage(article.cover.publicId);
        }

        await article.remove();
        res.json({ message: 'Artigo deletado com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar artigo.' });
    }
});

// Publicar artigo
router.patch('/:id/publish', auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Artigo não encontrado.' });
        }

        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado.' });
        }

        article.status = 'published';
        await article.save();

        res.json(article);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao publicar artigo.' });
    }
});

// Incrementar visualizações
router.post('/:id/view', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Artigo não encontrado.' });
        }

        article.views += 1;
        await article.save();

        res.json({ views: article.views });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar visualização.' });
    }
});

module.exports = router; 