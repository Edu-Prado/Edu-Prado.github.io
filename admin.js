// Configurações da API
const API_URL = 'http://localhost:3000/api';

// Funções auxiliares
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Função para fazer requisições autenticadas
const api = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            removeToken();
            window.location.href = '/admin/login.html';
            return;
        }
        throw new Error(await response.text());
    }

    return response.json();
};

// Navegação entre seções
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!getToken() && !window.location.pathname.includes('login.html')) {
        window.location.href = '/admin/login.html';
        return;
    }

    const menuLinks = document.querySelectorAll('.admin-menu a');
    const sections = document.querySelectorAll('.admin-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            menuLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Carregar dados iniciais
    loadDashboard();
    loadArticles();
    loadSettings();

    // Preview de imagem
    const imageUpload = document.querySelector('.image-upload input[type="file"]');
    const uploadPreview = document.querySelector('.upload-preview');

    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadPreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; margin-bottom: 10px;">
                        <p>${file.name}</p>
                    `;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Editor de texto rico
    if (typeof CKEDITOR !== 'undefined') {
        CKEDITOR.replace('editor', {
            height: 400,
            removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Link,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About'
        });
    }

    // Manipulação do formulário de novo artigo
    const articleForm = document.querySelector('#new-article-form');
    if (articleForm) {
        articleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                formData.append('content', CKEDITOR.instances.editor.getData());
                
                const response = await api('/articles', {
                    method: 'POST',
                    body: formData
                });

                alert('Artigo salvo com sucesso!');
                this.reset();
                CKEDITOR.instances.editor.setData('');
                uploadPreview.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Clique para fazer upload da imagem de capa</p>
                `;
                
                loadArticles();
            } catch (error) {
                alert('Erro ao salvar artigo: ' + error.message);
            }
        });
    }

    // Manipulação do formulário de configurações
    const settingsForm = document.querySelector('#settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                const settings = Object.fromEntries(formData.entries());
                
                await api('/settings', {
                    method: 'PUT',
                    body: JSON.stringify(settings)
                });

                alert('Configurações salvas com sucesso!');
            } catch (error) {
                alert('Erro ao salvar configurações: ' + error.message);
            }
        });
    }

    // Manipulação da tabela de artigos
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja excluir este artigo?')) {
                try {
                    const articleId = this.closest('tr').dataset.id;
                    await api(`/articles/${articleId}`, {
                        method: 'DELETE'
                    });
                    
                    this.closest('tr').remove();
                } catch (error) {
                    alert('Erro ao excluir artigo: ' + error.message);
                }
            }
        });
    });

    // Barra de pesquisa
    const searchInput = document.querySelector('.admin-search input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(async function(e) {
            const searchTerm = e.target.value;
            try {
                const response = await api(`/articles?search=${searchTerm}`);
                updateArticlesTable(response.articles);
            } catch (error) {
                console.error('Erro ao pesquisar:', error);
            }
        }, 300));
    }
});

// Funções de carregamento de dados
async function loadDashboard() {
    try {
        const stats = await api('/stats');
        updateDashboardStats(stats);
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

async function loadArticles() {
    try {
        const response = await api('/articles');
        updateArticlesTable(response.articles);
    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
    }
}

async function loadSettings() {
    try {
        const settings = await api('/settings');
        updateSettingsForm(settings);
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

// Funções de atualização da interface
function updateDashboardStats(stats) {
    document.querySelector('.stat-card:nth-child(1) p').textContent = stats.totalArticles;
    document.querySelector('.stat-card:nth-child(2) p').textContent = stats.totalViews;
    document.querySelector('.stat-card:nth-child(3) p').textContent = stats.recentArticles.length;
}

function updateArticlesTable(articles) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = articles.map(article => `
        <tr data-id="${article._id}">
            <td>${article.title}</td>
            <td>${new Date(article.createdAt).toLocaleDateString()}</td>
            <td><span class="status ${article.status}">${article.status === 'published' ? 'Publicado' : 'Rascunho'}</span></td>
            <td>${article.views}</td>
            <td>
                <button class="btn-icon" title="Editar" onclick="editArticle('${article._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateSettingsForm(settings) {
    document.getElementById('site-title').value = settings.siteTitle;
    document.getElementById('site-description').value = settings.siteDescription;
    
    const socialInputs = document.querySelectorAll('.social-inputs input');
    socialInputs.forEach(input => {
        const platform = input.name;
        input.value = settings.socialMedia[platform] || '';
    });
}

// Função de debounce para limitar requisições
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para editar artigo
async function editArticle(id) {
    try {
        const article = await api(`/articles/${id}`);
        
        // Preencher formulário
        document.getElementById('title').value = article.title;
        document.getElementById('summary').value = article.summary;
        CKEDITOR.instances.editor.setData(article.content);
        
        // Atualizar preview da imagem
        if (article.cover?.url) {
            document.querySelector('.upload-preview').innerHTML = `
                <img src="${article.cover.url}" alt="Preview" style="max-width: 200px; max-height: 200px; margin-bottom: 10px;">
                <p>Imagem atual</p>
            `;
        }
        
        // Adicionar ID do artigo ao formulário
        const form = document.getElementById('new-article-form');
        form.dataset.articleId = id;
        
        // Navegar para a seção de edição
        document.querySelector('a[href="#new-article"]').click();
    } catch (error) {
        alert('Erro ao carregar artigo: ' + error.message);
    }
} 