document.addEventListener('DOMContentLoaded', () => {
  const listaMeusAnunciosDiv = document.getElementById('lista-meus-anuncios');
  const token = localStorage.getItem('authToken');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  async function buscarMeusAnuncios() {
    try {
      const response = await fetch('/api/anuncios/meus', { // Chamando a nova rota
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        listaMeusAnunciosDiv.innerHTML = '<p>Erro ao buscar seus anúncios.</p>';
        return;
      }

      const anuncios = await response.json();
      renderizarMeusAnuncios(anuncios);

    } catch (error) {
      listaMeusAnunciosDiv.innerHTML = '<p>Erro de conexão com o servidor.</p>';
    }
  }

  function renderizarMeusAnuncios(anuncios) {
    listaMeusAnunciosDiv.innerHTML = '';

    if (anuncios.length === 0) {
      listaMeusAnunciosDiv.innerHTML = '<p>Você ainda não publicou nenhum anúncio. <a href="criar-anuncio.html">Crie o primeiro!</a></p>';
      return;
    }

    anuncios.forEach(anuncio => {
      const card = document.createElement('div');
      card.className = 'anuncio-card'; // Reutilizando o estilo que já temos

      // Adicionamos os botões de Editar e Excluir
      card.innerHTML = `
        <h3>${anuncio.titulo}</h3>
        <p>${anuncio.descricao}</p>
        <hr>
        <small><strong>Categoria:</strong> ${anuncio.categoria_nome}</small><br>
        <small><strong>Bairro:</strong> ${anuncio.bairro_nome}</small><br>
        <div>
          <button onclick="editarAnuncio(${anuncio.id})">Editar</button>
          <button onclick="excluirAnuncio(${anuncio.id})">Excluir</button>
        </div>
      `;
      listaMeusAnunciosDiv.appendChild(card);
    });
  }

  window.editarAnuncio = (id) => {
  window.location.href = `editar-anuncio.html?id=${id}`;
};

  window.excluirAnuncio = async (id) => { // Tornamos a função parte do 'window' para ser acessível pelo HTML
  if (!confirm(`Tem certeza que deseja excluir este anúncio? (ID: ${id})`)) {
    return;
  }

  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(`/api/anuncios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json().catch(() => ({}));
    alert(result.message || 'Operação concluída.');

    if (response.ok) {
      buscarMeusAnuncios(); // Atualiza a lista na tela
    }
  } catch (error) {
    alert('Erro de conexão ao tentar excluir.');
  }
};
  buscarMeusAnuncios();
});