// js/supabase-client.js
const SUPABASE_URL = 'https://gvnxngmxlxppvqtoqler.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2bnhuZ214bHhwcHZxdG9xbGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDE1OTgsImV4cCI6MjA1NzgxNzU5OH0.YqckHPGQ-5DAfFDITZ-vDtghXah0qwwPaIzYfVRFu5U';

let supabaseClientInstance; // Renamed to avoid conflict with global 'supabase' from SDK

try {
    // Ensure Supabase SDK (supabase from window) is loaded before this script.
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClientInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('[SupabaseClient] Cliente inicializado com sucesso.');

        // Optional: Test connection 
        supabaseClientInstance.from('posts').select('count').single()
            .then(response => {
                if (response.error) {
                    console.error('[SupabaseClient] Erro no teste de conexão:', response.error);
                } else {
                    console.log('[SupabaseClient] Teste de conexão bem sucedido.');
                }
            })
            .catch(error => {
                console.error('[SupabaseClient] Erro no teste de conexão:', error);
            });
        
        // Make the client available globally, overwriting the SDK's global 'supabase' object
        // with the initialized client. This is how js/blog.js and js/post.js expect it.
        window.supabase = supabaseClientInstance;

    } else {
        console.error('[SupabaseClient] Supabase SDK não encontrado ou `createClient` não é uma função.');
        supabaseClientInstance = null;
    }

} catch (error) {
    console.error('[SupabaseClient] Erro ao inicializar cliente:', error);
    supabaseClientInstance = null; 
}

// For potential future ES module usage, though not implemented across other scripts yet.
// export default supabaseClientInstance;
