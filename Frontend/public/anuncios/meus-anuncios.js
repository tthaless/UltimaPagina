document.addEventListener('DOMContentLoaded', () => {
    // Lógica para o botão "Voltar"
    const backButton = document.getElementById('backToHomeBtn');
    if (backButton) {
        backButton.onclick = () => {
            window.location.href = '/home.html';
        };
    }

    const listaMeusAnunciosDiv = document.getElementById('lista-meus-anuncios');
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = '/auth/login.html';
        return;
    }

    async function buscarMeusAnuncios() {
        try {
            const response = await fetch('/api/anuncios/meus', {
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

    // ===================================================
    // FUNÇÃO CORRIGIDA PARA RENDERIZAR OS CARDS
    // ===================================================
    function renderizarMeusAnuncios(anuncios) {
        listaMeusAnunciosDiv.innerHTML = '';
        if (anuncios.length === 0) {
        // Adicionamos a classe 'empty-list-message' ao parágrafo
        listaMeusAnunciosDiv.innerHTML = '<p class="empty-list-message">você ainda não publicou nenhum anúncio. <a href="criar-anuncio.html">criar anuncio</a></p>';
        return;
        }

        anuncios.forEach(anuncio => {
          const cardHTML = `
              <div class="ad-card">
                  <div class="ad-category">${anuncio.categoria_nome || 'N/A'}</div>
                  <div class="ad-title">${anuncio.titulo}</div>
                  <div class="ad-description">${anuncio.descricao}</div>
                  <div class="ad-location">
                      <span>BAIRRO: ${anuncio.bairro_nome || 'N/A'}</span>
                  </div>
                  <div class="ad-actions">
                      <button class="btn-edit" data-id="${anuncio.id}" title="Editar">
                          <i class="fa-regular fa-pen-to-square"></i> editar
                      </button>
                      <button class="btn-delete" data-id="${anuncio.id}" title="Excluir">
                          <i class="fa-regular fa-trash-can"></i> excluir
                      </button>
                  </div>
              </div>
          `;
          listaMeusAnunciosDiv.innerHTML += cardHTML;
      });
    }

    // Gerenciador de cliques para os botões
    listaMeusAnunciosDiv.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        if (target.classList.contains('btn-edit')) {
            window.location.href = `editar-anuncio.html?id=${id}`;
        }
        if (target.classList.contains('btn-delete')) {
            excluirAnuncio(id);
        }
    });

    async function excluirAnuncio(id) {
        if (!confirm(`Tem certeza que deseja excluir este anúncio? (ID: ${id})`)) {
            return;
        }
        try {
            const response = await fetch(`/api/anuncios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json().catch(() => ({}));
            alert(result.message || 'Operação concluída.');
            if (response.ok) {
                buscarMeusAnuncios();
            }
        } catch (error) {
            alert('Erro de conexão ao tentar excluir.');
        }
    }

    buscarMeusAnuncios();
});