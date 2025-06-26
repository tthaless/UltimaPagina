document.addEventListener('DOMContentLoaded', () => {
  const listaCategoriasDiv = document.getElementById('lista-categorias');

  async function buscarCategorias() {
    const token = localStorage.getItem('authToken');
    console.log("Token que será usado:", token); //teste

    if (!token) {
      // Se não houver token, o usuário não está logado. Volta para o login.
      window.location.href = '/auth/login.html';
      return;
    }

    try {
      const response = await fetch('/api/admin/categorias', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const categorias = await response.json();
        renderizarCategorias(categorias);
      } else {
        // Se o token for inválido, expirado, ou o usuário não for admin
        listaCategoriasDiv.innerHTML = '<p style="color: red;">Erro: Você não tem permissão para ver este conteúdo. <a href="login.html">Faça o login novamente.</a></p>';
      }
    } catch (error) {
      listaCategoriasDiv.innerHTML = '<p style="color: red;">Erro de conexão com o servidor.</p>';
    }
  }

  function renderizarCategorias(categorias) {
  listaCategoriasDiv.innerHTML = '';
  if (categorias.length === 0) { 
    
    listaCategoriasDiv.textContent = 'Nenhuma categoria cadastrada.';
     return; 
    }

  const ul = document.createElement('ul');
  categorias.forEach(categoria => {
    const li = document.createElement('li');
    li.textContent = `ID: ${categoria.id} | Nome: ${categoria.nome}`;

    // Botão Editar
    const botaoEditar = document.createElement('button');
    botaoEditar.textContent = 'Editar';
    botaoEditar.style.marginLeft = '10px';
    botaoEditar.onclick = () => prepararEdicao(categoria); // Chama a função de edição
    li.appendChild(botaoEditar);

    // Botão Excluir 
    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.style.marginLeft = '10px';
    botaoExcluir.onclick = () => excluirCategoria(categoria.id);
    li.appendChild(botaoExcluir);

    ul.appendChild(li);
  });
  listaCategoriasDiv.appendChild(ul);
}
// Função para preparar o formulário para edição
function prepararEdicao(categoria) {
  document.getElementById('idCategoriaEdicao').value = categoria.id; // Guarda o ID no campo escondido
  document.getElementById('nomeCategoria').value = categoria.nome;
  document.getElementById('descricaoCategoria').value = categoria.descricao || '';
  document.querySelector('#formNovaCategoria button').textContent = 'Salvar Alterações'; // Muda o texto do botão
  window.scrollTo(0, 0); // Rola a página para o topo, para ver o formulário
}

// Função para limpar o formulário e voltar ao modo "Criar"
function resetarFormulario() {
  document.getElementById('idCategoriaEdicao').value = ''; // Limpa o ID
  formNovaCategoria.reset();
  document.querySelector('#formNovaCategoria button').textContent = 'Criar Categoria';
}
async function excluirCategoria(id) {
  if (!confirm(`Tem certeza que deseja excluir a categoria com ID ${id}?`)) {
    return;
  }

  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(`/api/admin/categorias/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json().catch(() => ({}));
    alert(result.message || 'Operação concluída.'); 

    if (response.ok) {
      buscarCategorias(); // Atualiza a lista na tela
    }
  } catch (error) {
    alert('Erro de conexão ao tentar excluir.');
  }
}
formNovaCategoria.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('idCategoriaEdicao').value;
  const nome = document.getElementById('nomeCategoria').value;
  const descricao = document.getElementById('descricaoCategoria').value;
  const token = localStorage.getItem('authToken');

  // Define a URL e o método com base na existência de um ID
  const url = id ? `/api/admin/categorias/${id}` : '/api/admin/categorias';
  const method = id ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome, descricao })
    });

    const result = await response.json();
    feedbackNovaCategoria.textContent = result.message;

    if (response.ok) {
      feedbackNovaCategoria.style.color = 'green';
      resetarFormulario(); // Limpa o formulário e volta ao modo "Criar"
      buscarCategorias(); // Atualiza a lista
    } else {
      feedbackNovaCategoria.style.color = 'red';
    }
  } catch (error) {
    feedbackNovaCategoria.textContent = 'Erro de conexão com o servidor.';
    feedbackNovaCategoria.style.color = 'red';
  }
});

  // Chama a função para buscar as categorias assim que a página carregar
  buscarCategorias();
 
});