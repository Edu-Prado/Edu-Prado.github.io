document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando carregamento dos posts...');
    loadPosts();
});

async function loadPosts() {
    try {
        console.log('Fazendo requisição para o backend...');
        const response = await fetch('https://eduprado-backend.onrender.com/api/posts');
        console.log('Resposta do backend:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log('Posts recebidos:', posts);
        
        displayPosts(posts);
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = '<p class="error-message">Erro ao carregar os posts. Por favor, tente novamente mais tarde.</p>';
        }
    }
}

function displayPosts(posts) {
    console.log('Iniciando exibição dos posts...');
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) {
        console.error('Container do blog não encontrado!');
        return;
    }

    console.log('Total de posts:', posts.length);
    const postsToShow = posts.slice(0, 3);
    console.log('Posts que serão exibidos:', postsToShow);
    
    blogGrid.innerHTML = postsToShow.map(post => {
        console.log('Processando post:', post);
        return `
            <div class="blog-card reveal">
                <div class="blog-image">
                    <img src="https://eduprado-backend.onrender.com${post.imageUrl}" alt="${post.title}">
                </div>
                <div class="blog-content">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt || post.content.substring(0, 150)}...</p>
                    <div class="blog-meta">
                        <span class="date">${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span class="category">${post.category}</span>
                    </div>
                    <a href="post.html?id=${post._id}" class="btn btn-secondary">Ler mais</a>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('Posts carregados com sucesso!');
} 