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

// Função para carregar posts
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY) || '[]');
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;

    postsList.innerHTML = posts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <h3>${post.title}</h3>
                <p>Categoria: ${post.category}</p>
                <p>Data: ${new Date(post.date).toLocaleDateString()}</p>
            </div>
            <div class="post-actions">
                <button onclick="editPost(${post.id})" class="btn btn-secondary">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deletePost(${post.id})" class="btn btn-danger">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Função para salvar posts
function savePosts(posts) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

// Função para criar novo post
function createPost(postData) {
    const posts = JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY) || '[]');
    const newPost = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...postData
    };
    posts.push(newPost);
    savePosts(posts);
    loadPosts();
    return newPost;
}

// Função para editar post
function editPost(id) {
    const posts = JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY) || '[]');
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('title').value = post.title;
    document.getElementById('category').value = post.category;
    document.getElementById('imageUrl').value = post.imageUrl || '';
    document.getElementById('content').value = post.content;
    document.getElementById('post-form').dataset.editId = id;
}

// Função para deletar post
function deletePost(id) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    const posts = JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY) || '[]');
    const updatedPosts = posts.filter(p => p.id !== id);
    savePosts(updatedPosts);
    loadPosts();
}

// Função para excluir todos os posts
function deleteAllPosts() {
    if (!confirm('Tem certeza que deseja excluir TODOS os posts? Esta ação não pode ser desfeita.')) return;
    
    localStorage.removeItem(POSTS_STORAGE_KEY);
    loadPosts();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadPosts();

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
            
            const title = document.getElementById('title').value;
            const category = document.getElementById('category').value;
            const imageUrl = document.getElementById('imageUrl').value;
            const content = document.getElementById('content').value;

            const postData = {
                title,
                category,
                imageUrl,
                content
            };

            const editId = postForm.dataset.editId;
            if (editId) {
                // Atualizar post existente
                const posts = JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY) || '[]');
                const updatedPosts = posts.map(p => 
                    p.id === parseInt(editId) ? { ...p, ...postData } : p
                );
                savePosts(updatedPosts);
                delete postForm.dataset.editId;
            } else {
                // Criar novo post
                createPost(postData);
            }

            postForm.reset();
            loadPosts();
        });
    }
}); 