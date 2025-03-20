// Configuração da API
const API_URL = 'https://eduprado-api.onrender.com/api';

// Função para delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Função para mostrar/ocultar tela de carregamento
function toggleLoading(show, message = 'Carregando...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.remove('d-none');
        } else {
            overlay.classList.add('d-none');
        }
        const messageElement = document.getElementById('loading-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
}

// Função para mostrar mensagem de erro
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.classList.remove('d-none');
        const alertElement = errorElement.querySelector('.alert');
        if (alertElement) {
            alertElement.textContent = message;
        }
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
        await loadPostsTable();
        
        // Configura formulário de post
        const postForm = document.getElementById('post-form');
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulário submetido');
            
            const post = {
                title: document.getElementById('post-title').value,
                category: document.getElementById('post-category').value,
                content: document.getElementById('post-content').value,
                image_url: document.getElementById('post-image').value
            };
            
            let success;
            const editingPostId = postForm.dataset.editId;
            if (editingPostId) {
                console.log('Atualizando post existente:', editingPostId);
                success = await updatePost(editingPostId, post);
            } else {
                console.log('Criando novo post');
                success = await savePost(post);
            }
            
            if (success) {
                console.log('Operação realizada com sucesso');
                postForm.reset();
                postForm.dataset.editId = '';
                document.getElementById('form-title').textContent = 'Novo Post';
                await loadPostsTable();
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

        toggleLoading(false);
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
        // Verifica a sessão atual
        const { data: { session }, error: sessionError } = await window.supabaseClient.auth.getSession();
        console.log('Resposta da verificação de autenticação:', { session, error: sessionError });
        
        if (sessionError) {
            console.error('Erro ao verificar sessão:', sessionError);
            throw sessionError;
        }
        
        if (!session) {
            console.error('Nenhuma sessão encontrada');
            throw new Error('Nenhuma sessão encontrada');
        }

        // Verifica se o usuário está autenticado
        const { data: { user }, error: userError } = await window.supabaseClient.auth.getUser();
        console.log('Verificação de usuário:', { user, userError });
        
        if (userError) {
            console.error('Erro ao verificar usuário:', userError);
            throw userError;
        }
        
        if (!user) {
            console.error('Usuário não encontrado');
            throw new Error('Usuário não encontrado');
        }
        
        console.log('Usuário autenticado:', user.email);
        toggleLoading(false);
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        showError(`Erro ao verificar autenticação: ${error.message}`);
        toggleLoading(false);
        await delay(2000); // Reduzido para 2 segundos
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

// Função para obter o token de autenticação
async function getAuthToken() {
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        return session?.access_token;
    } catch (error) {
        console.error('Erro ao obter token:', error);
        return null;
    }
}

// Função para carregar os posts da API
async function loadPosts() {
    console.log('Iniciando carregamento de posts...');
    try {
        const { data, error } = await window.supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Erro ao carregar posts:', error);
            throw error;
        }
        
        console.log('Posts carregados com sucesso:', data);
        return data || [];
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

// Função para carregar a tabela de posts
async function loadPostsTable() {
    console.log('Carregando posts...');
    const posts = await loadPosts();
    console.log('Posts carregados:', posts);
    
    const tableBody = document.querySelector('#posts-table tbody');
    if (!tableBody) {
        console.error('Elemento tbody não encontrado');
        return;
    }
    
    tableBody.innerHTML = '';
    
    if (posts.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" class="text-center">Nenhum post encontrado</td>';
        tableBody.appendChild(tr);
        return;
    }
    
    posts.forEach(post => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${post.title}</td>
            <td>${post.category}</td>
            <td>${post.content.substring(0, 100)}...</td>
            <td>${post.image_url || '-'}</td>
            <td>
                <button onclick="editPost(${post.id})" class="btn btn-sm btn-primary">Editar</button>
                <button onclick="deletePost(${post.id})" class="btn btn-sm btn-danger">Excluir</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Função para salvar um novo post
async function savePost(post) {
    try {
        console.log('Enviando post para o Supabase:', post);
        const { data, error } = await window.supabaseClient
            .from('posts')
            .insert([post])
            .select();
        
        if (error) {
            console.error('Erro ao salvar post:', error);
            return false;
        }
        
        console.log('Post salvo com sucesso:', data);
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
        const { data, error } = await window.supabaseClient
            .from('posts')
            .update(post)
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('Erro ao atualizar post:', error);
            return false;
        }
        
        console.log('Post atualizado com sucesso:', data);
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
        const { error } = await window.supabaseClient
            .from('posts')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Erro ao deletar post:', error);
            throw error;
        }
        
        console.log('Post deletado com sucesso');
        alert('Post excluído com sucesso!');
        loadPostsTable();
    } catch (error) {
        console.error('Erro ao excluir post:', error);
        alert('Erro ao excluir o post.');
    }
}

// Função para editar um post
async function editPost(id) {
    try {
        console.log(`Carregando post ${id} para edição...`);
        const { data, error } = await window.supabaseClient
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            console.error('Erro ao carregar post:', error);
            throw error;
        }
        
        console.log('Post carregado:', data);

        document.getElementById('post-title').value = data.title;
        document.getElementById('post-category').value = data.category;
        document.getElementById('post-content').value = data.content;
        document.getElementById('post-image').value = data.image_url || '';
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
        const { error } = await window.supabaseClient
            .from('posts')
            .delete()
            .neq('id', 0); // Deleta todos os posts
        
        if (error) {
            console.error('Erro ao deletar todos os posts:', error);
            throw error;
        }
        
        console.log('Todos os posts foram deletados com sucesso');
        alert('Todos os posts foram excluídos com sucesso!');
        loadPostsTable();
    } catch (error) {
        console.error('Erro ao excluir posts:', error);
        alert('Erro ao excluir os posts.');
    }
}