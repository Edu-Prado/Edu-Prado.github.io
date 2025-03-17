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
    loadPosts();

    // Adiciona rastreamento de cliques nos posts do blog
    document.querySelector('.blog-grid').addEventListener('click', (e) => {
        const postLink = e.target.closest('a[href^="post.html"]');
        if (postLink) {
            const postCard = postLink.closest('.blog-card');
            const postTitle = postCard.querySelector('h3').textContent;
            const postCategory = postCard.querySelector('.category').textContent;
            
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

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    console.log('[Blog] Posts carregados:', posts);
    
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    if (posts.length === 0) {
        blogGrid.innerHTML = '<p class="text-center">Nenhum post encontrado.</p>';
        return;
    }
    
    const postsHTML = posts.map(post => `
        <div class="blog-card">
            <div class="blog-image">
                <img src="${post.imageUrl || 'images/blog-default.jpg'}" alt="${post.title}">
            </div>
            <div class="blog-content">
                <h3>${post.title}</h3>
                <div class="blog-meta">
                    <span>${post.category}</span>
                    <span>${new Date(post.date).toLocaleDateString()}</span>
                </div>
                <p>${post.content.substring(0, 150)}...</p>
                <a href="post.html?id=${post.id}" class="btn btn-primary">Ler mais</a>
            </div>
        </div>
    `).join('');
    
    console.log('[Blog] HTML dos posts gerado:', postsHTML);
    blogGrid.innerHTML = postsHTML;
    console.log('[Blog] HTML inserido no elemento .blog-grid');
} 