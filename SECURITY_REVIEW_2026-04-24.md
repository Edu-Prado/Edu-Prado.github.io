# Revisão de Segurança e Qualidade de Código (24/04/2026)

## Escopo avaliado
- Backend Express principal (`server.js` + `routes/*` + `middleware/*`)
- Backend alternativo com Supabase (`api/server.js`)
- Painel admin legado (`admin/js/admin.js`)
- Cliente web principal (`js/*`)

---

## Resumo executivo
Foram encontrados **riscos críticos** no painel administrativo legado e na API alternativa com Supabase. Os principais vetores são:
1. **Autenticação client-side com credenciais hardcoded**.
2. **Endpoints de escrita sem autenticação** (criação, edição e exclusão de posts).
3. **Possível XSS** por uso de `innerHTML` sem sanitização.
4. **Configurações inseguras de segredo JWT e CORS** no backend principal.

Além disso, havia um bug funcional importante na rota de autenticação (`routes/auth.js`) que impedia o carregamento correto das rotas por import incorreto de middleware.

---

## Achados detalhados

## 1) Credenciais hardcoded e autenticação burlável no admin legado (CRÍTICO)
**Arquivo:** `admin/js/admin.js`

- Usuário/senha administrativos estão em JavaScript público.
- O estado de login depende apenas de `localStorage` (`adminLoggedIn=true`), sem validação robusta de sessão/token.

**Impacto:** qualquer pessoa com acesso ao navegador pode descobrir/forjar autenticação e acessar o dashboard legado.

**Recomendação:**
- Remover autenticação client-side imediatamente.
- Autenticar no servidor com senha hash + sessão/token assinado + expiração.
- Migrar para o fluxo já existente com Supabase/Auth e descontinuar o painel legado.

## 2) API Supabase com operações de escrita sem autenticação (CRÍTICO)
**Arquivo:** `api/server.js`

- Rotas `POST /api/posts`, `PUT /api/posts/:id`, `DELETE /api/posts/:id` e `DELETE /api/posts` não validam autenticação/autorização.
- API inicializada com `SUPABASE_SERVICE_ROLE_KEY` (chave privilegiada).

**Impacto:** caso endpoint esteja exposto, terceiros podem editar/apagar conteúdo integralmente.

**Recomendação:**
- Exigir autenticação forte em todas as operações de escrita.
- Nunca expor `service role` ao cliente; manter apenas no servidor.
- Implementar RBAC (ex.: apenas role `admin` escreve/deleta).

## 3) Risco de XSS por renderização com `innerHTML` (ALTO)
**Arquivo:** `admin/js/admin.js`

- Conteúdo de post/tags é interpolado em HTML sem sanitização.

**Impacto:** conteúdo malicioso pode executar JS no navegador de admins/visitantes.

**Recomendação:**
- Substituir por criação de nós via `document.createElement` + `textContent`.
- Se `innerHTML` for inevitável, aplicar sanitização robusta (ex.: DOMPurify).

## 4) Segredo JWT com fallback previsível (ALTO)
**Arquivos:** `routes/auth.js`, `middleware/auth.js`

- Há fallback para string estática caso `JWT_SECRET` não exista.

**Impacto:** tokens podem ser forjados se ambiente estiver mal configurado.

**Recomendação:**
- Exigir `JWT_SECRET` obrigatório na inicialização.
- Falhar boot do servidor se variável não estiver definida.

## 5) Endpoint de registro aberto em rota marcada como "desenvolvimento" (MÉDIO/ALTO)
**Arquivo:** `routes/auth.js`

- `POST /register` está ativo sem trava de ambiente.

**Impacto:** criação indevida de usuários em produção.

**Recomendação:**
- Bloquear em produção (feature flag/env guard) ou restringir por papel admin.

## 6) CORS permissivo no backend principal (MÉDIO)
**Arquivo:** `server.js`

- `app.use(cors())` permite qualquer origem por padrão.

**Impacto:** amplia superfície de abuso por navegadores de terceiros.

**Recomendação:**
- Definir allowlist explícita por ambiente.

## 7) Bug funcional corrigido nesta revisão (ALTO - disponibilidade)
**Arquivo alterado:** `routes/auth.js`

- Corrigido import do middleware `auth` (`const { auth } = require('../middleware/auth')`).

**Impacto anterior:** erro em tempo de carregamento das rotas (`Route.get() requires a callback function but got a [object Object]`).

---

## Priorização sugerida (ordem de execução)
1. **Imediato (0-24h):**
   - Retirar painel admin legado do ar ou proteger por autenticação real.
   - Proteger rotas de escrita em `api/server.js`.
2. **Curto prazo (1-3 dias):**
   - Eliminar fallback de `JWT_SECRET`.
   - Fechar `/register` em produção.
   - Restringir CORS.
3. **Médio prazo (até 1 semana):**
   - Sanitização anti-XSS e revisão de renderizações dinâmicas.
   - Rate limiting e logging de segurança para login e endpoints críticos.

---

## Evidência de validação executada
Foi reproduzido localmente o erro de middleware com o comando:

```bash
node -e "require('./routes/auth'); console.log('ok')"
```

Antes da correção, o carregamento das rotas falhava por middleware inválido. Após a correção, o módulo carrega corretamente.

---

## Atualizações aplicadas após revisão (24/04/2026)
- Removida autenticação com credenciais hardcoded no `admin/js/admin.js`; login agora usa backend (`/api/auth/login`) e valida sessão via `/api/auth/verify`.
- Endpoints de escrita em `api/server.js` agora exigem token e role `admin`.
- Adicionada validação básica de payload para criação/edição de posts em `api/server.js`.
- `server.js` atualizado para usar allowlist de CORS via variável `CORS_ORIGINS`.
- `routes/auth.js` e `middleware/auth.js` deixam de usar segredo JWT hardcoded em fallback; agora registram erro de configuração e retornam falha segura quando ausente.
- `routes/auth.js` restringe `POST /register` em produção, exceto quando `ENABLE_PUBLIC_REGISTER=true`.
