document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  // Se não houver token, redireciona para o login
  if (!token) {
    window.location.href = '/auth/login.html';
    return;
  }

  const form = document.getElementById('formCriarAnuncio');
  const selectCategoria = document.getElementById('categoria');
  const selectBairro = document.getElementById('bairro');
  const feedbackAnuncio = document.getElementById('feedbackAnuncio');

  // Função para buscar e popular os dropdowns
  async function popularDropdowns() {
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // Busca categorias e bairros ao mesmo tempo
      const [resCategorias, resBairros] = await Promise.all([
        fetch('/api/admin/categorias/public', { headers }),
        fetch('/api/bairros', { headers })
      ]);

      // Popula o dropdown de categorias
      if (resCategorias.ok) {
        const categorias = await resCategorias.json();
        selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
        categorias.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.nome;
          selectCategoria.appendChild(option);
        });
      }

      // Popula o dropdown de bairros
      if (resBairros.ok) {
        const bairros = await resBairros.json();
        selectBairro.innerHTML = '<option value="">Selecione um bairro</option>';
        bairros.forEach(bairro => {
          const option = document.createElement('option');
          option.value = bairro.id;
          option.textContent = bairro.nome;
          selectBairro.appendChild(option);
        });
      }
    } catch (error) {
      feedbackAnuncio.textContent = 'Erro ao carregar dados para o formulário.';
    }
  }

  // Lógica para enviar o formulário
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dadosAnuncio = {
      titulo: document.getElementById('titulo').value,
      descricao: document.getElementById('descricao').value,
      categoria_id: selectCategoria.value,
      bairro_id: selectBairro.value
    };

    try {
      const response = await fetch('/api/anuncios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosAnuncio)
      });

      const result = await response.json();
      feedbackAnuncio.textContent = result.message;

      if (response.ok) {
        feedbackAnuncio.style.color = 'green';
        form.reset();
      } else {
        feedbackAnuncio.style.color = 'red';
      }
    } catch (error) {
      feedbackAnuncio.textContent = 'Erro de conexão ao criar anúncio.';
    }
  });

  // Chama a função para popular os dropdowns assim que a página carrega
  popularDropdowns();
});