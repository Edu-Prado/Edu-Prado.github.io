const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Configurações do JWT
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';
const JWT_EXPIRES_IN = '24h';

// Rota de login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos' });
        }

        // Buscar usuário
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gerar token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Retornar dados do usuário e token
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para verificar token
router.get('/verify', auth, (req, res) => {
    res.json({ user: req.user });
});

// Rota para criar usuário (apenas para desenvolvimento)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar campos
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos' });
        }

        // Verificar se usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        // Criar hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar usuário
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Gerar token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para atualizar senha
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validar campos
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos' });
        }

        // Buscar usuário
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar senha atual
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha atual incorreta' });
        }

        // Criar hash da nova senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Atualizar senha
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router; 