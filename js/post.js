// Função para carregar o post
async function loadPost() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) {
            throw new Error('ID do post não fornecido');
        }

        console.log('[Post] Carregando post:', postId);
        
        // Buscar o post no Supabase
        const { data: post, error } = await window.supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            console.error('[Post] Erro do Supabase:', error);
            throw new Error('Erro ao carregar post');
        }

        if (!post) {
            throw new Error('Post não encontrado');
        }

        console.log('[Post] Post encontrado:', post);
        
        // Atualizar o título da página
        document.title = `${post.title} | Blog EduPrado.me`;
        
        // Atualizar o conteúdo do post
        const postContent = document.querySelector('.post-content');
        if (postContent) {
            postContent.innerHTML = `
                <div class="post-header">
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        <span class="post-date">${new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                        <span class="post-category">${post.category || 'Geral'}</span>
                    </div>
                </div>
                <div class="post-image">
                    <img src="${post.image_url || 'images/profile.jpg'}" alt="${post.title}" onerror="this.src='images/profile.jpg'">
                </div>
                <div class="post-text">${post.content}</div>
            `;
        }
    } catch (error) {
        console.error('[Post] Erro ao carregar post:', error);
        const postContent = document.querySelector('.post-content');
        if (postContent) {
            postContent.innerHTML = `
                <div class="error-message">
                    <h2>Post não encontrado</h2>
                    <p>O post que você está procurando não existe ou foi removido.</p>
                    <a href="/blog.html" class="btn">Voltar para o Blog</a>
                </div>
            `;
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', loadPost); 