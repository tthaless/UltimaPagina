document.addEventListener('DOMContentLoaded', () => {
    const listaAnunciosDiv = document.getElementById('lista-anuncios');
    const token = localStorage.getItem('authToken');

    // Elementos do Modal de Filtro
    const filterModal = document.getElementById('filter-modal');
    const filterButton = document.querySelector('.toolbar-left a'); // O link "filtrar"
    const closeFilterModalBtn = document.getElementById('close-filter-modal');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const filterCategoriesList = document.getElementById('filter-categories-list');
    const filterBairrosList = document.getElementById('filter-bairros-list');

    // Variáveis para armazenar as opções de filtro e os filtros selecionados
    let allCategories = [];
    let allBairros = [];
    let selectedCategoryId = null;
    let selectedBairroId = null;

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

    // Variável para armazenar os IDs dos anúncios favoritados pelo usuário
    let userFavoriteAdIds = [];

    async function fetchUserFavorites() {
        try {
            const response = await fetch('/api/favoritos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                console.error('Erro ao buscar favoritos do usuário:', response.statusText);
                return [];
            }
            const favorites = await response.json();
            return favorites.map(fav => fav.id);
        } catch (error) {
            console.error('Erro de conexão ao buscar favoritos:', error);
            return [];
        }
    }

    // Função principal para buscar e renderizar anúncios (agora com filtros)
    async function buscarAnuncios(categoryId = null, bairroId = null) {
        try {

            selectedCategoryId = categoryId; // Armazena o filtro selecionado
            selectedBairroId = bairroId;     // Armazena o filtro selecionado

            let apiUrl = '/api/anuncios';
            const queryParams = new URLSearchParams();

            if (categoryId) {
                queryParams.append('categoria_id', categoryId);
            }
            if (bairroId) {
                queryParams.append('bairro_id', bairroId);
            }

            if (queryParams.toString()) {
                apiUrl += `?${queryParams.toString()}`;
            }

            // 1. Busca todos os anúncios com ou sem filtros
            const anunciosResponse = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!anunciosResponse.ok) {
                listaAnunciosDiv.innerHTML = '<p>Erro ao buscar anúncios. Tente fazer o login novamente.</p>';
                return;
            }
            const anuncios = await anunciosResponse.json();

            // 2. Busca os favoritos do usuário (sempre para poder exibir o coração correto)
            userFavoriteAdIds = await fetchUserFavorites();

            // 3. Renderiza os anúncios, agora com a informação de favoritos
            renderizarAnuncios(anuncios);

        } catch (error) {
            listaAnunciosDiv.innerHTML = '<p>Erro de conexão com o servidor.</p>';
            console.error('Erro geral em buscarAnuncios:', error);
        }
    }

    function renderizarAnuncios(anuncios) {
        listaAnunciosDiv.innerHTML = ''; 

        if (anuncios.length === 0) {
            listaAnunciosDiv.innerHTML = '<p class="empty-list-message">Nenhum anúncio publicado ainda.</p>';
            return;
        }

        anuncios.forEach(anuncio => {
            const isFavorited = userFavoriteAdIds.includes(anuncio.id);
            const heartClass = isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
            const favoritedContainerClass = isFavorited ? 'ad-favorite favorited' : 'ad-favorite';

            const anuncioHTML = `
                <div class="ad-card" data-ad-id="${anuncio.id}">
                    <div class="ad-category">${anuncio.categoria_nome || 'SEM CATEGORIA'}</div>
                    <div class="ad-title">${anuncio.titulo}</div>
                    <div class="ad-description">${anuncio.descricao}</div>
                    <div class="ad-location">
                        <span>BAIRRO: ${anuncio.bairro_nome || 'N/A'}</span>
                        <span>PUBLICADO POR: ${anuncio.autor_nome || 'N/A'}</span>
                    </div>
                    <div class="${favoritedContainerClass}" data-ad-id="${anuncio.id}">
                        <i class="${heartClass}"></i>
                    </div>
                </div>
            `;
            listaAnunciosDiv.innerHTML += anuncioHTML;
        });
    }

    // Lógica para lidar com cliques no coração de favoritos
    listaAnunciosDiv.addEventListener('click', async (event) => {
        const favoriteContainer = event.target.closest('.ad-favorite');
        if (favoriteContainer) {
            const anuncioId = favoriteContainer.dataset.adId;
            if (!anuncioId) {
                console.error('ID do anúncio não encontrado no elemento favorito.');
                showFeedbackModal('Erro!', 'ID do anúncio não encontrado.', 'error');
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
                    // Atualiza a UI imediatamente após a resposta da API
                    const heartIcon = favoriteContainer.querySelector('i');
                    if (result.favorited) {
                        heartIcon.classList.remove('fa-regular');
                        heartIcon.classList.add('fa-solid');
                        favoriteContainer.classList.add('favorited');
                        // Adiciona o ID à lista de favoritos locais
                        userFavoriteAdIds.push(parseInt(anuncioId));
                    } else {
                        heartIcon.classList.remove('fa-solid');
                        heartIcon.classList.add('fa-regular');
                        favoriteContainer.classList.remove('favorited');
                        // Remove o ID da lista de favoritos locais
                        userFavoriteAdIds = userFavoriteAdIds.filter(id => id !== parseInt(anuncioId));
                    }
                } else {
                    showFeedbackModal('Ops!', result.message || 'Erro ao atualizar favorito.', 'error');
                }
            } catch (error) {
                console.error('Erro de conexão ao alternar favorito:', error);
                showFeedbackModal('Erro!', 'Erro de conexão ao servidor ao tentar favoritar/desfavoritar.', 'error');
            }
        }
    });

    // ===================================================
    // LÓGICA DO MODAL DE FILTRO
    // ===================================================

    // Função para popular as opções de categoria e bairro no modal
    async function popularFiltros() {
        try {
            const [resCategorias, resBairros] = await Promise.all([
                fetch('/api/admin/categorias/public', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/bairros', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const categorias = await resCategorias.json();
            const bairros = await resBairros.json();

            allCategories = categorias; // Armazena para uso posterior
            allBairros = bairros;       // Armazena para uso posterior

            // Popular Categorias
            filterCategoriesList.innerHTML = `
                <label class="filter-option-item">
                    <input type="radio" name="category-filter" value="" ${selectedCategoryId === null ? 'checked' : ''}>
                    <span class="custom-radio"></span> Todas
                </label>
            `;
            categorias.forEach(cat => {
                filterCategoriesList.innerHTML += `
                    <label class="filter-option-item">
                        <input type="radio" name="category-filter" value="${cat.id}" ${selectedCategoryId == cat.id ? 'checked' : ''}>
                        <span class="custom-radio"></span> ${cat.nome}
                    </label>
                `;
            });

            // Popular Bairros
            filterBairrosList.innerHTML = `
                <label class="filter-option-item">
                    <input type="radio" name="bairro-filter" value="" ${selectedBairroId === null ? 'checked' : ''}>
                    <span class="custom-radio"></span> Todos
                </label>
            `;
            bairros.forEach(bairro => {
                filterBairrosList.innerHTML += `
                    <label class="filter-option-item">
                        <input type="radio" name="bairro-filter" value="${bairro.id}" ${selectedBairroId == bairro.id ? 'checked' : ''}>
                        <span class="custom-radio"></span> ${bairro.nome}
                    </label>
                `;
            });

        } catch (error) {
            console.error('Erro ao popular filtros:', error);
            showFeedbackModal('Erro!', 'Não foi possível carregar as opções de filtro.', 'error');
        }
    }

    // Event Listeners para o Modal de Filtro
    filterButton.addEventListener('click', (event) => {
        event.preventDefault(); // Impede o link de navegar
        filterModal.classList.add('show');
        popularFiltros(); // Popula os filtros sempre que o modal é aberto
    });

    closeFilterModalBtn.addEventListener('click', () => {
        filterModal.classList.remove('show');
    });

    applyFiltersBtn.addEventListener('click', () => {
        const selectedCategoryRadio = document.querySelector('input[name="category-filter"]:checked');
        const selectedBairroRadio = document.querySelector('input[name="bairro-filter"]:checked');

        const newCategoryId = selectedCategoryRadio ? (selectedCategoryRadio.value || null) : null;
        const newBairroId = selectedBairroRadio ? (selectedBairroRadio.value || null) : null;
        
        // Garante que o ID é number se não for null
        const finalCategoryId = newCategoryId ? parseInt(newCategoryId) : null;
        const finalBairroId = newBairroId ? parseInt(newBairroId) : null;

        buscarAnuncios(finalCategoryId, finalBairroId);
        filterModal.classList.remove('show');
    });

    clearFiltersBtn.addEventListener('click', () => {
        // Desmarca todos os radio buttons e seleciona as opções "Todas" / "Todos"
        document.querySelectorAll('input[name="category-filter"]').forEach(radio => radio.checked = false);
        document.querySelector('input[name="category-filter"][value=""]').checked = true;

        document.querySelectorAll('input[name="bairro-filter"]').forEach(radio => radio.checked = false);
        document.querySelector('input[name="bairro-filter"][value=""]').checked = true;

        buscarAnuncios(null, null); // Busca todos os anúncios sem filtros
        filterModal.classList.remove('show');
    });


    // Inicializa a página
    buscarAnuncios();

    // NOVO: Lógica para redirecionar para a página de detalhes ao clicar no card do anúncio
    listaAnunciosDiv.addEventListener('click', (event) => {
        // Evita que o clique no coração de favorito também redirecione
        if (event.target.closest('.ad-favorite')) {
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