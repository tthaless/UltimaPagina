document.addEventListener('DOMContentLoaded', () => {
    const listaCategoriasDiv = document.getElementById('lista-categorias');
    const formNovaCategoria = document.getElementById('formNovaCategoria');
    const feedbackNovaCategoria = document.getElementById('feedbackNovaCategoria');
    let categoriasData = []; 

        const backButton = document.getElementById('backToHomeBtn');
    if (backButton) {
        backButton.onclick = () => {
            window.location.href = '/home-admin.html';
        };
    }

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
                categoriasData = categorias;
                renderizarCategorias(categoriasData);
            } else {
                listaCategoriasDiv.innerHTML = '<p style="color: red;">Erro: Você não tem permissão para ver este conteúdo.</p>';
            }
        } catch (error) {
            listaCategoriasDiv.innerHTML = '<p style="color: red;">Erro de conexão com o servidor.</p>';
        }
    }

    // ===================================================
    // FUNÇÃO ATUALIZADA PARA RENDERIZAR OS CARDS
    // ===================================================
    function renderizarCategorias(categorias) {
        listaCategoriasDiv.innerHTML = '';
        if (categorias.length === 0) { 
            listaCategoriasDiv.textContent = 'NENHUMA CATEGORIA CADASTRADA';
            return; 
        }
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

    // Delegação de Eventos para os botões de ação
    listaCategoriasDiv.addEventListener('click', (event) => {
        const target = event.target;
        const editButton = target.closest('.edit-btn');
        if (editButton) {
            event.preventDefault();
            const id = editButton.dataset.id;
            const categoriaParaEditar = categoriasData.find(cat => cat.id == id);
            if (categoriaParaEditar) {
                prepararEdicao(categoriaParaEditar);
            }
        }
        const deleteButton = target.closest('.delete-btn');
        if (deleteButton) {
            event.preventDefault();
            const id = deleteButton.dataset.id;
            excluirCategoria(id);
        }
    });

    // FUNÇÕES DE LÓGICA
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
        const modal = document.getElementById('confirm-modal');
        const confirmBtn = document.getElementById('modal-btn-confirm');
        const cancelBtn = document.getElementById('modal-btn-cancel');

        // Mostra o modal
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
            // Altere a URL conforme necessário (para categorias ou anúncios)
            const response = await fetch(`/api/admin/categorias/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json().catch(() => ({}));
            alert(result.message || 'Operação concluída.'); 

            if (response.ok) {
                buscarCategorias(); // Atualiza a lista na tela
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
        const feedbackMessage = document.getElementById('feedbackNovaCategoria'); // Referência ao elemento
        
        feedbackMessage.textContent = result.message;

        if (response.ok) {
            // Aplica as classes de sucesso para a estilização e animação
            feedbackMessage.className = 'feedback-message success show';
            resetarFormulario();
            buscarCategorias(); 
        } else {
            // Aplica as classes de erro
            feedbackMessage.className = 'feedback-message error show';
        }
    } catch (error) {
        const feedbackMessage = document.getElementById('feedbackNovaCategoria');
        feedbackMessage.textContent = 'Erro de conexão com o servidor.';
        feedbackMessage.className = 'feedback-message error show';
    }
    });

    buscarCategorias();
});