// Função para carregar o post
async function loadPost() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) {
            window.location.href = '/index.html';
            return;
        }

        console.log('[Post] Carregando post:', postId);
        
        // Buscar o post atual e os posts adjacentes
        const { data: posts, error: postsError } = await window.supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (postsError) {
            throw postsError;
        }

        // Encontrar o índice do post atual
        const currentIndex = posts.findIndex(post => post.id === parseInt(postId));
        const currentPost = posts[currentIndex];

        if (!currentPost) {
            throw new Error('Post não encontrado');
        }

        // Configurar navegação entre posts
        const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
        const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;

        const prevButton = document.getElementById('prev-post');
        const nextButton = document.getElementById('next-post');

        if (prevPost) {
            prevButton.href = `/post.html?id=${prevPost.id}`;
            prevButton.style.display = 'inline-flex';
        } else {
            prevButton.style.display = 'none';
        }

        if (nextPost) {
            nextButton.href = `/post.html?id=${nextPost.id}`;
            nextButton.style.display = 'inline-flex';
        } else {
            nextButton.style.display = 'none';
        }

        // Atualizar o título da página
        document.title = `${currentPost.title} - Edu Prado`;
        
        // Atualizar os elementos do post
        document.getElementById('post-title').textContent = currentPost.title;
        document.getElementById('post-category').textContent = currentPost.category || 'Geral';
        document.getElementById('post-date').textContent = new Date(currentPost.created_at).toLocaleDateString('pt-BR');
        
        // Configurar a imagem do post com fallback para imagem padrão
        const postImage = document.getElementById('post-image');
        postImage.src = currentPost.image_url || '/images/profile.jpg';
        postImage.onerror = function() {
            this.src = '/images/profile.jpg';
        };

        // Atualizar o conteúdo do post
        const contentElement = document.getElementById('post-content');
        
        // Formatar o conteúdo preservando quebras de linha e parágrafos
        const formattedContent = formatContent(currentPost.content);
        
        contentElement.innerHTML = formattedContent;

        // Adicionar estilos adicionais para melhor legibilidade
        contentElement.querySelectorAll('p').forEach(p => {
            p.style.marginBottom = '1.5rem';
            p.style.lineHeight = '1.8';
        });

        // Adicionar tratamento de erro para todas as imagens no conteúdo
        contentElement.querySelectorAll('img').forEach(img => {
            img.onerror = function() {
                this.src = '/images/profile.jpg';
            };
        });
    } catch (error) {
        console.error('Erro ao processar post:', error);
        document.getElementById('post-content').innerHTML = `
            <div class="error-message">
                <p>Ocorreu um erro ao carregar o post. Por favor, tente novamente mais tarde.</p>
                <a href="/index.html" class="btn btn-primary">Voltar para o Blog</a>
            </div>
        `;
    }
}

function formatContent(content) {
    // Divide o conteúdo em parágrafos
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    // Processa cada parágrafo
    const formattedParagraphs = paragraphs.map(paragraph => {
        // Verifica se é um embed do YouTube
        if (paragraph.trim().startsWith('[youtube]') && paragraph.trim().endsWith('[/youtube]')) {
            const videoId = paragraph.trim().replace('[youtube]', '').replace('[/youtube]', '').trim();
            return `<div class="video-container">
                <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>`;
        }
        
        // Processa parágrafos normais
        return `<p>${paragraph.split('\n').join('<br>')}</p>`;
    });

    return formattedParagraphs.join('\n');
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', loadPost); 