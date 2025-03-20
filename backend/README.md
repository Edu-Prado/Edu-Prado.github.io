# Backend EduPrado.me

Backend para gerenciamento de uploads de imagens do site EduPrado.me.

## Requisitos

- Node.js 18.x ou superior
- NPM 9.x ou superior

## Configuração Local

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as variáveis conforme necessário:
  - `PORT`: Porta do servidor (padrão: 3000)
  - `UPLOAD_DIR`: Diretório para salvar as imagens
  - `MAX_FILE_SIZE`: Tamanho máximo do arquivo em bytes (padrão: 5MB)
  - `ALLOWED_ORIGINS`: URLs permitidas para CORS (separadas por vírgula)

## Executando o servidor

Desenvolvimento (com hot-reload):
```bash
npm run dev
```

Produção:
```bash
npm start
```

## Deploy no Render.com

1. Crie uma conta no [Render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Clique em "New Web Service"
4. Selecione o repositório
5. Configure as variáveis de ambiente:
   - `PORT`: 10000
   - `UPLOAD_DIR`: /data/images/blog
   - `MAX_FILE_SIZE`: 5242880
   - `ALLOWED_ORIGINS`: https://edu-prado.github.io
6. Clique em "Create Web Service"

O deploy será feito automaticamente. A URL do serviço será algo como:
`https://eduprado-backend.onrender.com`

## API Endpoints

### Upload de Imagem
- **POST** `/api/upload`
- Aceita: `multipart/form-data`
- Campo: `image`
- Tipos suportados: JPEG, PNG, WebP
- Retorna: `{ success: true, imagePath: string }`

### Excluir Imagem
- **DELETE** `/api/images/:filename`
- Retorna: `{ success: true }`

## Processamento de Imagens

- Redimensiona para 1200x630px (formato blog)
- Converte para WebP com qualidade 80%
- Mantém proporção original com crop inteligente 