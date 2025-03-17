// Verificação de autenticação
const ADMIN_PASSWORD = 'Admin03012010';
const STORAGE_KEY = 'admin_authenticated';
const POSTS_STORAGE_KEY = 'blog_posts';

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

// Função para carregar os posts do localStorage
function loadPosts() {
    return JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY) || '[]');
}

// Função para salvar os posts no localStorage
function savePosts(posts) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    return true;
}

// Função para carregar os posts na tabela
function loadPostsTable() {
    const posts = loadPosts();
    const tbody = document.querySelector('#posts-table tbody');
    if (!tbody) return;

    tbody.innerHTML = posts.map(post => `
        <tr>
            <td>${post.title}</td>
            <td>${post.category}</td>
            <td>${new Date(post.date).toLocaleDateString('pt-BR')}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-post" data-id="${post.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-post" data-id="${post.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Adicionar listeners para os botões de editar e deletar
    tbody.querySelectorAll('.edit-post').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            editPost(id);
        });
    });

    tbody.querySelectorAll('.delete-post').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            deletePost(id);
        });
    });
}

// Função para salvar um novo post
function savePost(post) {
    const posts = loadPosts();
    posts.push(post);
    return savePosts(posts);
}

// Função para atualizar um post existente
function updatePost(post) {
    const posts = loadPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
        posts[index] = post;
        return savePosts(posts);
    }
    return false;
}

// Função para deletar um post
function deletePost(id) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    const posts = loadPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    if (savePosts(filteredPosts)) {
        alert('Post excluído com sucesso!');
        loadPostsTable();
    } else {
        alert('Erro ao excluir o post.');
    }
}

// Função para editar um post
function editPost(id) {
    const posts = loadPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('post-title').value = post.title;
    document.getElementById('post-category').value = post.category;
    document.getElementById('post-content').value = post.content;
    document.getElementById('post-image').value = post.imageUrl || '';
    document.getElementById('post-form').dataset.editId = id;
}

// Função para deletar todos os posts
function deleteAllPosts() {
    if (!confirm('Tem certeza que deseja excluir TODOS os posts? Esta ação não pode ser desfeita.')) return;
    
    if (savePosts([])) {
        alert('Todos os posts foram excluídos com sucesso!');
        loadPostsTable();
    } else {
        alert('Erro ao excluir os posts.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
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
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const post = {
                id: Date.now(),
                title: document.getElementById('post-title').value,
                category: document.getElementById('post-category').value,
                content: document.getElementById('post-content').value,
                imageUrl: document.getElementById('post-image').value,
                date: new Date().toISOString()
            };

            const editId = postForm.dataset.editId;
            let success = false;

            if (editId) {
                // Atualizar post existente
                post.id = parseInt(editId);
                success = updatePost(post);
                delete postForm.dataset.editId;
            } else {
                // Criar novo post
                success = savePost(post);
            }

            if (success) {
                alert('Post salvo com sucesso!');
                postForm.reset();
                loadPostsTable();
            } else {
                alert('Erro ao salvar o post.');
            }
        });
    }
}); 