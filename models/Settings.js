const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteTitle: {
        type: String,
        required: true,
        default: 'EduPrado.me'
    },
    siteDescription: {
        type: String,
        required: true,
        default: 'Tecnologia e Inteligência Artificial'
    },
    socialMedia: {
        linkedin: String,
        github: String,
        twitter: String
    },
    contactEmail: {
        type: String,
        required: true
    },
    analytics: {
        googleAnalyticsId: String,
        customScripts: [String]
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Atualiza o updatedAt antes de salvar
settingsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Settings', settingsSchema); 