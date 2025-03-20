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
        searchInput.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const posts = await loadPosts();
            
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );
            
            displayFilteredPosts(filteredPosts);
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
        console.log('[Blog] Carregando posts do blog...');
        
        // Verifica se o cliente Supabase está disponível
        if (!window.supabase) {
            console.error('[Blog] Cliente Supabase não está disponível');
            throw new Error('Cliente Supabase não está inicializado');
        }

        console.log('[Blog] Cliente Supabase encontrado, buscando posts...');
        
        // Verifica se o método from está disponível
        if (typeof window.supabase.from !== 'function') {
            console.error('[Blog] Método "from" não encontrado no cliente Supabase');
            console.log('[Blog] Cliente Supabase:', window.supabase);
            throw new Error('Cliente Supabase inválido');
        }

        // Adiciona um timeout de 10 segundos para a requisição
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout ao carregar posts')), 10000);
        });

        const fetchPromise = window.supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        // Usa Promise.race para implementar o timeout
        const { data, error } = await Promise.race([
            fetchPromise,
            timeoutPromise
        ]);

        if (error) {
            if (error.message && error.message.includes('Failed to fetch')) {
                console.error('[Blog] Erro de conexão ao carregar posts. Verifique sua conexão com a internet.');
                throw new Error('Erro de conexão ao carregar posts');
            }
            console.error('[Blog] Erro ao carregar posts:', error);
            throw error;
        }

        if (!data) {
            console.warn('[Blog] Nenhum post encontrado');
            return [];
        }

        console.log('[Blog] Posts carregados:', data);
        return data;
    } catch (error) {
        console.error('[Blog] Erro ao carregar posts:', error);
        throw error;
    }
}

// Função para formatar a data
function formatDate(dateString) {
    console.log('Formatando data:', dateString);
    
    if (!dateString) {
        console.log('Data não fornecida');
        return 'Data não disponível';
    }

    try {
        // Tenta diferentes formatos de data
        let date;
        if (typeof dateString === 'string') {
            // Remove qualquer parte de timezone se existir
            dateString = dateString.split('T')[0];
            
            // Tenta diferentes formatos de data
            const formats = [
                /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
                /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
                /^\d{4}\/\d{2}\/\d{2}$/  // YYYY/MM/DD
            ];

            for (const format of formats) {
                if (format.test(dateString)) {
                    date = new Date(dateString);
                    break;
                }
            }

            if (!date || isNaN(date.getTime())) {
                console.log('Formato de data inválido:', dateString);
                return 'Data não disponível';
            }
        } else {
            date = new Date(dateString);
        }

        // Formata a data para o padrão brasileiro
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        const formattedDate = date.toLocaleDateString('pt-BR', options);
        console.log('Data formatada:', formattedDate);
        return formattedDate;
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
    console.log('[Blog] Exibindo posts...');
    const posts = await loadPosts();
    const blogGrid = document.querySelector('.blog-grid');
    
    if (!blogGrid) {
        console.error('[Blog] Elemento blog-grid não encontrado');
        return;
    }

    if (!Array.isArray(posts) || posts.length === 0) {
        blogGrid.innerHTML = `
            <div class="no-posts">
                <p>Nenhum post encontrado.</p>
            </div>
        `;
        return;
    }

    // Ordena os posts por data (mais recentes primeiro)
    const sortedPosts = posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Limita a 6 posts mais recentes
    const recentPosts = sortedPosts.slice(0, 6);

    blogGrid.innerHTML = recentPosts.map(post => `
        <article class="post-card">
            <div class="post-image-container">
                <img src="${isValidImageUrl(post.image_url) ? post.image_url : 'images/blog-placeholder.jpg'}" 
                     alt="${post.title}" 
                     class="post-image"
                     onerror="this.src='images/blog-placeholder.jpg'">
            </div>
            <div class="post-content">
                <h2 class="post-title">${post.title}</h2>
                <div class="post-meta">
                    <span class="post-category">${post.category || 'Sem categoria'}</span>
                    <span class="post-date">${formatDate(post.created_at)}</span>
                </div>
                <p class="post-excerpt">${post.content ? post.content.substring(0, 150) + '...' : 'Sem conteúdo'}</p>
                <a href="post.html?id=${post.id}" class="btn btn-primary">Ler mais</a>
            </div>
        </article>
    `).join('');

    console.log('[Blog] Posts exibidos com sucesso');
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
            <div class="post-image-container">
                <img src="${isValidImageUrl(post.image_url) ? post.image_url : 'images/blog-placeholder.jpg'}" 
                     alt="${post.title}" 
                     class="post-image"
                     onerror="this.src='images/blog-placeholder.jpg'">
            </div>
            <div class="post-content">
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span class="post-date">${formatDate(post.created_at)}</span>
                </div>
                <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
                <a href="post.html?id=${post.id}" class="btn btn-primary">Ler mais</a>
            </div>
        </article>
    `).join('');
}

// Função para inicializar o blog
async function initializeBlog() {
    console.log('[Blog] Inicializando blog');
    try {
        // Adiciona indicador de carregamento
        const blogGrid = document.querySelector('.blog-grid');
        if (!blogGrid) {
            console.error('[Blog] Elemento blog-grid não encontrado');
            return;
        }
        
        blogGrid.innerHTML = '<div class="loading">Carregando posts...</div>';
        
        // Tenta carregar os posts
        await displayPosts();
        
        console.log('[Blog] Blog inicializado com sucesso');
    } catch (error) {
        console.error('[Blog] Erro ao inicializar blog:', error);
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            let errorMessage = 'Desculpe, não foi possível carregar os posts.';
            
            if (error.message && error.message.includes('conexão')) {
                errorMessage = 'Erro de conexão. Verifique sua conexão com a internet.';
            }
            
            blogGrid.innerHTML = `
                <div class="error-message">
                    <p>${errorMessage}</p>
                    <button onclick="initializeBlog()" class="btn btn-primary">Tentar novamente</button>
                </div>
            `;
        }
    }
} 