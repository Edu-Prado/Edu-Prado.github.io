// Carregar posts do arquivo JSON
let allPosts = [];
let currentPage = 1;
const postsPerPage = 6;

async function loadPosts() {
    try {
        const response = await fetch('/data/posts.json');
        allPosts = await response.json();
        displayPosts(filterPosts(''));
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
    }
}

function filterPosts(searchTerm) {
    return allPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
}

function displayPosts(posts, replace = true) {
    const blogGrid = document.getElementById('blog-grid');
    const startIndex = replace ? 0 : (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = posts.slice(startIndex, endIndex);

    const postsHTML = postsToShow.map(post => `
        <article class="blog-card reveal">
            <img src="${post.image}" alt="${post.title}" class="blog-img">
            <div class="blog-content">
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <div class="blog-meta">
                    <span class="date"><i class="far fa-calendar"></i> ${post.date}</span>
                    <span class="read-time"><i class="far fa-clock"></i> ${post.readTime} min de leitura</span>
                </div>
                <a href="/blog/${post.slug}" class="read-more">Ler mais</a>
            </div>
        </article>
    `).join('');

    if (replace) {
        blogGrid.innerHTML = postsHTML;
    } else {
        blogGrid.innerHTML += postsHTML;
    }

    // Atualizar visibilidade do botão "Carregar mais"
    const loadMoreBtn = document.getElementById('load-more');
    loadMoreBtn.style.display = endIndex >= posts.length ? 'none' : 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando carregamento dos posts...');
    try {
        // Carregar posts do backend
        console.log('Fazendo requisição para o backend...');
        const response = await fetch('https://eduprado-backend.onrender.com/api/posts');
        console.log('Resposta recebida:', response);
        
        const posts = await response.json();
        console.log('Posts carregados:', posts);

        // Encontrar o container do blog
        const blogGrid = document.querySelector('.blog-grid');
        if (!blogGrid) {
            console.error('Container do blog não encontrado!');
            return;
        }

        // Limpar o conteúdo existente
        blogGrid.innerHTML = '';

        // Adicionar os posts
        if (posts && posts.length > 0) {
            posts.forEach(post => {
                console.log('Processando post:', post);
                const article = document.createElement('article');
                article.className = 'blog-card reveal';
                article.innerHTML = `
                    <img src="${post.imageUrl}" alt="${post.title}" class="blog-img">
                    <div class="blog-content">
                        <h3>${post.title}</h3>
                        <p>${post.excerpt || post.content.substring(0, 150)}...</p>
                        <div class="blog-meta">
                            <span class="date"><i class="far fa-calendar"></i> ${new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <a href="#" class="read-more" data-id="${post.id}">Ler mais</a>
                    </div>
                `;
                blogGrid.appendChild(article);
            });
        } else {
            console.log('Nenhum post encontrado');
            blogGrid.innerHTML = '<p class="no-posts">Nenhuma postagem encontrada.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = '<p class="error">Erro ao carregar as postagens. Por favor, tente novamente mais tarde.</p>';
        }
    }
});

// Função para atualizar a página inicial
function updateHomePage(posts) {
    const blogGrid = document.querySelector('.blog .blog-grid');
    if (!blogGrid) return;

    // Pegar os 3 posts mais recentes
    const recentPosts = posts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    const postsHTML = recentPosts.map(post => `
        <article class="blog-card reveal">
            <img src="${post.image}" alt="${post.title}" class="blog-img">
            <div class="blog-content">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <a href="/blog/${post.slug}" class="read-more">Ler mais</a>
            </div>
        </article>
    `).join('');

    blogGrid.innerHTML = postsHTML;
} 