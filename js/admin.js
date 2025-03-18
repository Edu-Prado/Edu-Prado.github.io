// Configuração da API
const API_URL = 'https://eduprado-api.onrender.com/api';

// Função para delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Função para mostrar/ocultar tela de carregamento
function toggleLoading(show, message = 'Carregando...') {
    const overlay = document.getElementById('loading-overlay');
    const messageElement = overlay.querySelector('.loading-message');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
}

// Função para mostrar mensagem de erro
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    console.error(message);
}

// Função para inicializar a aplicação
async function initializeApp() {
    console.log('Verificando cliente Supabase...');
    toggleLoading(true, 'Verificando conexão...');

    try {
        if (typeof supabase === 'undefined') {
            throw new Error('Biblioteca Supabase não foi carregada');
        }

        if (!window.supabaseClient) {
            throw new Error('Cliente Supabase não foi inicializado corretamente');
        }

        console.log('Cliente Supabase está disponível:', window.supabaseClient);

        // Verifica autenticação
        if (!await checkAuth()) return;
        
        // Carrega posts iniciais
        loadPostsTable();
        
        // Configura formulário de post
        const postForm = document.getElementById('post-form');
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulário submetido');
            
            const post = {
                title: document.getElementById('post-title').value,
                category: document.getElementById('post-category').value,
                content: document.getElementById('post-content').value,
                imageUrl: document.getElementById('post-image').value
            };
            
            let success;
            if (window.editingPostId) {
                console.log('Atualizando post existente:', window.editingPostId);
                success = await updatePost(window.editingPostId, post);
            } else {
                console.log('Criando novo post');
                success = await savePost(post);
            }
            
            if (success) {
                console.log('Operação realizada com sucesso');
                postForm.reset();
                window.editingPostId = null;
                document.querySelector('.card-header').textContent = 'Novo Post';
                loadPostsTable();
            } else {
                console.error('Falha na operação');
                alert('Erro ao salvar post');
            }
        });
        
        // Configura botão de logout
        const logoutBtn = document.getElementById('logout-button');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // Delete all posts button
        const deleteAllButton = document.getElementById('delete-all-posts');
        if (deleteAllButton) {
            deleteAllButton.addEventListener('click', deleteAllPosts);
        }
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showError(`Erro ao inicializar: ${error.message}`);
        toggleLoading(false);
        await delay(5000);
        window.location.href = 'login.html';
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando página...');
    initializeApp().catch(error => {
        console.error('Erro ao inicializar aplicação:', error);
        showError('Erro ao inicializar aplicação. Recarregando página...');
        setTimeout(() => window.location.reload(), 5000);
    });
});

// Função para verificar autenticação
async function checkAuth() {
    console.log('Verificando autenticação...');
    toggleLoading(true, 'Verificando autenticação...');
    
    try {
        // Aguarda um momento para garantir que a sessão foi estabelecida
        await delay(1000);
        
        const { data: { session }, error } = await window.supabaseClient.auth.getSession();
        console.log('Resposta da verificação de autenticação:', { session, error });
        
        if (error) {
            showError(`Erro ao verificar autenticação: ${error.message}`);
            toggleLoading(false);
            await delay(5000); // Espera 5 segundos
            window.location.href = 'login.html';
            return false;
        }
        
        if (!session) {
            showError('Nenhuma sessão encontrada. Redirecionando para login...');
            toggleLoading(false);
            await delay(5000); // Espera 5 segundos
            window.location.href = 'login.html';
            return false;
        }

        // Verifica se a sessão está ativa
        const { data: { user }, error: userError } = await window.supabaseClient.auth.getUser();
        console.log('Verificação de usuário:', { user, userError });
        
        if (userError || !user) {
            showError(`Erro ao verificar usuário: ${userError?.message || 'Usuário não encontrado'}`);
            toggleLoading(false);
            await delay(5000); // Espera 5 segundos
            window.location.href = 'login.html';
            return false;
        }
        
        console.log('Usuário autenticado:', user.email);
        toggleLoading(false);
        return true;
    } catch (error) {
        showError(`Erro ao verificar autenticação: ${error.message}`);
        toggleLoading(false);
        await delay(5000); // Espera 5 segundos
        window.location.href = 'login.html';
        return false;
    }
}

// Função para fazer login
async function login(email, password) {
    console.log('Tentando fazer login...');
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        console.log('Resposta do login:', { data, error });

        if (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
        
        console.log('Login realizado com sucesso!');
        await delay(3000); // Espera 3 segundos
        return data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return null;
    }
}

