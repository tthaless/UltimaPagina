document.addEventListener('DOMContentLoaded', () => {
  const listaAnunciosDiv = document.getElementById('lista-anuncios');
  const token = localStorage.getItem('authToken');

  // Redireciona para o login se não houver token
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  async function buscarAnuncios() {
    try {
      const response = await fetch('/api/anuncios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        listaAnunciosDiv.innerHTML = '<p>Erro ao buscar anúncios. Tente fazer o login novamente.</p>';
        return;
      }

      const anuncios = await response.json();
      renderizarAnuncios(anuncios);

    } catch (error) {
      listaAnunciosDiv.innerHTML = '<p>Erro de conexão com o servidor.</p>';
    }
  }

  function renderizarAnuncios(anuncios) {
    listaAnunciosDiv.innerHTML = ''; // Limpa a mensagem "Carregando..."

    if (anuncios.length === 0) {
      listaAnunciosDiv.textContent = 'Nenhum anúncio publicado ainda.';
      return;
    }

    anuncios.forEach(anuncio => {
      // Cria o "quadrado" (card) para cada anúncio
      const card = document.createElement('div');
      card.className = 'anuncio-card'; // Aplica nosso estilo CSS

      card.innerHTML = `
        <h3>${anuncio.titulo}</h3>
        <p>${anuncio.descricao}</p>
        <hr>
        <small><strong>Categoria:</strong> ${anuncio.categoria_nome}</small><br>
        <small><strong>Bairro:</strong> ${anuncio.bairro_nome}</small><br>
        <small><strong>Publicado por:</strong> ${anuncio.autor_nome}</small>
      `;
      
      listaAnunciosDiv.appendChild(card);
    });
  }

  // Inicia a busca assim que a página carrega
  buscarAnuncios();
});