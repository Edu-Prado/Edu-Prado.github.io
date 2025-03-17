// Configuração da API
const API_URL = 'https://eduprado-api.onrender.com/api';
const SUPABASE_URL = 'https://gvnxngmxlxppvqtoqler.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2bnhuZ214bHhwcHZxdG9xbGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDE1OTgsImV4cCI6MjA1NzgxNzU5OH0.YqckHPGQ-5DAfFDITZ-vDtghXah0qwwPaIzYfVRFu5U';

// Inicializa o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para verificar autenticação
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Função para fazer login
async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return null;
    }
}

// Função para fazer logout
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Função para carregar os posts da API
async function loadPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) throw new Error('Erro ao carregar posts');
        return await response.json();
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
                'Content-Type': 'application/json'
            },
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
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Erro ao atualizar post:', error);
            return false;
        }
        
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
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Post excluído com sucesso!');
            loadPostsTable();
        } else {
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
        const response = await fetch(`${API_URL}/posts/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar post');
        const post = await response.json();

        document.getElementById('post-title').value = post.title;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-content').value = post.content;
        document.getElementById('post-image').value = post.image_url || '';
        document.getElementById('post-form').dataset.editId = id;
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        alert('Erro ao carregar o post.');
    }
}

// Função para deletar todos os posts
async function deleteAllPosts() {
    if (!confirm('Tem certeza que deseja excluir TODOS os posts? Esta ação não pode ser desfeita.')) return;
    
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Todos os posts foram excluídos com sucesso!');
            loadPostsTable();
        } else {
            throw new Error('Erro ao excluir posts');
        }
    } catch (error) {
        console.error('Erro ao excluir posts:', error);
        alert('Erro ao excluir os posts.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticação
    if (!await checkAuth()) return;
    
    // Carrega posts iniciais
    loadPostsTable();
    
    // Configura formulário de post
    const postForm = document.getElementById('post-form');
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const post = {
            title: document.getElementById('post-title').value,
            category: document.getElementById('post-category').value,
            content: document.getElementById('post-content').value,
            imageUrl: document.getElementById('post-image').value
        };
        
        let success;
        if (window.editingPostId) {
            success = await updatePost(window.editingPostId, post);
        } else {
            success = await savePost(post);
        }
        
        if (success) {
            postForm.reset();
            window.editingPostId = null;
            document.querySelector('.card-header').textContent = 'Novo Post';
            loadPostsTable();
        } else {
            alert('Erro ao salvar post');
        }
    });
    
    // Configura botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Delete all posts button
    const deleteAllButton = document.getElementById('delete-all-posts');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', deleteAllPosts);
    }
}); 