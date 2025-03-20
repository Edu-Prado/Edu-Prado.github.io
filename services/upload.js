const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuração do storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'eduprado',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1200, height: 630, crop: 'fill' }]
    }
});

// Configuração do upload
const upload = multer({ storage: storage });

// Função para deletar imagem
const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        return false;
    }
};

module.exports = {
    upload,
    deleteImage,
    cloudinary
}; 