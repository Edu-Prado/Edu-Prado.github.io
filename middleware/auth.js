const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('[SECURITY] JWT_SECRET não definido. Configure a variável de ambiente.');
}

const auth = async (req, res, next) => {
    try {
        if (!JWT_SECRET) {
            return res.status(500).json({ message: 'Configuração de autenticação inválida' });
        }

        // Pegar token do header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Buscar usuário
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Adicionar usuário à requisição
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
};

const admin = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Acesso negado.' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Por favor, faça login.' });
    }
};

module.exports = { auth, admin }; 
