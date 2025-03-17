const API_URL = 'https://eduprado-backend.onrender.com/api';

// Função auxiliar para verificar se o Google Analytics está disponível
function trackEvent(eventName, params) {
    try {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    } catch (error) {
        console.warn('[Analytics] Erro ao rastrear evento:', error);
    }
}

console.log('[Blog] Script carregado, aguardando DOMContentLoaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Blog] DOMContentLoaded disparado');
    
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) {
        console.log('[Blog] Elemento .blog-grid não encontrado');
        return;
    }
    
    console.log('[Blog] Iniciando carregamento dos posts');
    initializeBlog();

    // Adiciona funcionalidade de pesquisa
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
            
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );
            
            displayPosts(filteredPosts);
        });
    }

    // Adiciona rastreamento de cliques nos posts do blog
    document.querySelector('.blog-grid').addEventListener('click', (e) => {
        const postLink = e.target.closest('a[href^="post.html"]');
        if (postLink) {
            const postCard = postLink.closest('.blog-card');
            const postTitle = postCard.querySelector('h3').textContent;
            const postCategory = postCard.querySelector('.blog-meta span').textContent;
            
            // Rastreia clique no post com informações detalhadas
            trackEvent('post_click', {
                'event_category': 'Blog',
                'event_label': postTitle,
                'post_category': postCategory,
                'post_url': postLink.href
            });
        }
    });

    // Rastreia tempo de permanência na página
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_spent', {
            'event_category': 'Blog',
            'event_label': 'Reading Time',
            'value': timeSpent
        });
    });

    // Rastreia rolagem da página
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll >= 25 && maxScroll % 25 === 0) {
                trackEvent('scroll_depth', {
                    'event_category': 'Blog',
                    'event_label': 'Scroll Depth',
                    'value': maxScroll
                });
            }
        }
    });
});

// Função para carregar os posts
async function loadPosts() {
    try {
        console.log('Carregando posts do blog...');
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) {
            throw new Error('Erro ao carregar posts');
        }
        const posts = await response.json();
        console.log('Posts carregados:', posts);
        return posts;
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        return [];
    }
}

// Função para formatar a data
function formatDate(dateString) {
    if (!dateString) return 'Data não disponível';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Data não disponível';
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return 'Data não disponível';
    }
}

// Função para verificar se a URL da imagem é válida
function isValidImageUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Função para exibir os posts na página
async function displayPosts() {
    console.log('Exibindo posts...');
    const posts = await loadPosts();
    const blogGrid = document.querySelector('.blog-grid');
    
    if (!blogGrid) {
        console.error('Elemento blog-grid não encontrado');
        return;
    }

    if (posts.length === 0) {
        blogGrid.innerHTML = '<p>Nenhum post encontrado.</p>';
        return;
    }

    blogGrid.innerHTML = posts.map(post => `
        <article class="post-card">
            <img src="${isValidImageUrl(post.image_url) ? post.image_url : 'images/blog-placeholder.jpg'}" 
                 alt="${post.title}" 
                 class="post-image"
                 onerror="this.src='images/blog-placeholder.jpg'">
            <div class="post-content">
                <h2>${post.title}</h2>
                <p class="post-category">${post.category}</p>
                <p class="post-date">${formatDate(post.created_at)}</p>
                <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
                <a href="post.html?id=${post.id}" class="btn btn-primary">Ler mais</a>
            </div>
        </article>
    `).join('');

    // Adicionar listener para o campo de busca
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );
            displayFilteredPosts(filteredPosts);
        });
    }
}

// Função para exibir posts filtrados
function displayFilteredPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    if (posts.length === 0) {
        blogGrid.innerHTML = '<p>Nenhum post encontrado.</p>';
        return;
    }

    blogGrid.innerHTML = posts.map(post => `
        <article class="post-card">
            <img src="${isValidImageUrl(post.image_url) ? post.image_url : 'images/blog-placeholder.jpg'}" 
                 alt="${post.title}" 
                 class="post-image"
                 onerror="this.src='images/blog-placeholder.jpg'">
            <div class="post-content">
                <h2>${post.title}</h2>
                <p class="post-category">${post.category}</p>
                <p class="post-date">${formatDate(post.created_at)}</p>
                <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
                <a href="post.html?id=${post.id}" class="btn btn-primary">Ler mais</a>
            </div>
        </article>
    `).join('');
}

// Inicializar o blog
function initializeBlog() {
    console.log('Inicializando blog...');
    displayPosts();
} 