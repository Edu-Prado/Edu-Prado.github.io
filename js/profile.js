// Lista de imagens de perfil disponíveis
const profileImages = [
    'images/profile/Profile1.png',
    'images/profile/Profile2.png',
    'images/profile/Profile3.png',
    'images/profile/Profile4.png',
    'images/profile/Profile5.png',
    'images/profile/Profile6.png',
    'images/profile/Profile7.png',
    'images/profile/Profile8.png',
    'images/profile/Profile9.png',
    'images/profile/Profile10.png'
    'images/profile/Profile11.png'
    'images/profile/Profile12.png'
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
