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

            // Popula Bairros
            if (resBairros.ok) {
                const bairros = await resBairros.json();
                const selectBairro = document.getElementById('bairro');
                selectBairro.innerHTML = '<option value="">Selecione um bairro</option>';
                bairros.forEach(bairro => {
                    selectBairro.innerHTML += `<option value="${bairro.id}">${bairro.nome}</option>`;
                });
            }
        } catch (error) {
            feedbackAnuncio.className = 'feedback-message error';
            feedbackAnuncio.textContent = 'Erro ao carregar dados para o formulário.';
            setTimeout(() => feedbackAnuncio.classList.add('show'), 10);
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
            bairro_id: document.getElementById('bairro').value 
        };

        if (!dadosAnuncio.titulo || !dadosAnuncio.categoria_id || !dadosAnuncio.bairro_id) {
            feedbackAnuncio.textContent = 'Título, Categoria e Bairro são obrigatórios.';
            feedbackAnuncio.className = 'feedback-message error show';
            return;
        }

        try {
            const response = await fetch('/api/anuncios', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dadosAnuncio)
            });
            const result = await response.json();
            
            // Limpa classes anteriores e adiciona a base 'feedback-message'
            feedbackAnuncio.className = 'feedback-message';
            feedbackAnuncio.textContent = result.message;

            if (response.ok) {
                feedbackAnuncio.classList.add('success');
                setTimeout(() => feedbackAnuncio.classList.add('show'), 10);
                setTimeout(() => {
                    window.location.href = '/anuncios/meus-anuncios.html';
                }, 2000);
            } else {
                feedbackAnuncio.classList.add('error');
                setTimeout(() => feedbackAnuncio.classList.add('show'), 10);
            }
        } catch (error) {
            feedbackAnuncio.className = 'feedback-message error';
            feedbackAnuncio.textContent = 'Erro de conexão ao criar anúncio.';
            setTimeout(() => feedbackAnuncio.classList.add('show'), 10);
        }
    });

    const cancelButton = document.querySelector('.btn-cancelar');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
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


    popularDropdowns();
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
});