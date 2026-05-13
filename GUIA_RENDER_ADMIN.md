# Guia rápido (Render): onde ficam as configurações do backend do admin

Este guia é para quando você já está no Render, abriu o serviço `eduprado-backend`, mas não encontra onde configurar login/usuário.

## 1) Confirmar se é o serviço certo
No serviço aberto, vá em **Logs** e procure por mensagens que indiquem Node/Express e rotas `/api/auth`.

Dica: no navegador, teste:

- `https://SEU_BACKEND/api/health` (se existir)
- `https://SEU_BACKEND/api/auth/verify` (deve responder algo como erro de token ausente)

Se não houver nada de `/api/auth`, provavelmente você está no serviço errado (frontend estático) e não no backend.

## 2) Onde ficam as variáveis no Render
Dentro do serviço correto (`eduprado-backend`):

1. Clique em **Environment** (ou **Environment Variables**).
2. Clique em **Add Environment Variable**.
3. Adicione:
   - `JWT_SECRET` = um segredo forte (texto longo e aleatório).
   - `ENABLE_PUBLIC_REGISTER` = `true` (temporário, só para criar o primeiro usuário).
4. Salve e aguarde o deploy automático.

## 3) Criar o primeiro usuário (um comando)
No seu terminal local:

```bash
curl -X POST https://SEU_BACKEND/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Seu Nome","email":"seu@email.com","password":"SenhaForte!123"}'
```

Se retornar sucesso, usuário criado.


## 3.1) "Onde é meu terminal local?" (passo a passo para leigos)
**Terminal local** = o programa de comandos do seu próprio computador (não é no Render).

- **Windows**: abra o menu Iniciar e procure por **PowerShell** (ou **Prompt de Comando**).
- **Mac**: abra o app **Terminal** (Aplicativos > Utilitários > Terminal).
- **Linux**: abra o app **Terminal** da sua distribuição.

Depois, copie e cole o comando `curl` nesse terminal e aperte **Enter**.

Se aparecer mensagem tipo `curl: command not found`, use uma destas alternativas:
1. Instalar o `curl` no seu sistema operacional; ou
2. Usar o **Postman/Insomnia** para fazer o mesmo `POST`; ou
3. Usar o **Render Shell** do serviço backend e executar o mesmo comando lá (quando disponível).


## 3.2) PowerShell (Windows): comando correto
No **PowerShell**, `curl` normalmente é um apelido de `Invoke-WebRequest` (por isso `-X`, `-H` e `-d` dão erro).

Use um destes formatos:

### Opção A — PowerShell nativo (recomendado)
```powershell
$body = @{
  name = "Eduardo"
  email = "seu-email@dominio.com"
  password = "TroquePorUmaSenhaForte!123"
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
  -Uri "https://SEU_BACKEND/api/auth/register" `
  -ContentType "application/json" `
  -Body $body
```

### Opção B — usar curl real no Windows
```powershell
curl.exe -X POST "https://SEU_BACKEND/api/auth/register" -H "Content-Type: application/json" -d "{\"name\":\"Eduardo\",\"email\":\"seu-email@dominio.com\",\"password\":\"TroquePorUmaSenhaForte!123\"}"
```

> Importante: no PowerShell, quebra de linha usa crase (`` ` ``), não barra invertida (`\`) como no bash.

## 3.3) Se aparecer erro **404 Não Localizado**
Esse erro indica que a URL existe, mas a rota `/api/auth/register` não foi encontrada no serviço que você chamou.

Checklist rápido:

1. **Confirme a URL do backend**: precisa ser a do serviço Node/Express (não a do site estático).
2. Abra no navegador:
   - `https://SEU_BACKEND/` (deve responder algo do app)
   - `https://SEU_BACKEND/api/auth/verify` (deve retornar erro de auth, não 404)
3. Se `/api/auth/verify` também der 404:
   - você está no serviço errado **ou**
   - o deploy desse backend está desatualizado/falhou.
4. No Render, abra **Logs** do serviço backend e confirme se ele subiu sem erro.
5. Verifique se as rotas estão publicadas: no código atual, o backend Supabase em `api/server.js` também expõe `/api/auth/login`, `/api/auth/verify` e `/api/auth/register`.

### Resultado esperado por status
- **404**: endpoint não existe nesse serviço (URL errada ou deploy incorreto).
- **403**: endpoint existe, mas registro público está bloqueado (normal em produção sem `ENABLE_PUBLIC_REGISTER=true`).
- **500**: endpoint existe, mas falta configuração como `JWT_SECRET`.


## 3.4) Se aparecer **Cannot GET /** ou **Cannot GET /api/auth/verify**
Isso confirma que existe um serviço Express respondendo nessa URL, mas ele está sem a rota esperada.

Neste projeto havia dois servidores possíveis:

- `server.js`: backend antigo com rotas Mongo/JWT em `/api/auth`.
- `api/server.js`: backend publicado no Render para posts/Supabase.

O domínio `https://eduprado-backend.onrender.com` está se comportando como o `api/server.js`. Por isso, o backend publicado precisava receber também as rotas de login do admin.

Depois do deploy da correção, o comportamento esperado passa a ser:

- `https://eduprado-backend.onrender.com/` deve retornar um JSON dizendo que a API está online.
- `https://eduprado-backend.onrender.com/api/auth/verify` deve retornar erro de token ausente/inválido quando aberto sem login (isso é esperado e significa que a rota existe).
- `POST /api/auth/register` deve retornar `403` se `ENABLE_PUBLIC_REGISTER` estiver desligado, ou criar o usuário se estiver temporariamente ligado.

Se ainda aparecer `Cannot GET`, faça um **Manual Deploy** no Render e confira os **Logs** para garantir que a versão nova subiu.

## 4) Fechar a porta de cadastro (importante)
Volte ao Render e ajuste:

- `ENABLE_PUBLIC_REGISTER=false` (ou remova a variável)

Depois use o admin com:

- usuário = seu email
- senha = a senha criada

## 5) Se você não achar “Environment”
Isso normalmente acontece por um destes motivos:

- Você abriu um **Static Site** em vez de um **Web Service**.
- Você está em outro workspace/team.
- Seu usuário tem permissão limitada no serviço.

## 6) Checklist de diagnóstico rápido
- O domínio do backend costuma ser algo como `*.onrender.com` e não o domínio do site estático.
- O serviço backend precisa ter logs de inicialização Node (`server.js`, `Express`, etc.).
- O frontend admin chama `/api/auth/login`; sem backend correto, login nunca funciona.


## 7) Deploy: onde publicar cada parte

- **GitHub Pages** publica o site Next.js exportado de `next-site/out` (`eduprado.me`).
- **Render** publica o backend/API (`eduprado-backend.onrender.com`).

Para o passo a passo completo de deploy, veja `DEPLOYMENT.md`.
