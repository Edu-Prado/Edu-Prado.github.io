# EduPrado.me

Site pessoal e blog de tecnologia desenvolvido com Node.js, Express e MongoDB.

## Funcionalidades

- Blog com sistema de artigos
- Painel administrativo
- Upload de imagens com Cloudinary
- Autenticação JWT
- Estatísticas de visualização
- Design responsivo e moderno

## Requisitos

- Node.js 14.x ou superior
- MongoDB 4.x ou superior
- Conta no Cloudinary (para upload de imagens)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/eduprado-me.git
cd eduprado-me
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis com suas configurações:
  - `MONGODB_URI`: URL de conexão com o MongoDB
  - `JWT_SECRET`: Chave secreta para tokens JWT
  - `CLOUDINARY_*`: Credenciais do Cloudinary

4. Inicie o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Estrutura do Projeto

```
eduprado-me/
├── admin/              # Arquivos do painel administrativo
├── models/            # Modelos do MongoDB
├── routes/            # Rotas da API
├── middleware/        # Middlewares
├── public/           # Arquivos estáticos do frontend
├── .env              # Variáveis de ambiente
├── package.json      # Dependências e scripts
└── server.js         # Arquivo principal do servidor
```

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro (apenas desenvolvimento)
- `GET /api/auth/verify` - Verificar token
- `PUT /api/auth/password` - Atualizar senha

### Artigos
- `GET /api/articles` - Listar artigos
- `GET /api/articles/:id` - Buscar artigo
- `POST /api/articles` - Criar artigo
- `PUT /api/articles/:id` - Atualizar artigo
- `DELETE /api/articles/:id` - Excluir artigo
- `PATCH /api/articles/:id/publish` - Publicar artigo
- `POST /api/articles/:id/view` - Registrar visualização

### Configurações
- `GET /api/settings` - Buscar configurações
- `PUT /api/settings` - Atualizar configurações
- `POST /api/settings/reset` - Resetar configurações

### Estatísticas
- `GET /api/stats` - Estatísticas gerais
- `GET /api/stats/period` - Estatísticas por período
- `GET /api/stats/top` - Artigos mais visualizados
- `GET /api/stats/tags` - Estatísticas por tags

## Segurança

- Todas as rotas da API (exceto login e registro) requerem autenticação
- Senhas são hasheadas com bcrypt
- Tokens JWT expiram em 24 horas
- Upload de imagens é validado e processado pelo Cloudinary

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 