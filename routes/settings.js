const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { auth, admin } = require('../middleware/auth');

// Buscar configurações
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar configurações.' });
    }
});

// Atualizar configurações
router.put('/', auth, admin, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'siteTitle',
            'siteDescription',
            'socialMedia',
            'contactEmail',
            'analytics'
        ];

        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Atualizações inválidas.' });
        }

        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings();
        }

        updates.forEach(update => {
            if (update === 'socialMedia' || update === 'analytics') {
                settings[update] = { ...settings[update], ...req.body[update] };
            } else {
                settings[update] = req.body[update];
            }
        });

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar configurações.' });
    }
});

// Resetar configurações
router.post('/reset', auth, admin, async (req, res) => {
    try {
        await Settings.deleteMany({});
        const settings = await Settings.create({});
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao resetar configurações.' });
    }
});

module.exports = router; 