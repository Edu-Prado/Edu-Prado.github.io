document.addEventListener('DOMContentLoaded', () => {
    console.log('[Blog] Iniciando carregamento dos posts...');
    
    // Função auxiliar para verificar se o Google Analytics está disponível
    const trackEvent = (eventName, params) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    };

    // Configura dimensões personalizadas para análise de blog (se GA disponível)
    if (typeof gtag === 'function') {
        gtag('set', {
            'page_type': 'blog',
            'user_type': 'visitor'
        });

        // Rastreia visualização da página do blog
        trackEvent('page_view', {
            'page_title': 'Blog Home',
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
    }

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
            if (maxScroll >= 25 && maxScroll % 25 === 0) { // Rastreia a cada 25% de rolagem
                trackEvent('scroll_depth', {
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
        console.log('[Blog] Iniciando requisição para o backend...');
        const backendUrl = 'https://eduprado-backend.onrender.com/api/posts';
        console.log('[Blog] URL:', backendUrl);
        
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        console.log('[Blog] Status da resposta:', response.status);
        console.log('[Blog] Headers da resposta:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Blog] Erro na resposta:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
        }
        
        const responseText = await response.text();
        console.log('[Blog] Resposta bruta:', responseText);
        
        let posts;
        try {
            posts = JSON.parse(responseText);
            console.log('[Blog] Posts parseados:', posts);
        } catch (parseError) {
            console.error('[Blog] Erro ao fazer parse da resposta:', parseError);
            throw new Error('Erro ao processar resposta do servidor');
        }
        
        if (!Array.isArray(posts)) {
            console.error('[Blog] Formato inválido de posts:', posts);
            throw new Error('Formato inválido de posts recebidos');
        }
        
        displayPosts(posts);
    } catch (error) {
        console.error('[Blog] Erro ao carregar posts:', error);
        gtag('event', 'error', {
            'event_category': 'Blog',
            'event_label': 'Load Posts Error',
            'error_message': error.message
        });
        
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = `
                <div class="error-message">
                    <p>Erro ao carregar os posts. Por favor, tente novamente mais tarde.</p>
                    <p class="error-details">Detalhes: ${error.message}</p>
                    <button onclick="loadPosts()" class="btn btn-primary">Tentar novamente</button>
                </div>
            `;
        }
    }
}

function displayPosts(posts) {
    console.log('[Blog] Iniciando exibição dos posts...');
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) {
        console.error('[Blog] Container do blog não encontrado!');
        return;
    }

    if (posts.length === 0) {
        console.log('[Blog] Nenhum post encontrado');
        blogGrid.innerHTML = `
            <div class="no-posts-message">
                <p>Nenhum post encontrado.</p>
                <p>Seja o primeiro a criar um post!</p>
            </div>
        `;
        return;
    }

    console.log('[Blog] Total de posts:', posts.length);
    const postsToShow = posts.slice(0, 3);
    console.log('[Blog] Posts que serão exibidos:', postsToShow);
    
    try {
        blogGrid.innerHTML = postsToShow.map(post => {
            console.log('[Blog] Processando post:', post);
            
            // Verifica se a URL da imagem já é completa
            const imageUrl = post.imageUrl.startsWith('http') 
                ? post.imageUrl 
                : `https://eduprado-backend.onrender.com${post.imageUrl}`;
            
            console.log('[Blog] URL da imagem:', imageUrl);
            
            return `
                <div class="blog-card reveal">
                    <div class="blog-image">
                        <img src="${imageUrl}" 
                             alt="${post.title}"
                             onerror="this.src='images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    <div class="blog-content">
                        <h3>${post.title || 'Sem título'}</h3>
                        <p>${post.excerpt || post.content?.substring(0, 150) || 'Sem conteúdo'}...</p>
                        <div class="blog-meta">
                            <span class="date">${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                            <span class="category">${post.category || 'Geral'}</span>
                        </div>
                        <a href="post.html?id=${post.id}" class="btn btn-secondary">Ler mais</a>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log('[Blog] Posts carregados com sucesso!');
        
        // Rastreia sucesso no carregamento
        gtag('event', 'posts_loaded', {
            'event_category': 'Blog',
            'event_label': 'Posts Loaded',
            'value': posts.length
        });
    } catch (error) {
        console.error('[Blog] Erro ao renderizar posts:', error);
        blogGrid.innerHTML = `
            <div class="error-message">
                <p>Erro ao exibir os posts. Por favor, tente novamente mais tarde.</p>
                <p class="error-details">Detalhes: ${error.message}</p>
                <button onclick="loadPosts()" class="btn btn-primary">Tentar novamente</button>
            </div>
        `;
    }
} 