# Última Página

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)


## 📌 Descrição

O sistema **Última Página** é uma aplicação web que resgata o estilo das últimas páginas de jornais, servindo como uma plataforma de classificados de serviços para a comunidade de Caldeiras. O objetivo é resolver a falta de um canal centralizado onde os moradores possam tanto divulgar seus serviços quanto encontrar facilmente os profissionais que precisam, tudo em um ambiente digital, moderno e acessível.


## 🛠️ Funcionalidades

### Para Clientes (Usuários da Plataforma)
- **Cadastro e Autenticação:** Sistema de login e cadastro com perfil único.
- **Gerenciamento de Anúncios (CRUD):** Funcionalidade completa para criar, visualizar, editar e excluir seus próprios anúncios.
- **Filtragem:** Ferramenta para filtrar anúncios por categorias e bairros.
- **Visualização de Detalhes:** Acesso à página de detalhes completa dos anúncios.
- **Funcionalidades Desejáveis:** Sistema de favoritos para salvar anúncios e botão para limpar filtros.

### Para Administradores
- **Gerenciamento de Categorias:** CRUD para as categorias disponíveis no sistema.
- **Moderação de Conteúdo:** Capacidade de visualizar e excluir qualquer anúncio da plataforma.

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
├── 📂 Backend
├── 📂 Documentação/       # Artefatos de análise e design do sistema.
|  ├── 📂 Diagrama de Classes
|  ├── 📂 Diagrama de Implantação
|  ├── 📂 Diagrama de Pacotes
|  ├── 📂 Diagrama de Sequência
|  └── 📂 Padrões Adotados/       # Regras e padrões de qualidade seguidos no projeto.
|  |  ├── Documento de Requisitos - Ultima Pagina.doc
|  |  ├── Guia de Boas Práticas de Codificação.docx
|  |  └── Regras de Verificação e Análise de Requisitos.docx
|  └── Documento de Requisitos - Ultima Pagina.doc
├── 📄 .gitattributes 
├── 📄 .gitignore
├── 📄 LICENSE
└── 📄 README.md          
```


## ⚙️ Como Executar o Projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v20.x ou superior)
- [XAMPP](https://www.apachefriends.org/index.html) (ou outro ambiente com MySQL)
- [Git](https://git-scm.com/)

### Passo a Passo
1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/tthaless/UltimaPagina](https://github.com/tthaless/UltimaPagina)
   cd UltimaPagina

2. **Configure o Banco de Dados:**

- Inicie o módulo do MySQL no seu painel de controle do XAMPP.
- Acesse o phpMyAdmin (ou outro cliente de DB) e crie um novo banco de dados chamado ultima_pagina.
- Importe o arquivo .sql com a estrutura das tabelas para o banco de dados criado.

...


## 👥 Contribuidores

[Arienne Alves Navarro](https://github.com/ariennenavarro)  
[Thales Rodrigues Resende](https://github.com/tthaless)
