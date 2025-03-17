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

// Função para carregar os posts do arquivo JSON
async function loadPosts() {
    try {
        const response = await fetch('/data/posts.json');
        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        return [];
    }
}

// Função para salvar os posts no arquivo JSON
async function savePosts(posts) {
    try {
        const response = await fetch('/data/posts.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ posts })
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao salvar posts:', error);
        return false;
    }
}

// Função para carregar os posts na tabela
async function loadPostsTable() {
    const posts = await loadPosts();
    const tbody = document.querySelector('#posts-table tbody');
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
}

// Função para salvar um novo post
async function savePost(post) {
    const posts = await loadPosts();
    posts.push(post);
    return await savePosts(posts);
}

// Função para atualizar um post existente
async function updatePost(post) {
    const posts = await loadPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
        posts[index] = post;
        return await savePosts(posts);
    }
    return false;
}

// Função para deletar um post
async function deletePost(id) {
    const posts = await loadPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    return await savePosts(filteredPosts);
}

// Função para deletar todos os posts
async function deleteAllPosts() {
    return await savePosts([]);
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
        deleteAllButton.addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja deletar todos os posts? Esta ação não pode ser desfeita.')) {
                if (await deleteAllPosts()) {
                    alert('Todos os posts foram deletados com sucesso!');
                    loadPostsTable();
                } else {
                    alert('Erro ao deletar os posts.');
                }
            }
        });
    }

    // Post form
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const post = {
                id: Date.now(),
                title: document.getElementById('post-title').value,
                category: document.getElementById('post-category').value,
                content: document.getElementById('post-content').value,
                imageUrl: document.getElementById('post-image').value,
                date: new Date().toISOString()
            };

            if (await savePost(post)) {
                alert('Post salvo com sucesso!');
                postForm.reset();
                loadPostsTable();
            } else {
                alert('Erro ao salvar o post.');
            }
        });
    }
}); 