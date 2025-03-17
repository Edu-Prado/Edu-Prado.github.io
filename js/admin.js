// Verificação de autenticação
const ADMIN_PASSWORD = 'Admin03012010';
const STORAGE_KEY = 'admin_authenticated';
const API_URL = 'https://eduprado-backend.onrender.com/api';

// Verifica se está autenticado
function checkAuth() {
    const isAuthenticated = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!isAuthenticated) {
        window.location.href = 'admin-login.html';
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'admin-login.html';
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
                <p>Data: ${new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
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

// Função para atualizar um post existente
async function updatePost(post) {
    try {
        const response = await fetch(`${API_URL}/posts/${post.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
        return response.ok;
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
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando admin.js');
    checkAuth();
    loadPostsTable();

    // Logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Delete all posts button
    const deleteAllButton = document.getElementById('delete-all-posts');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', deleteAllPosts);
    }

    // Post form
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulário submetido');
            
            const post = {
                title: document.getElementById('post-title').value,
                category: document.getElementById('post-category').value,
                content: document.getElementById('post-content').value,
                image_url: document.getElementById('post-image').value
            };

            console.log('Dados do post:', post);

            const editId = postForm.dataset.editId;
            let success = false;

            if (editId) {
                // Atualizar post existente
                post.id = parseInt(editId);
                success = await updatePost(post);
                delete postForm.dataset.editId;
            } else {
                // Criar novo post
                success = await savePost(post);
            }

            if (success) {
                alert('Post salvo com sucesso!');
                postForm.reset();
                await loadPostsTable(); // Recarrega a lista após salvar
            } else {
                alert('Erro ao salvar o post.');
            }
        });
    }
}); 