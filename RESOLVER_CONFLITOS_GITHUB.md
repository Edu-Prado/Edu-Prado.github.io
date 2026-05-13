# Como resolver merge conflicts no GitHub antes do deploy

Se o GitHub mostrar que não dá para autorizar/mergear por causa de **merge conflicts**, significa que a branch do PR e a branch `main` mexeram nos mesmos arquivos.

## Resposta curta: o que manter

Para este projeto, mantenha estas decisões:

1. **GitHub Pages deve publicar `next-site/out`**, não o `index.html` da raiz.
2. O workflow principal deve ser `.github/workflows/pages.yml` com o nome **Deploy production Next.js site to GitHub Pages**.
3. O workflow antigo `.github/workflows/deploy.yml` deve ficar **manual only** (`workflow_dispatch`) para não sobrescrever o site novo.
4. O Render backend deve apontar para a pasta `api`.
5. A resposta `{"error":"Token não fornecido"}` em `/api/auth/verify` está correta quando você acessa essa URL direto no navegador, sem login.

## Jeito mais simples pelo próprio GitHub

1. Abra o Pull Request no GitHub.
2. Clique em **Resolve conflicts**.
3. Para cada arquivo com conflito, procure blocos parecidos com este:

```txt
< < < < < < < HEAD
versão da main
= = = = = = =
versão do PR
> > > > > > > nome-da-branch
```

4. Apague as linhas `< < < < < < <`, `= = = = = = =` e `> > > > > > >`.
5. Mantenha a versão correta conforme a lista abaixo.
6. Clique em **Mark as resolved**.
7. Clique em **Commit merge**.
8. Depois clique em **Merge pull request**.

## Arquivos mais prováveis de conflito

### `.github/workflows/pages.yml`

Mantenha a versão que:

- chama **Deploy production Next.js site to GitHub Pages**;
- roda em push para `main`;
- usa `working-directory: ./next-site`;
- roda `npm install`;
- roda `npm run build`;
- cria `out/CNAME` e `out/.nojekyll`;
- publica `next-site/out`.

Não mantenha a versão que copia `index.html` da raiz para `_site`, porque essa foi a causa do site/admin antigo aparecer em produção.

### `.github/workflows/deploy.yml`

Mantenha somente:

```yml
on:
  workflow_dispatch:
```

Esse workflow antigo não deve rodar automaticamente.

### `DEPLOYMENT.md` e `GUIA_RENDER_ADMIN.md`

Mantenha a explicação dizendo que:

- GitHub Pages publica o export do **Next.js** em `next-site/out`;
- Render publica o backend/API em `eduprado-backend.onrender.com`;
- `Token não fornecido` em `/api/auth/verify` é esperado sem login.

### `render.yaml`

Mantenha:

```yml
rootDir: api
buildCommand: npm install
startCommand: npm start
```

## Depois de resolver os conflitos

1. Faça merge do PR.
2. Vá em **Actions**.
3. Rode/acompanhe **Deploy production Next.js site to GitHub Pages**.
4. Confira `https://eduprado.me/admin`.
5. No Render, se necessário, clique em **Manual Deploy > Deploy latest commit**.

## Se bater insegurança

Se você não souber qual lado manter em um conflito, priorize sempre a versão que menciona `next-site/out` para GitHub Pages e `rootDir: api` para Render.
