document.addEventListener('DOMContentLoaded', () => {
    const listaMeusAnunciosDiv = document.getElementById('lista-meus-anuncios');
    const token = localStorage.getItem('authToken');
    const backButton = document.getElementById('backToHomeBtn');
    if (backButton) {
        backButton.onclick = () => {
            // Se esta for uma página de admin, use '/home-admin.html'
            // Se for uma página de cliente, use '/home.html'
            window.location.href = '/home.html'; 
        };
    }

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
                listaMeusAnunciosDiv.innerHTML = '<p>erro ao buscar seus anúncios</p>';
                return;
            }

            const anuncios = await response.json();
            renderizarMeusAnuncios(anuncios);

        } catch (error) {
            listaMeusAnunciosDiv.innerHTML = '<p>erro de conexão com o servidor</p>';
        }
    }

    function renderizarMeusAnuncios(anuncios) {
        listaMeusAnunciosDiv.innerHTML = '';

        if (anuncios.length === 0) {
            listaMeusAnunciosDiv.innerHTML = '<p>você ainda não publicou nenhum anúncio</p>';
            return;
        }

        anuncios.forEach(anuncio => {
            // Este é o novo "molde" do card de gerenciamento
            const cardHTML = `
                <div class="management-card">
                    <div class="ad-info">
                        <h3>${anuncio.titulo}</h3>
                        <p>${anuncio.categoria_nome} | ${anuncio.bairro_nome}</p>
                    </div>
                    <div class="ad-actions">
                        <button class="btn-edit" data-id="${anuncio.id}">Editar</button>
                        <button class="btn-delete" data-id="${anuncio.id}">Excluir</button>
                    </div>
                </div>
            `;
            listaMeusAnunciosDiv.innerHTML += cardHTML;
        });
    }

    // Gerenciador de cliques para os botões de Editar e Excluir
    listaMeusAnunciosDiv.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('btn-edit')) {
            const id = target.dataset.id;
            window.location.href = `editar-anuncio.html?id=${id}`;
        }

        if (target.classList.contains('btn-delete')) {
            const id = target.dataset.id;
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
                buscarMeusAnuncios(); // Atualiza a lista na tela
            }
        } catch (error) {
            alert('Erro de conexão ao tentar excluir.');
        }
    }

    buscarMeusAnuncios();
});