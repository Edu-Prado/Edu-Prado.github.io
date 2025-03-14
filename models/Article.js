const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    cover: {
        url: String,
        publicId: String
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Atualiza o updatedAt antes de salvar
articleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Gera o slug a partir do título
articleSchema.pre('save', function(next) {
    if (!this.isModified('title')) return next();
    
    this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    
    next();
});

module.exports = mongoose.model('Article', articleSchema); 