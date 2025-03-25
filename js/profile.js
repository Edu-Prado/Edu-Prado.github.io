// Lista de imagens de perfil disponíveis
const profileImages = [
    'images/profile/profile1.png',
    'images/profile/profile2.png',
    'images/profile/profile3.png',
    'images/profile/profile4.png',
    'images/profile/profile5.png',
    'images/profile/profile6.png',
    'images/profile/profile7.png',
    'images/profile/profile8.png',
    'images/profile/profile9.png',
    'images/profile/profile10.png'
    'images/profile/profile11.png'
    'images/profile/profile12.png'
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