// Função para fazer logout
async function logout() {
    console.log('Fazendo logout...');
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        console.log('Resposta do logout:', { error });
        
        if (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
        
        console.log('Logout realizado com sucesso!');
        await delay(2000); // Espera 2 segundos
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Função para carregar os posts da API
async function loadPosts() {
    console.log('Iniciando carregamento de posts...');
    try {
        console.log('Fazendo requisição para:', `${API_URL}/posts`);
        const response = await fetch(`${API_URL}/posts`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            console.error('Erro na resposta da API:', response.status, response.statusText);
            throw new Error(`Erro ao carregar posts: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Posts carregados com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        return [];
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

// Função para carregar os posts na tabela
async function loadPostsTable() {
    console.log('Carregando posts...');
    const posts = await loadPosts();
    console.log('Posts carregados:', posts);
    
    const postsList = document.getElementById('posts-list');
    if (!postsList) {
        console.error('Elemento posts-list não encontrado');
        return;
    }

    if (posts.length === 0) {
        postsList.innerHTML = '<p>Nenhum post encontrado.</p>';
        return;
    }

    postsList.innerHTML = posts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <h3>${post.title}</h3>
                <p>Categoria: ${post.category}</p>
                <p>Data: ${formatDate(post.created_at)}</p>
            </div>
            <div class="post-actions">
                <button class="btn btn-sm btn-primary edit-post" data-id="${post.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-post" data-id="${post.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Adicionar listeners para os botões de editar e deletar
    postsList.querySelectorAll('.edit-post').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            editPost(id);
        });
    });

    postsList.querySelectorAll('.delete-post').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            deletePost(id);
        });
    });
}

// Função para salvar um novo post
async function savePost(post) {
    try {
        console.log('Enviando post para a API:', post);
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(post)
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Erro ao salvar post:', error);
            return false;
        }
        
        const savedPost = await response.json();
        console.log('Post salvo com sucesso:', savedPost);
        return true;
    } catch (error) {
        console.error('Erro ao salvar post:', error);
        return false;
    }
}

// Função para atualizar um post
async function updatePost(id, post) {
    try {
        console.log(`Atualizando post ${id}:`, post);
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(post)
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Erro ao atualizar post:', error);
            return false;
        }
        
        console.log('Post atualizado com sucesso');
        return true;
    } catch (error) {
        console.error('Erro ao atualizar post:', error);
        return false;
    }
}

// Função para deletar um post
async function deletePost(id) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    try {
        console.log(`Deletando post ${id}...`);
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        if (response.ok) {
            console.log('Post deletado com sucesso');
            alert('Post excluído com sucesso!');
            loadPostsTable();
        } else {
            const error = await response.json();
            console.error('Erro ao deletar post:', error);
            throw new Error('Erro ao excluir post');
        }
    } catch (error) {
        console.error('Erro ao excluir post:', error);
        alert('Erro ao excluir o post.');
    }
}

// Função para editar um post
async function editPost(id) {
    try {
        console.log(`Carregando post ${id} para edição...`);
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            console.error('Erro ao carregar post:', response.status, response.statusText);
            throw new Error('Erro ao carregar post');
        }
        
        const post = await response.json();
        console.log('Post carregado:', post);

        document.getElementById('post-title').value = post.title;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-content').value = post.content;
        document.getElementById('post-image').value = post.image_url || '';
        document.getElementById('post-form').dataset.editId = id;
        
        console.log('Formulário preenchido com dados do post');
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        alert('Erro ao carregar o post.');
    }
}

// Função para deletar todos os posts
async function deleteAllPosts() {
    if (!confirm('Tem certeza que deseja excluir TODOS os posts? Esta ação não pode ser desfeita.')) return;
    
    try {
        console.log('Iniciando exclusão de todos os posts...');
        const response = await fetch(`${API_URL}/posts`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        if (response.ok) {
            console.log('Todos os posts foram deletados com sucesso');
            alert('Todos os posts foram excluídos com sucesso!');
            loadPostsTable();
        } else {
            const error = await response.json();
            console.error('Erro ao deletar todos os posts:', error);
            throw new Error('Erro ao excluir posts');
        }
    } catch (error) {
        console.error('Erro ao excluir posts:', error);
        alert('Erro ao excluir os posts.');
    }
}