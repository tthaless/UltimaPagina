document.addEventListener('DOMContentLoaded', () => {
    const listaFavoritosDiv = document.getElementById('lista-favoritos');
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = '/auth/login.html';
        return;
    }

    // Função auxiliar para mostrar pop-ups de feedback (definida em nav.js)
    if (typeof showFeedbackModal !== 'function') {
        window.showFeedbackModal = function(title, message, type = 'success') {
            alert(`${title}: ${message}`);
        };
    }

    // Lógica para o botão "voltar"
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
            // Mensagem para quando não há favoritos
            listaFavoritosDiv.innerHTML = '<p class="empty-list-message">Você ainda não favoritou nenhum anúncio. <a href="/home.html">Explore anúncios para favoritar</a></p>';
            return;
        }

        favoritos.forEach(anuncio => {
            // Coração sempre preenchido, pois está na lista de favoritos
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

            // Lógica do modal de confirmação (copiada do meus-anuncios.js)
            const modal = document.getElementById('confirm-modal');
            const confirmBtn = document.getElementById('modal-btn-confirm');
            const cancelBtn = document.getElementById('modal-btn-cancel');

            // Personaliza o modal de confirmação para "Remover dos favoritos"
            modal.querySelector('h2').textContent = 'Remover dos favoritos?';
            modal.querySelector('p').textContent = 'Você tem certeza que deseja remover este anúncio de seus favoritos?';
            confirmBtn.textContent = 'Remover';
            confirmBtn.classList.remove('btn-excluir'); // Remove a classe de exclusão vermelha
            confirmBtn.classList.add('btn-salvar'); // Adiciona uma classe de cor mais neutra, se tiver

            // Mostra o modal
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
                // Restaura o texto e classe do botão de confirmação caso o usuário cancele
                confirmBtn.textContent = 'Excluir'; // Ou o texto padrão do seu botão de confirmação
                confirmBtn.classList.remove('btn-salvar');
                confirmBtn.classList.add('btn-excluir');
                modal.querySelector('h2').textContent = 'Você tem certeza que deseja excluir?'; // Ou o texto padrão
                modal.querySelector('p').textContent = 'Essa ação não poderá ser desfeita.'; // Ou o texto padrão
                return; // Usuário cancelou
            }

            // Se o usuário confirmou, procede com a remoção
            try {
                // A mesma API toggleFavorite será usada para remover
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
                    // Após remover, atualiza a lista de favoritos
                    buscarFavoritos(); 
                } else {
                    showFeedbackModal('Ops!', result.message || 'Erro ao remover dos favoritos.', 'error');
                }
            } catch (error) {
                console.error('Erro de conexão ao remover favorito:', error);
                showFeedbackModal('Erro!', 'Erro de conexão ao servidor ao tentar remover dos favoritos.', 'error');
            } finally {
                // Garante que o texto e classe do botão de confirmação são restaurados após a operação (sucesso ou falha)
                confirmBtn.textContent = 'Excluir'; // Ou o texto padrão do seu botão de confirmação
                confirmBtn.classList.remove('btn-salvar');
                confirmBtn.classList.add('btn-excluir');
                modal.querySelector('h2').textContent = 'Você tem certeza que deseja excluir?'; // Ou o texto padrão
                modal.querySelector('p').textContent = 'Essa ação não poderá ser desfeita.'; // Ou o texto padrão
            }
        }
    });

    // Inicia a busca e renderização dos anúncios favoritos
    buscarFavoritos();
});