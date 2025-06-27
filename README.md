# Última Página

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)


## 📌 Descrição

O sistema **Última Página** é uma aplicação web que resgata o estilo e a nostalgia das páginas de classificados de jornais antigos. O projeto serve como uma plataforma de anúncios de serviços para a comunidade, com o objetivo de criar um canal centralizado onde os moradores possam tanto divulgar seus serviços quanto encontrar facilmente os profissionais que precisam, tudo em um ambiente digital, moderno e acessível.


## 🛠️ Funcionalidades

### Para Clientes (Usuários da Plataforma)
- **Cadastro e Autenticação:** Sistema de cadastro e login de usuários com senhas criptografadas.
- **Gerenciamento de Anúncios (CRUD):** Funcionalidade completa para criar, visualizar, editar e excluir seus próprios anúncios.
- **Filtragem:** Ferramenta para filtrar anúncios por categorias e bairros.
- **Visualização e Filtragem:** Ferramenta para visualizar todos os anúncios da plataforma e filtrar por categoria e bairro.

### Para Administradores
- **Gerenciamento de Categorias:** Funcionalidade completa para criar, editar e excluir as categorias de serviços disponíveis no sistema.
- **Moderação de Conteúdo:** Capacidade de visualizar e excluir qualquer anúncio da plataforma para manter a qualidade do conteúdo.

## 📖 Regras de Commit

- **feat**: indicam que seu trecho de código está incluindo um novo recurso.
- **fix**: indicam que seu trecho de código commitado está solucionando um problema (bug fix).
- **docs**: indicam que houveram mudanças na documentação.
- **style**: indicam que houveram alterações referentes a formatações de código.
- **refactor**: eferem-se a mudanças devido a refatorações que não alterem sua funcionalidade.
- **remove**: indicam a exclusão de arquivos, diretórios ou funcionalidades obsoletas ou não utilizadas.


## 💻 Tecnologias Utilizadas

| Tecnologia | Nome / Versão | Descrição |
| :--- | :--- | :--- |
| **Backend** | Node.js v20.x+ e Express.js | Lógica do servidor e API do sistema, construídos em Node.js com Express. |
| **Banco de Dados** | MySQL v8.0+ | Banco de dados relacional para armazenamento e persistência dos dados. |
| **Frontend** | HTML5 + CSS3 + JavaScript (ES6+) | Interface do usuário, responsável pela estrutura, estilo e interatividade no navegador. |
| **Servidor de DB Local** | XAMPP v8.2.x+ | Pacote para gerenciar o serviço do banco de dados MySQL no ambiente de desenvolvimento. |
| **Editor de Código** | Visual Studio Code | Ferramenta principal para a escrita e edição do código-fonte do projeto. |


## 📂 Estrutura de Pastas

O projeto está organizado da seguinte forma:

```
/
├── 📂 Backend/
│   ├── controllers/      # Controla a lógica das requisições da API.
│   ├── middlewares/      # Funções de segurança (autenticação, permissões).
│   ├── persistence/      # Camada de acesso direto ao banco de dados.
│   ├── routes/           # Define os endpoints da API.
│   ├── services/         # Contém as regras de negócio do sistema.
│   ├── dataBase.js       # Configuração da conexão com o MySQL.
│   └── index.js          # Ponto de entrada do servidor Express.
│
├── 📂 Frontend/
│   └── public/           # Contém todos os arquivos estáticos (HTML, CSS, JS do cliente).
│       ├── admin/
│       ├── anuncios/
│       ├── auth/
│       └── styles/
│
└── 📄 README.md         
```


## ⚙️ Como Executar o Projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina:
- [Node.js](https://nodejs.org/)
- Um servidor de banco de dados MySQL (ex: [XAMPP](https://www.apachefriends.org/pt_br/index.html) ou Docker)

### Passos
1. Clone o repositório
```
git clone https://github.com/tthaless/UltimaPagina.git
cd UltimaPagina/Backend
```

2. Instale as dependências do Backend
```
npm install
```

3. Configure o Banco de Dados
- Certifique-se de que seu servidor MySQL esteja rodando.
- Crie um banco de dados.
- Crie um script SQL para criar as tabelas.
- Verifique se as credenciais no arquivo ```Backend/dataBase.js``` correspondem às do seu ambiente local.

4. Inicie o Servidor Backend

5. Acesse a Aplicação
- Abra seu navegador e acesse ```http://localhost:3000/auth/login.html``` para começar.

## 🔀 Endpoints da API

Abaixo estão as principais rotas da API desenvolvidas:

- Autenticação
    - ```POST /api/register```: Registra um novo usuário.
    - ```POST /api/login```: Autentica um usuário e retorna um token JWT.

- Anúncios
    - ```GET /api/anuncios```: Retorna todos os anúncios.
    - ```GET /api/anuncios/meus```: Retorna os anúncios do usuário logado.
    - ```POST /api/anuncios```: Cria um novo anúncio.
    - ```PUT /api/anuncios/:id```: Atualiza um anúncio do próprio usuário.
    - ```DELETE /api/anuncios/:id```: Deleta um anúncio do próprio usuário.
    - ```DELETE /api/anuncios/admin/:id```: (Admin) Deleta qualquer anúncio.

- Categorias
    - ```GET /api/admin/categorias```: (Admin) Retorna todas as categorias para gerenciamento.
    - ```GET /api/admin/categorias/public```: Retorna todas as categorias para uso público (ex: em formulários).
    - ```POST /api/admin/categorias```: (Admin) Cria uma nova categoria.
    - ```PUT /api/admin/categorias/:id```: (Admin) Atualiza uma categoria.
    - ```DELETE /api/admin/categorias/:id```: (Admin) Deleta uma categoria.

- Bairros
    - ```GET /api/bairros```: Retorna todos os bairros.

## 👥 Contribuidores

[Arienne Alves Navarro](https://github.com/ariennenavarro)  
[Thales Rodrigues Resende](https://github.com/tthaless)
