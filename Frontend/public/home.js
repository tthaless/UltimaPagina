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
        listaAnunciosDiv.innerHTML = ''; 

        if (anuncios.length === 0) {
            listaAnunciosDiv.textContent = 'Nenhum anúncio publicado ainda.';
            return;
        }

        anuncios.forEach(anuncio => {
            const anuncioHTML = `
                <div class="ad-card">
                    <div class="ad-category">${anuncio.categoria_nome || 'SEM CATEGORIA'}</div>
                    <div class="ad-title">${anuncio.titulo}</div>
                    <div class="ad-description">${anuncio.descricao}</div>
                    <div class="ad-location">
                        <span>BAIRRO: ${anuncio.bairro_nome || 'N/A'}</span>
                        <span>PUBLICADO POR: ${anuncio.autor_nome || 'N/A'}</span>
                    </div>
                    <div class="ad-favorite">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                </div>
            `;
            listaAnunciosDiv.innerHTML += anuncioHTML;
        });
    }

    buscarAnuncios();
});