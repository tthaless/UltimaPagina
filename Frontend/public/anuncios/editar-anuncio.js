document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (!token) { window.location.href = '/auth/login.html'; return; }

  // Pega o ID do anúncio da URL
  const params = new URLSearchParams(window.location.search);
  const anuncioId = params.get('id');

  const form = document.getElementById('formEditarAnuncio');
  const feedbackAnuncio = document.getElementById('feedbackAnuncio');
  // ... (outras referências de campos)

  async function carregarDadosParaEdicao() {
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // Busca os dados DO ANÚNCIO, de TODAS AS CATEGORIAS e de TODOS OS BAIRROS
      const [resAnuncio, resCategorias, resBairros] = await Promise.all([
        fetch(`/api/anuncios/${anuncioId}`, { headers }),
        fetch('/api/admin/categorias/public', { headers }),
        fetch('/api/bairros', { headers })
      ]);

      if (!resAnuncio.ok) throw new Error('Anúncio não encontrado ou sem permissão.');

      const anuncio = await resAnuncio.json();
      const categorias = await resCategorias.json();
      const bairros = await resBairros.json();

      // Preenche os campos do formulário
      document.getElementById('anuncioId').value = anuncio.id;
      document.getElementById('titulo').value = anuncio.titulo;
      document.getElementById('descricao').value = anuncio.descricao;

      // Popula e seleciona a categoria
      const selectCategoria = document.getElementById('categoria');
      categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nome;
        if (cat.id === anuncio.categoria_id) option.selected = true;
        selectCategoria.appendChild(option);
      });

      // Popula e seleciona o bairro
      const selectBairro = document.getElementById('bairro');
      bairros.forEach(bairro => {
        const option = document.createElement('option');
        option.value = bairro.id;
        option.textContent = bairro.nome;
        if (bairro.id === anuncio.bairro_id) option.selected = true;
        selectBairro.appendChild(option);
      });

    } catch (error) {
      form.innerHTML = `<p style="color:red;">Erro ao carregar dados para edição: ${error.message}</p>`;
    }
  }

  // Lógica para ENVIAR o formulário atualizado
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dadosAtualizados = {
      titulo: document.getElementById('titulo').value,
      descricao: document.getElementById('descricao').value,
      categoria_id: document.getElementById('categoria').value,
      bairro_id: document.getElementById('bairro').value
    };

    try {
      const response = await fetch(`/api/anuncios/${anuncioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dadosAtualizados)
      });

      const result = await response.json();
      feedbackAnuncio.textContent = result.message;
      feedbackAnuncio.style.color = response.ok ? 'green' : 'red';

      if(response.ok) {
        // Volta para a lista após 2 segundos
        setTimeout(() => { window.location.href = 'meus-anuncios.html'; }, 2000);
      }

    } catch (error) {
      feedbackAnuncio.textContent = 'Erro de conexão ao salvar alterações.';
    }
  });

  // Inicia o processo quando a página carrega
  carregarDadosParaEdicao();
});