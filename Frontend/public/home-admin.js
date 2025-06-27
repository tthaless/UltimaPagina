document.addEventListener('DOMContentLoaded', () => {
    const listaAnunciosDiv = document.getElementById('lista-anuncios');
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = '/auth/login.html';
        return;
    }

    async function buscarAnuncios() {
        try {
            const response = await fetch('/api/anuncios', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                listaAnunciosDiv.innerHTML = '<p>Erro ao buscar anúncios.</p>';
                return;
            }
            const anuncios = await response.json();
            renderizarAnuncios(anuncios);
        } catch (error) {
            listaAnunciosDiv.innerHTML = '<p>Erro de conexão com o servidor.</p>';
        }
    }

    function renderizarAnuncios(anuncios) {
        listaAnunciosDiv.innerHTML = ''; 
        if (anuncios.length === 0) {
            listaAnunciosDiv.textContent = 'Nenhum anúncio publicado ainda.';
            return;
        }
        anuncios.forEach(anuncio => {
            const anuncioHTML = `
                <div class="ad-card" data-ad-id="${anuncio.id}"> <div class="ad-category">${anuncio.categoria_nome || 'SEM CATEGORIA'}</div>
                    <div class="ad-title">${anuncio.titulo}</div>
                    <div class="ad-description">${anuncio.descricao}</div>
                    <div class="ad-location">
                        <span>BAIRRO(S): ${anuncio.bairro_nome || 'N/A'}</span>
                        <span>PUBLICADO POR: ${anuncio.autor_nome || 'N/A'}</span>
                    </div>
                    <div class="ad-actions">
                        <button class="btn-delete-ad" data-id="${anuncio.id}">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
            listaAnunciosDiv.innerHTML += anuncioHTML;
        });
    }

   listaAnunciosDiv.addEventListener('click', async (event) => {
        const deleteButton = event.target.closest('.btn-delete-ad');
        if (deleteButton) {
            const anuncioId = deleteButton.dataset.id;
            await excluirAnuncio(anuncioId); 
        }
    });

    async function excluirAnuncio(id) {
        const modal = document.getElementById('confirm-modal');
        const confirmBtn = document.getElementById('modal-btn-confirm');
        const cancelBtn = document.getElementById('modal-btn-cancel');

        modal.classList.add('show');

        const userConfirmed = await new Promise(resolve => {
            confirmBtn.onclick = () => {
                modal.classList.remove('show');
                resolve(true); // Usuário clicou em "Excluir"
            };
            cancelBtn.onclick = () => {
                modal.classList.remove('show');
                resolve(false); // Usuário clicou em "Cancelar"
            };
        });
        
        if (!userConfirmed) {
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`/api/anuncios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json().catch(() => ({}));
            showFeedbackModal(result.message || 'Operação concluída.'); 

            if (response.ok) {
                buscarAnuncios();
            }
        } catch (error) {
            showFeedbackModal('Erro de conexão ao tentar excluir.');
        }
    }

    buscarAnuncios();

    listaAnunciosDiv.addEventListener('click', (event) => {
        if (event.target.closest('.btn-delete-ad')) {
            return; 
        }

        const adCard = event.target.closest('.ad-card');
        if (adCard) {
            const anuncioId = adCard.dataset.adId;
            if (anuncioId) {
                window.location.href = `/anuncios/detalhe-anuncio.html?id=${anuncioId}`;
            }
        }
    });
});