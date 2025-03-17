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

// Função para carregar os posts do arquivo JSON
async function loadPosts() {
    try {
        const response = await fetch('/data/posts.json');
        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        return [];
    }
}

// Função para salvar os posts no arquivo JSON
async function savePosts(posts) {
    try {
        const response = await fetch('/data/posts.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ posts })
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao salvar posts:', error);
        return false;
    }
}

// Função para exibir os posts
function displayPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    if (posts.length === 0) {
        blogGrid.innerHTML = '<p class="text-center">Nenhum post encontrado.</p>';
        return;
    }
    
    blogGrid.innerHTML = posts.map(post => `
        <div class="blog-card">
            <div class="blog-image">
                <img src="${post.imageUrl || 'images/blog/default.jpg'}" alt="${post.title}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date">${new Date(post.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 150)}...</p>
                <a href="post.html?id=${post.id}" class="read-more">Ler mais</a>
            </div>
        </div>
    `).join('');
}

// Função para carregar e exibir os posts
async function initializeBlog() {
    const posts = await loadPosts();
    displayPosts(posts);

    // Adicionar listener para o campo de pesquisa
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );
            displayPosts(filteredPosts);
        });
    }
} 