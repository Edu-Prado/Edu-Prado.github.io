// Credenciais (em produção, isso deve estar no servidor)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin03012010'
};

const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://eduprado-backend.onrender.com';

// Gerenciamento de autenticação
async function login(username, password) {
    try {
        // Aqui você faria a chamada para o backend
        // Por enquanto, vamos simular com uma senha hardcoded
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuário ou senha incorretos');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login');
    }
}

function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const postForm = document.getElementById('post-form');
    const tagInput = document.getElementById('post-tags');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    }

    if (postForm) {
        postForm.addEventListener('submit', savePost);
        setupImageUpload();
    }

    if (tagInput) {
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = e.target.value.trim();
                if (tag) {
                    addTag(tag);
                }
            }
        });
    }

    // Se estiver na página do dashboard
    if (document.querySelector('.admin-dashboard')) {
        checkAuth();
        loadPosts();
    }
});

// Funções para gerenciar posts
let currentPosts = [];

async function loadPosts() {
    try {
        const response = await fetch('/data/posts.json');
        currentPosts = await response.json();
        displayPosts(currentPosts);
        updateHomePage(currentPosts);
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
    }
}

function displayPosts(posts) {
    const postList = document.getElementById('post-list');
    if (!postList) return;

    const postsHTML = posts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <h3>${post.title}</h3>
                <p class="post-meta">
                    <span class="date">${post.date}</span>
                    <span class="tags">${post.tags.join(', ')}</span>
                </p>
            </div>
            <div class="post-actions">
                <button class="btn-edit" onclick="editPost(${post.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete" onclick="deletePost(${post.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');

    postList.innerHTML = postsHTML;
}

function showModal(post = null) {
    const modal = document.getElementById('post-modal');
    const form = document.getElementById('post-form');
    const title = document.getElementById('post-title');
    const description = document.getElementById('post-description');
    const content = document.getElementById('post-content');
    const imagePreview = document.getElementById('image-preview');
    const tagInput = document.getElementById('post-tags');
    const tagContainer = document.getElementById('tag-container');

    if (post) {
        title.value = post.title;
        description.value = post.description;
        content.value = post.content;
        imagePreview.src = post.image;
        displayTags(post.tags);
        form.dataset.postId = post.id;
    } else {
        form.reset();
        imagePreview.src = '/images/blog/default.jpg';
        displayTags([]);
        delete form.dataset.postId;
    }

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('post-modal');
    modal.style.display = 'none';
}

function displayTags(tags) {
    const container = document.getElementById('tag-container');
    container.innerHTML = tags.map(tag => `
        <span class="tag">
            ${tag}
            <button onclick="removeTag('${tag}')">&times;</button>
        </span>
    `).join('');
}

function addTag(tag) {
    const form = document.getElementById('post-form');
    const tags = getTags();
    if (!tags.includes(tag)) {
        tags.push(tag);
        displayTags(tags);
    }
    document.getElementById('post-tags').value = '';
}

function removeTag(tag) {
    const tags = getTags().filter(t => t !== tag);
    displayTags(tags);
}

function getTags() {
    const container = document.getElementById('tag-container');
    return Array.from(container.querySelectorAll('.tag'))
        .map(tag => tag.textContent.trim().slice(0, -1));
}

// Gerenciamento de imagens
function setupImageUpload() {
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.getElementById('image-preview');
    const uploadContainer = document.querySelector('.image-upload-container');

    if (!imageInput || !imagePreview || !uploadContainer) return;

    // Preview da imagem
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            previewImage(file);
        }
    });

    // Drag and Drop
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('drag-over');
    });

    uploadContainer.addEventListener('dragleave', () => {
        uploadContainer.classList.remove('drag-over');
    });

    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            imageInput.files = e.dataTransfer.files;
            previewImage(file);
        }
    });
}

function previewImage(file) {
    const imagePreview = document.getElementById('image-preview');
    const reader = new FileReader();
    
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao fazer upload da imagem');
        }

        const data = await response.json();
        return data.imagePath;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
    }
}

async function savePost(event) {
    event.preventDefault();
    const form = event.target;
    const imageFile = document.getElementById('post-image').files[0];
    
    try {
        let imagePath = '/images/blog/default.jpg';
        if (imageFile) {
            imagePath = await uploadImage(imageFile);
        }

        const postData = {
            title: form.title.value,
            description: form.description.value,
            content: form.content.value,
            tags: getTags(),
            date: new Date().toISOString().split('T')[0],
            readTime: Math.ceil(form.content.value.split(' ').length / 200),
            image: imagePath
        };

        if (form.dataset.postId) {
            postData.id = parseInt(form.dataset.postId);
            const index = currentPosts.findIndex(p => p.id === postData.id);
            currentPosts[index] = { ...currentPosts[index], ...postData };
        } else {
            postData.id = Math.max(0, ...currentPosts.map(p => p.id)) + 1;
            postData.slug = slugify(postData.title);
            currentPosts.push(postData);
        }

        await savePosts(currentPosts);
        closeModal();
        loadPosts();
    } catch (error) {
        alert('Erro ao salvar o post: ' + error.message);
    }
}

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

async function savePosts(posts) {
    try {
        const response = await fetch('/data/posts.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(posts, null, 2)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao salvar os posts');
        }
    } catch (error) {
        console.error('Erro ao salvar:', error);
        throw error;
    }
}

function editPost(postId) {
    const post = currentPosts.find(p => p.id === postId);
    if (post) {
        showModal(post);
    }
}

async function deletePost(postId) {
    if (confirm('Tem certeza que deseja excluir este post?')) {
        currentPosts = currentPosts.filter(p => p.id !== postId);
        try {
            await savePosts(currentPosts);
            loadPosts();
        } catch (error) {
            alert('Erro ao excluir o post: ' + error.message);
        }
    }
}

function createPost() {
    showModal();
} 