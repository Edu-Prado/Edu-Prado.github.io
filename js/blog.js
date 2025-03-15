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