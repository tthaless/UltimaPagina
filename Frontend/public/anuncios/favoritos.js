document.addEventListener('DOMContentLoaded', () => {
    const listaFavoritosDiv = document.getElementById('lista-favoritos');
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = '/auth/login.html';
        return;
    }

    if (typeof showFeedbackModal !== 'function') {
        window.showFeedbackModal = function(title, message, type = 'success') {
            alert(`${title}: ${message}`);
        };
    }

    const backButton = document.getElementById('backToHomeBtn');
    if (backButton) {
        backButton.onclick = () => {
            window.location.href = '/home.html';
        };
    }

    async function buscarFavoritos() {
        try {
            const response = await fetch('/api/favoritos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                listaFavoritosDiv.innerHTML = '<p>Erro ao buscar seus anúncios favoritos.</p>';
                return;
            }
            const favoritos = await response.json();
            renderizarFavoritos(favoritos);
        } catch (error) {
            listaFavoritosDiv.innerHTML = '<p>Erro de conexão com o servidor ao buscar favoritos.</p>';
            console.error('Erro em buscarFavoritos:', error);
        }
    }

    function renderizarFavoritos(favoritos) {
        listaFavoritosDiv.innerHTML = ''; 

        if (favoritos.length === 0) {
            listaFavoritosDiv.innerHTML = '<p class="empty-list-message">Você ainda não favoritou nenhum anúncio. <a href="/home.html">Explore anúncios para favoritar</a></p>';
            return;
        }

        favoritos.forEach(anuncio => {
            const heartClass = 'fa-solid fa-heart'; 
            const favoritedContainerClass = 'ad-favorite favorited'; 

            const anuncioHTML = `
                <div class="ad-card">
                    <div class="ad-category">${anuncio.categoria_nome || 'SEM CATEGORIA'}</div>
                    <div class="ad-title">${anuncio.titulo}</div>
                    <div class="ad-description">${anuncio.descricao}</div>
                    <div class="ad-location">
                        <span>BAIRRO: ${anuncio.bairro_nome || 'N/A'}</span>
                        <span>PUBLICADO POR: ${anuncio.autor_nome || 'N/A'}</span>
                    </div>
                    <div class="${favoritedContainerClass}" data-ad-id="${anuncio.id}" data-action="remove-favorite">
                        <i class="${heartClass}"></i> </div>
                </div>
            `;
            listaFavoritosDiv.innerHTML += anuncioHTML;
        });
    }

    // Lógica para lidar com cliques no coração para REMOVER dos favoritos
    listaFavoritosDiv.addEventListener('click', async (event) => {
        const favoriteContainer = event.target.closest('.ad-favorite[data-action="remove-favorite"]');
        if (favoriteContainer) {
            const anuncioId = favoriteContainer.dataset.adId;
            if (!anuncioId) {
                console.error('ID do anúncio não encontrado no elemento favorito.');
                showFeedbackModal('Erro!', 'ID do anúncio não encontrado.', 'error');
                return;
            }

            const modal = document.getElementById('confirm-modal');
            const confirmBtn = document.getElementById('modal-btn-confirm');
            const cancelBtn = document.getElementById('modal-btn-cancel');

            modal.querySelector('h2').textContent = 'Remover dos favoritos?';
            modal.querySelector('p').textContent = 'Você tem certeza que deseja remover este anúncio de seus favoritos?';
            confirmBtn.textContent = 'Remover';
            confirmBtn.classList.remove('btn-excluir');
            confirmBtn.classList.add('btn-salvar');

            modal.classList.add('show');

            const userConfirmed = await new Promise(resolve => {
                confirmBtn.onclick = () => {
                    modal.classList.remove('show');
                    resolve(true);
                };
                cancelBtn.onclick = () => {
                    modal.classList.remove('show');
                    resolve(false);
                };
            });
            
            if (!userConfirmed) {
                confirmBtn.textContent = 'Excluir';
                confirmBtn.classList.remove('btn-salvar');
                confirmBtn.classList.add('btn-excluir');
                modal.querySelector('h2').textContent = 'Você tem certeza que deseja excluir?';
                modal.querySelector('p').textContent = 'Essa ação não poderá ser desfeita.';
                return;
            }

            try {
                const response = await fetch(`/api/anuncios/${anuncioId}/favorite`, {
                    method: 'POST', 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ anuncioId: anuncioId })
                });

                const result = await response.json();

                if (response.ok) {
                    showFeedbackModal('Sucesso!', result.message, 'success');
                    buscarFavoritos(); 
                } else {
                    showFeedbackModal('Ops!', result.message || 'Erro ao remover dos favoritos.', 'error');
                }
            } catch (error) {
                console.error('Erro de conexão ao remover favorito:', error);
                showFeedbackModal('Erro!', 'Erro de conexão ao servidor ao tentar remover dos favoritos.', 'error');
            } finally {
                confirmBtn.textContent = 'Excluir';
                confirmBtn.classList.remove('btn-salvar');
                confirmBtn.classList.add('btn-excluir');
                modal.querySelector('h2').textContent = 'Você tem certeza que deseja excluir?';
                modal.querySelector('p').textContent = 'Essa ação não poderá ser desfeita.';
            }
        }
    });

    buscarFavoritos();
});