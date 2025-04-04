// Lista de imagens de perfil disponíveis
const profileImages = [
    'images/profile/Profile1.png', // Corrigido para .png
    'images/profile/Profile2.png', // Corrigido para .png
    'images/profile/Profile3.png', // Corrigido para .png
    'images/profile/Profile4.png', // Corrigido para .png
    'images/profile/Profile5.png', // Corrigido para .png
    'images/profile/Profile6.png', // Corrigido para .png
    'images/profile/Profile7.png', // Corrigido para .png
    'images/profile/P0rofile8.png', // Corrigido para .png
    'images/profile/Profile9.png', // Corrigido para .png
    'images/profile/Profile10.png', // Corrigido para .png
    'images/profile/Profile11.png', // Corrigido para .png
    'images/profile/Profile12.png' // Corrigido para .png
];

// Função para selecionar uma imagem aleatória
function getRandomProfileImage() {
    const randomIndex = Math.floor(Math.random() * profileImages.length);
    return profileImages[randomIndex];
}

// Função para atualizar a imagem de perfil
function updateProfileImage() {
    // Tenta encontrar a imagem pela classe .hero-image img
    const profileImage = document.querySelector('.hero-image img'); 

    if (profileImage) {
        const newImageSrc = getRandomProfileImage();
        console.log('[Profile] Atualizando imagem para:', newImageSrc); // Log para depuração
        profileImage.src = newImageSrc;
        // Opcional: Atualizar o alt text se as imagens forem diferentes
        // profileImage.alt = "Nova descrição da imagem"; 
    } else {
        // Adiciona log de erro mais detalhado
        console.error('[Profile] Elemento da imagem de perfil não encontrado com o seletor ".hero-image img". Verifique o HTML.');
    }
}

// Garante que o DOM está pronto antes de tentar atualizar a imagem
if (document.readyState === 'loading') {
    // O DOM ainda não está pronto, espera pelo evento
    document.addEventListener('DOMContentLoaded', updateProfileImage);
} else {
    // O DOM já está pronto, executa a função imediatamente
    console.log('[Profile] DOM já carregado, atualizando imagem.');
    updateProfileImage();
}
