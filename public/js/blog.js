const BACKEND_URL = 'https://eduprado-backend.onrender.com';

async function loadBlogPosts() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/posts`);
        const posts = await response.json();
        
        const blogSection = document.getElementById('blog-posts');
        if (!blogSection) return;
        
        blogSection.innerHTML = posts.map(post => `
            <article class="blog-card">
                <img src="${BACKEND_URL}${post.image}" alt="${post.title}" class="blog-image">
                <div class="blog-content">
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <div class="blog-meta">
                        <span class="date">${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <a href="#" onclick="showFullPost('${post.id}')" class="read-more">Ler mais</a>
                </div>
            </article>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
    }
}

async function showFullPost(postId) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/posts`);
        const posts = await response.json();
        const post = posts.find(p => p.id === postId);
        
        if (!post) return;
        
        const modal = document.createElement('div');
        modal.className = 'post-modal';
        modal.innerHTML = `
            <div class="post-content">
                <button onclick="this.parentElement.parentElement.remove()" class="close-button">&times;</button>
                <img src="${BACKEND_URL}${post.image}" alt="${post.title}" class="post-image">
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span class="date">${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div class="post-body">
                    ${post.content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Erro ao carregar post:', error);
    }
}

// Carregar posts quando a página carregar
document.addEventListener('DOMContentLoaded', loadBlogPosts); 