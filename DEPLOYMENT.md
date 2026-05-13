# Deploy do EduPrado.me (GitHub Pages + Render)

Este projeto tem duas partes em produção:

1. **Site estático** (`eduprado.me`) publicado pelo **GitHub Pages**.
2. **Backend/API** (`eduprado-backend.onrender.com`) publicado pelo **Render**.

> Regra prática: alterações visuais do site vão para o **GitHub Pages**; alterações de API, login/admin e posts vão para o **Render**.

## 1) Deploy do site no GitHub Pages

O site em produção deve ser o **Next.js exportado** que fica na pasta `next-site`, pois é essa versão que contém o admin mais novo e o campo de slug/URL amigável para SEO.

### Como publicar

1. Entre no GitHub.
2. Abra o repositório `Edu-Prado.github.io`.
3. Faça merge/push das alterações na branch `main`.
4. Vá em **Actions**.
5. Abra o workflow **Deploy production Next.js site to GitHub Pages**.
6. Aguarde ficar verde.
7. Acesse `https://eduprado.me`.

### Configuração esperada em Settings > Pages

Em **Settings > Pages**:

- **Source**: `GitHub Actions`
- Domínio customizado: `eduprado.me`

O workflow `.github/workflows/pages.yml` instala as dependências em `next-site`, executa `npm run build` e publica `next-site/out` no GitHub Pages.

### O que NÃO usar como deploy principal agora

O workflow `.github/workflows/deploy.yml` antigo ficou **manual apenas** para evitar conflito. O deploy automático oficial agora é o `.github/workflows/pages.yml`, que publica `next-site/out`.

## 2) Deploy do backend no Render

O backend que atende o admin deve ser o serviço Node/Express do Render apontando para a pasta `api`.

### Configuração esperada do serviço Render

No Render, abra o serviço `eduprado-backend` e confira em **Settings**:

- **Root Directory**: `api`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Branch**: `main`
- **Auto-Deploy**: `On Commit` (recomendado) ou manual se preferir controlar tudo.

Com essa configuração, o Render usa `api/package.json`, cujo start roda `node server.js` dentro da pasta `api`. O arquivo `render.yaml` na raiz do repositório também registra essa configuração como Blueprint para evitar apontar o serviço para `backend/` ou para a raiz por engano.

### Variáveis de ambiente obrigatórias

Em **Environment**, configure:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Para criar o primeiro admin, ligue temporariamente:

- `ENABLE_PUBLIC_REGISTER=true`

Depois de criar o usuário, desligue/remova:

- `ENABLE_PUBLIC_REGISTER`

ou defina:

- `ENABLE_PUBLIC_REGISTER=false`

### Como publicar no Render

#### Opção A — automático

Se **Auto-Deploy** estiver ligado, basta fazer merge/push na branch `main`. O Render detecta o commit e faz o deploy.

#### Opção B — manual

1. Abra o Render.
2. Entre no serviço `eduprado-backend`.
3. Clique em **Manual Deploy**.
4. Clique em **Deploy latest commit**.
5. Aguarde o deploy finalizar sem erro.

## 3) Testes rápidos após o deploy

### Backend

Abra no navegador:

- `https://eduprado-backend.onrender.com/`

Resultado esperado: JSON com `EduPrado API está online`.

Abra também:

- `https://eduprado-backend.onrender.com/api/auth/verify`

Resultado esperado sem login: erro de token ausente/inválido. Isso é bom: significa que a rota existe.

### Observação sobre `Token não fornecido`

Se `https://eduprado-backend.onrender.com/api/auth/verify` retornar `{"error":"Token não fornecido"}`, o backend está respondendo corretamente. Essa rota só retorna usuário quando recebe um token de login no cabeçalho `Authorization`.

Se aparecer `Cannot GET /api/auth/verify`, o Render ainda está rodando código antigo ou está apontando para a pasta errada.

### Site

Abra:

- `https://eduprado.me`

Resultado esperado: site estático atualizado.

## 4) Como criar o primeiro admin depois do deploy correto

No PowerShell do Windows:

```powershell
$body = @{
  name = "Eduardo"
  email = "seu-email@dominio.com"
  password = "TroquePorUmaSenhaForte!123"
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
  -Uri "https://eduprado-backend.onrender.com/api/auth/register" `
  -ContentType "application/json" `
  -Body $body
```

Depois de criar o usuário, volte ao Render e desligue `ENABLE_PUBLIC_REGISTER`.

## 5) Fontes oficiais usadas para este guia

- Render: deploy automático/manual, build/start commands e Manual Deploy.
  <https://render.com/docs/deploys>
- Render: monorepo/root directory.
  <https://render.com/docs/monorepo-support>
- GitHub Pages: publicar via branch ou GitHub Actions e configurar Source.
  <https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>

## 6) Se o GitHub mostrar merge conflicts

Se o Pull Request ficar bloqueado por **merge conflicts**, veja o passo a passo em `RESOLVER_CONFLITOS_GITHUB.md`.

Resumo da decisão correta: mantenha o deploy do GitHub Pages apontando para `next-site/out` e mantenha o Render apontando para `api`.
