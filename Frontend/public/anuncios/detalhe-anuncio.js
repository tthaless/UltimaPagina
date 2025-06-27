document.addEventListener('DOMContentLoaded', () => {
    const adDetailsContainer = document.getElementById('ad-details-container');
    const backButton = document.getElementById('backToHomeBtn');
    const token = localStorage.getItem('authToken');

    if (typeof showFeedbackModal !== 'function') {
        window.showFeedbackModal = function(title, message, type = 'success') {
            alert(`${title}: ${message}`);
        };
    }

    if (!token) {
        window.location.href = '/auth/login.html';
        return;
    }

    if (backButton) {
        backButton.onclick = () => {
            window.location.href = '/home.html';
        };
    }

    async function buscarDetalhesAnuncio() {
        // Pega o ID do anúncio da URL
        const params = new URLSearchParams(window.location.search);
        const anuncioId = params.get('id');

        if (!anuncioId) {
            adDetailsContainer.innerHTML = '<p style="color:red; text-align: center;">ID do anúncio não fornecido.</p>';
            showFeedbackModal('Erro!', 'ID do anúncio não fornecido na URL.', 'error');
            return;
        }

        try {
            // Usa a nova rota pública para buscar os detalhes do anúncio
            const response = await fetch(`/api/anuncios/public/${anuncioId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || 'Erro ao carregar detalhes do anúncio.';
                adDetailsContainer.innerHTML = `<p style="color:red; text-align: center;">${errorMessage}</p>`;
                showFeedbackModal('Erro!', errorMessage, 'error');
                return;
            }

            const anuncio = await response.json();
            renderizarDetalhesAnuncio(anuncio);

        } catch (error) {
            console.error('Erro de conexão ao buscar detalhes do anúncio:', error);
            adDetailsContainer.innerHTML = '<p style="color:red; text-align: center;">Erro de conexão com o servidor.</p>';
            showFeedbackModal('Erro!', 'Erro de conexão com o servidor ao buscar detalhes.', 'error');
        }
    }

    function renderizarDetalhesAnuncio(anuncio) {
        adDetailsContainer.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label>título</label>
                    <p class="display-text">${anuncio.titulo}</p>
                </div>
                <div class="form-group">
                    <label>categoria</label>
                    <p class="display-text">${anuncio.categoria_nome || 'N/A'}</p>
                </div>
                <div class="form-group">
                    <label>telefone</label>
                    <p class="display-text">${anuncio.contato_telefone || 'N/A'}</p>
                </div>
                <div class="form-group">
                    <label>bairro de atuação</label>
                    <p class="display-text">${anuncio.bairro_nome || 'N/A'}</p>
                </div>
                <div class="form-group">
                    <label>descrição do anúncio</label>
                    <p class="display-text">${anuncio.descricao}</p>
                </div>
                <div class="form-group">
                    <label>descrição completa</label>
                    <p class="display-text">${anuncio.descricao_completa || 'Não fornecida'}</p>
                </div>
                 <div class="form-group">
                    <label>publicado por</label>
                    <p class="display-text">${anuncio.autor_nome || 'N/A'}</p>
                </div>
                <div class="form-group">
                    <label>data de publicação</label>
                    <p class="display-text">${new Date(anuncio.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>
            </div>
        `;
    }

    buscarDetalhesAnuncio();
});