# Painel Administrativo EduPrado.me

Este é o painel administrativo do site EduPrado.me, desenvolvido para gerenciar conteúdo e configurações do site de forma eficiente e intuitiva.

## Funcionalidades

### Dashboard
- Visão geral das estatísticas do site
- Total de artigos publicados
- Número de visualizações
- Quantidade de comentários

### Gerenciamento de Artigos
- Lista de todos os artigos
- Criação de novos artigos
- Edição de artigos existentes
- Exclusão de artigos
- Upload de imagens de capa
- Editor de texto rico (CKEditor)
- Status de publicação (Publicado/Rascunho)

### Configurações
- Personalização do título do site
- Descrição do site
- Links para redes sociais
- Outras configurações gerais

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- CKEditor 5 (Editor de texto rico)
- Font Awesome (Ícones)

## Estrutura do Projeto

```
admin/
├── admin.html      # Interface do painel
├── admin.css       # Estilos do painel
├── admin.js        # Funcionalidades
└── admin-README.md # Documentação
```

## Como Usar

1. Acesse o painel através de `admin.html`
2. Navegue entre as seções usando o menu lateral
3. Para criar um novo artigo:
   - Clique em "Novo Artigo"
   - Preencha o título e resumo
   - Faça upload da imagem de capa
   - Use o editor de texto rico para o conteúdo
   - Clique em "Publicar" ou "Salvar como Rascunho"

4. Para gerenciar artigos existentes:
   - Acesse a seção "Artigos"
   - Use os botões de ação para editar ou excluir

5. Para configurar o site:
   - Acesse a seção "Configurações"
   - Atualize as informações necessárias
   - Clique em "Salvar Configurações"

## Personalização

### Cores
As cores principais do painel podem ser alteradas no arquivo `admin.css`:
```css
:root {
    --primary-color: #0071e3;
    --secondary-color: #f5f5f7;
    --text-color: #333;
    --text-light: #666;
}
```

### Editor de Texto
O CKEditor pode ser configurado no arquivo `admin.js`:
```javascript
CKEDITOR.replace('editor', {
    height: 400,
    // Adicione ou remova botões conforme necessário
    removeButtons: '...'
});
```

## Segurança

- Implemente autenticação antes de colocar em produção
- Valide todos os inputs do usuário
- Sanitize o conteúdo HTML antes de salvar
- Use HTTPS para proteger dados sensíveis

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 