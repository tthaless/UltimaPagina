document.addEventListener('DOMContentLoaded', () => {
    const listaCategoriasDiv = document.getElementById('lista-categorias');
    const formNovaCategoria = document.getElementById('formNovaCategoria');
    const feedbackNovaCategoria = document.getElementById('feedbackNovaCategoria');
    let categoriasData = []; // Guarda os dados das categorias para fácil acesso

    async function buscarCategorias() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/auth/login.html';
            return;
        }

        try {
            const response = await fetch('/api/admin/categorias', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const categorias = await response.json();
                categoriasData = categorias; // Salva os dados para usarmos depois
                renderizarCategorias(categoriasData);
            } else {
                listaCategoriasDiv.innerHTML = '<p style="color: red;">Erro: Você não tem permissão para ver este conteúdo.</p>';
            }
        } catch (error) {
            listaCategoriasDiv.innerHTML = '<p style="color: red;">Erro de conexão com o servidor.</p>';
        }
    }

    // ===================================================
    // MUDANÇA PRINCIPAL: Como a lista é desenhada
    // ===================================================
    function renderizarCategorias(categorias) {
        listaCategoriasDiv.innerHTML = ''; // Limpa a lista antiga
        if (categorias.length === 0) { 
            listaCategoriasDiv.textContent = 'Nenhuma categoria cadastrada.';
            return; 
        }

        // Cria um card para cada categoria usando o novo molde HTML
        categorias.forEach(categoria => {
            const cardHTML = `
                <div class="category-card">
                    <span class="category-name">${categoria.nome}</span>
                    <div class="category-actions">
                        <a href="#" class="edit-btn" data-id="${categoria.id}"><i class="fa-regular fa-pen-to-square"></i> editar</a>
                        <a href="#" class="delete-btn" data-id="${categoria.id}"><i class="fa-regular fa-trash-can"></i> excluir</a>
                    </div>
                </div>
            `;
            listaCategoriasDiv.innerHTML += cardHTML;
        });
    }

    // ===================================================
    // NOVO: Delegação de Eventos para os botões
    // ===================================================
    listaCategoriasDiv.addEventListener('click', (event) => {
        const target = event.target;
        
        // Verifica se o clique foi em um botão de editar
        const editButton = target.closest('.edit-btn');
        if (editButton) {
            event.preventDefault();
            const id = editButton.dataset.id;
            const categoriaParaEditar = categoriasData.find(cat => cat.id == id);
            if (categoriaParaEditar) {
                prepararEdicao(categoriaParaEditar);
            }
        }

        // Verifica se o clique foi em um botão de excluir
        const deleteButton = target.closest('.delete-btn');
        if (deleteButton) {
            event.preventDefault();
            const id = deleteButton.dataset.id;
            excluirCategoria(id);
        }
    });

    // SUAS FUNÇÕES DE LÓGICA (permanecem as mesmas, pois já são ótimas)
    function prepararEdicao(categoria) {
        document.getElementById('idCategoriaEdicao').value = categoria.id;
        document.getElementById('nomeCategoria').value = categoria.nome;
        document.getElementById('descricaoCategoria').value = categoria.descricao || '';
        document.querySelector('#formNovaCategoria button').textContent = 'Salvar Alterações';
        window.scrollTo(0, 0);
    }

    function resetarFormulario() {
        document.getElementById('idCategoriaEdicao').value = '';
        formNovaCategoria.reset();
        document.querySelector('#formNovaCategoria button').textContent = 'Criar Categoria';
    }

    async function excluirCategoria(id) {
        if (!confirm(`Tem certeza que deseja excluir a categoria com ID ${id}?`)) {
            return;
        }
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`/api/admin/categorias/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json().catch(() => ({}));
            alert(result.message || 'Operação concluída.'); 
            if (response.ok) {
                buscarCategorias();
            }
        } catch (error) {
            alert('Erro de conexão ao tentar excluir.');
        }
    }

    formNovaCategoria.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('idCategoriaEdicao').value;
        const nome = document.getElementById('nomeCategoria').value;
        const descricao = document.getElementById('descricaoCategoria').value;
        const token = localStorage.getItem('authToken');
        const url = id ? `/api/admin/categorias/${id}` : '/api/admin/categorias';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nome, descricao })
            });
            const result = await response.json();
            feedbackNovaCategoria.textContent = result.message;
            if (response.ok) {
                feedbackNovaCategoria.style.color = 'green';
                resetarFormulario();
                buscarCategorias();
            } else {
                feedbackNovaCategoria.style.color = 'red';
            }
        } catch (error) {
            feedbackNovaCategoria.textContent = 'Erro de conexão com o servidor.';
            feedbackNovaCategoria.style.color = 'red';
        }
    });

    // Chama a função inicial para buscar as categorias
    buscarCategorias();
});