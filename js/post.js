const API_URL = 'https://eduprado-backend.onrender.com/api';

// Função para carregar um post específico da API
async function loadPost(id) {
    try {
        const response = await fetch(`${API_URL}/posts/${id}`);
        if (!response.ok) throw new Error('Post não encontrado');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        return null;
    }
}

// Função para exibir o post na página
function displayPost(post) {
    if (!post) {
        document.querySelector('.post-container').innerHTML = `
            <div class="error-message">
                <h2>Post não encontrado</h2>
                <p>O post que você está procurando não existe ou foi removido.</p>
                <a href="index.html#blog" class="btn btn-primary">Voltar para o Blog</a>
            </div>
        `;
        return;
    }

    document.title = `${post.title} - Blog Edu Prado`;
    
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-category').textContent = post.category;
    document.getElementById('post-date').textContent = new Date(post.created_at).toLocaleDateString('pt-BR');
    
    const postImage = document.getElementById('post-image');
    postImage.src = post.image_url || 'images/blog-placeholder.jpg';
    postImage.alt = post.title;
    
    document.getElementById('post-content').innerHTML = post.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
}

// Inicializar a página do post
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    
    if (!postId) {
        document.querySelector('.post-container').innerHTML = `
            <div class="error-message">
                <h2>Post não encontrado</h2>
                <p>Nenhum post foi especificado.</p>
                <a href="index.html#blog" class="btn btn-primary">Voltar para o Blog</a>
            </div>
        `;
        return;
    }

    const post = await loadPost(postId);
    displayPost(post);
}); 