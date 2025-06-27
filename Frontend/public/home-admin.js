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
            // MOLDE ATUALIZADO: Troca o coração pela lixeira com um botão
            const anuncioHTML = `
                <div class="ad-card">
                    <div class="ad-category">${anuncio.categoria_nome || 'SEM CATEGORIA'}</div>
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

    // NOVA LÓGICA DE CLIQUE PARA EXCLUIR
   listaAnunciosDiv.addEventListener('click', async (event) => {
        const deleteButton = event.target.closest('.btn-delete-ad');
        if (deleteButton) {
            const anuncioId = deleteButton.dataset.id;
            // CHAMAR DIRETAMENTE A FUNÇÃO QUE JÁ TEM O MODAL CUSTOMIZADO
            await excluirAnuncio(anuncioId); 
        }
    });

    async function excluirAnuncio(id) {
        const modal = document.getElementById('confirm-modal');
        const confirmBtn = document.getElementById('modal-btn-confirm');
        const cancelBtn = document.getElementById('modal-btn-cancel');

        // Mostra o modal de confirmação
        modal.classList.add('show');

        // Cria uma "promessa" que vai esperar a decisão do usuário
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
        
        // Se o usuário não confirmou, a função para aqui
        if (!userConfirmed) {
            return;
        }

        // Se o usuário confirmou, prossegue com a exclusão
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`/api/anuncios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json().catch(() => ({}));
            // AQUI USAMOS showFeedbackModal para exibir o resultado da operação
            showFeedbackModal(result.message || 'Operação concluída.'); 

            if (response.ok) {
                buscarAnuncios(); // Re-renderiza a lista
            }
        } catch (error) {
            // Se houver um erro de conexão, também usamos showFeedbackModal
            showFeedbackModal('Erro de conexão ao tentar excluir.');
        }
    }

    buscarAnuncios();
});