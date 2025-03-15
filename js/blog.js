document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

async function loadPosts() {
    try {
        const response = await fetch('https://eduprado-backend.onrender.com/api/posts');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
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
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    const postsToShow = posts.slice(0, 3);
    
    blogGrid.innerHTML = postsToShow.map(post => `
        <div class="blog-card reveal">
            <div class="blog-image">
                <img src="https://eduprado-backend.onrender.com${post.imageUrl}" alt="${post.title}">
            </div>
            <div class="blog-content">
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="blog-meta">
                    <span class="date">${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span class="category">${post.category}</span>
                </div>
                <a href="post.html?id=${post._id}" class="btn btn-secondary">Ler mais</a>
            </div>
        </div>
    `).join('');
} 