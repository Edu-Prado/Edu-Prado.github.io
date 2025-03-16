document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando carregamento dos posts...');
    
    // Configura dimensões personalizadas para análise de blog
    gtag('set', {
        'page_type': 'blog',
        'user_type': 'visitor'
    });

    // Rastreia visualização da página do blog
    gtag('event', 'page_view', {
        'page_title': 'Blog Home',
        'page_location': window.location.href,
        'page_path': window.location.pathname
    });

    loadPosts();

    // Adiciona rastreamento de cliques nos posts do blog
    document.querySelector('.blog-grid').addEventListener('click', (e) => {
        const postLink = e.target.closest('a[href^="post.html"]');
        if (postLink) {
            const postCard = postLink.closest('.blog-card');
            const postTitle = postCard.querySelector('h3').textContent;
            const postCategory = postCard.querySelector('.category').textContent;
            
            // Rastreia clique no post com informações detalhadas
            gtag('event', 'post_click', {
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
        gtag('event', 'time_spent', {
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
            if (maxScroll >= 25 && maxScroll % 25 === 0) { // Rastreia a cada 25% de rolagem
                gtag('event', 'scroll_depth', {
                    'event_category': 'Blog',
                    'event_label': 'Scroll Depth',
                    'value': maxScroll
                });
            }
        }
    });
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