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

        // Carregar comentários
        fetchComments(postId);

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

// Função para buscar comentários
async function fetchComments(postId) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    try {
        const { data: comments, error } = await window.supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {            
            if (error.code === '404') {
                console.warn('Tabela de comentários não encontrada ou inacessível.');
                commentsList.innerHTML = '<p>Não foi possível carregar os comentários para este post.</p>';
            } else {
                console.error('Erro ao buscar comentários:', error);
                commentsList.innerHTML = '<p>Erro ao carregar comentários.</p>';
            }
            // Log do erro retornado pelo Supabase
            console.log('Detalhes do erro:', error);
            return;            
        }

        if (comments && comments.length > 0) {
            commentsList.innerHTML = comments.map(comment => `
                <div class="comment">
                    <p>${comment.content}</p>
                    <span class="comment-date">${new Date(comment.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            `).join('');
        } else {
            commentsList.innerHTML = '<p>Seja o primeiro a comentar!</p>';
        }
    } catch (err) {
        console.error('Erro ao processar busca de comentários:', err);
        commentsList.innerHTML = '<p>Erro ao carregar comentários.</p>';
    }
}

// Função para submeter um comentário
async function submitComment(postId, comment) {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;

    const commentInput = document.getElementById('comment-input');
    if (!commentInput) return;

    const commentSubmit = document.getElementById('comment-submit');
    if (!commentSubmit) return;

    try {
        commentSubmit.disabled = true;
        commentSubmit.textContent = 'Enviando...';

        const { error } = await window.supabase
            .from('comments')
            .insert([{ post_id: postId, content: comment }]);

        if (error) {
            throw error;
        }

        commentInput.value = '';
        await fetchComments(postId);
    } catch (err) {
        console.error('Erro ao submeter comentário:', err);
        // Aqui você pode adicionar feedback visual para o usuário sobre o erro
    } finally {
        commentSubmit.disabled = false;
        commentSubmit.textContent = 'Enviar Comentário';
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
        
        // Processa Markdown básico
        let formattedParagraph = paragraph
            // Negrito
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Itálico
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Imagens
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="post-content-image">')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Quebras de linha
            .split('\n')
            .join('<br>');        
        return `<p>${formattedParagraph}</p>`;
    });

    return formattedParagraphs.join('\n');
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', loadPost); 