const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { auth } = require('../middleware/auth');

// Buscar estatísticas gerais
router.get('/', auth, async (req, res) => {
    try {
        const [
            totalArticles,
            publishedArticles,
            draftArticles,
            totalViews,
            recentArticles
        ] = await Promise.all([
            Article.countDocuments(),
            Article.countDocuments({ status: 'published' }),
            Article.countDocuments({ status: 'draft' }),
            Article.aggregate([
                { $group: { _id: null, total: { $sum: '$views' } } }
            ]),
            Article.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title views status createdAt')
        ]);

        res.json({
            totalArticles,
            publishedArticles,
            draftArticles,
            totalViews: totalViews[0]?.total || 0,
            recentArticles
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
    }
});

// Estatísticas por período
router.get('/period', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const stats = await Article.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    views: { $sum: '$views' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estatísticas por período.' });
    }
});

// Artigos mais visualizados
router.get('/top', auth, async (req, res) => {
    try {
        const topArticles = await Article.find()
            .sort({ views: -1 })
            .limit(10)
            .select('title views status createdAt')
            .populate('author', 'name');

        res.json(topArticles);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar artigos mais visualizados.' });
    }
});

// Estatísticas por tag
router.get('/tags', auth, async (req, res) => {
    try {
        const tagStats = await Article.aggregate([
            { $unwind: '$tags' },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 },
                    views: { $sum: '$views' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json(tagStats);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estatísticas por tag.' });
    }
});

module.exports = router; 