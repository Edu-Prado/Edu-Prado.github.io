// Lista de imagens de perfil disponíveis
const profileImages = [
    'images/profile/profile1.jpg',
    'images/profile/profile2.jpg',
    'images/profile/profile3.jpg',
    'images/profile/profile4.jpg',
    'images/profile/profile5.jpg',
    'images/profile/profile6.jpg',
    'images/profile/profile7.jpg',
    'images/profile/profile8.jpg',
    'images/profile/profile9.jpg',
    'images/profile/profile10.jpg'
];

// Função para selecionar uma imagem aleatória
function getRandomProfileImage() {
    const randomIndex = Math.floor(Math.random() * profileImages.length);
    return profileImages[randomIndex];
}

// Função para atualizar a imagem de perfil
function updateProfileImage() {
    const profileImage = document.querySelector('.hero-image img');
    if (profileImage) {
        profileImage.src = getRandomProfileImage();
    }
}

// Atualiza a imagem quando a página carrega
document.addEventListener('DOMContentLoaded', updateProfileImage); 