document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) { window.location.href = '/auth/login.html'; return; }

    const form = document.getElementById('formCriarAnuncio');
    const feedbackAnuncio = document.getElementById('feedbackAnuncio');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Popula os menus de Categoria e Bairro
    async function popularDropdowns() {
        try {
            const [resCategorias, resBairros] = await Promise.all([
                fetch('/api/admin/categorias/public', { headers }),
                fetch('/api/bairros', { headers })
            ]);

            // Popula Categorias
            if (resCategorias.ok) {
                const categorias = await resCategorias.json();
                const selectCategoria = document.getElementById('categoria');
                selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
                categorias.forEach(cat => {
                    selectCategoria.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
                });
            }

            // Popula o novo seletor de Bairros
            if (resBairros.ok) {
                const bairros = await resBairros.json();
                const selectBairro = document.getElementById('bairro');
                selectBairro.innerHTML = '<option value="">Selecione um bairro</option>';
                bairros.forEach(bairro => {
                    selectBairro.innerHTML += `<option value="${bairro.id}">${bairro.nome}</option>`;
                });
            }
        } catch (error) {
            feedbackAnuncio.textContent = 'Erro ao carregar dados para o formulário.';
        }
    }

    // Envio do formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dadosAnuncio = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            descricao_completa: document.getElementById('descricaoCompleta').value,
            contato_telefone: document.getElementById('telefone').value,
            categoria_id: document.getElementById('categoria').value,
            bairro_id: document.getElementById('bairro').value // Pega o valor do select simples
        };

        if (!dadosAnuncio.titulo || !dadosAnuncio.categoria_id || !dadosAnuncio.bairro_id) {
            feedbackAnuncio.textContent = 'Título, Categoria e Bairro são obrigatórios.';
            feedbackAnuncio.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/anuncios', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dadosAnuncio)
            });
            const result = await response.json();
            feedbackAnuncio.textContent = result.message;
            feedbackAnuncio.style.color = response.ok ? 'green' : 'red';
            if (response.ok) {
                setTimeout(() => {
                    window.location.href = '/anuncios/meus-anuncios.html';
                }, 2000);
            }
        } catch (error) {
            feedbackAnuncio.textContent = 'Erro de conexão ao criar anúncio.';
        }
    });

    const cancelButton = document.querySelector('.btn-cancelar');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            // Apenas redireciona o usuário para a página anterior
            window.location.href = '/anuncios/meus-anuncios.html';
        });
    }
    
    // Contadores de caracteres
    function setupCounter(inputId) {
        const input = document.getElementById(inputId);
        const counter = input.nextElementSibling;
        const maxLength = input.getAttribute('maxlength');
        if (counter && counter.classList.contains('char-counter')) {
            counter.textContent = `MAX. ${maxLength} CARACTERES`;
            input.addEventListener('input', () => {
                counter.textContent = `${input.value.length} / ${maxLength} CARACTERES`;
            });
        }
    }
    setupCounter('titulo');
    setupCounter('descricao');
    setupCounter('descricaoCompleta');

    // Inicializa a página
    popularDropdowns();
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
});