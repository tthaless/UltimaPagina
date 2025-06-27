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
            // Aplica classes de erro para o feedback de carregamento de dados
            feedbackAnuncio.className = 'feedback-message error'; // LINHA ALTERADA/ADICIONADA
            feedbackAnuncio.textContent = 'Erro ao carregar dados para o formulário.';
            setTimeout(() => feedbackAnuncio.classList.add('show'), 10); // LINHA ADICIONADA
        }
    }

    // Envio do formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dadosAnuncio = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            descricao_completa: document.getElementById('descricaoCompleta').value, // JÁ TEM DESCRIÇÃO COMPLETA
            contato_telefone: document.getElementById('telefone').value, // JÁ TEM TELEFONE
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
            feedbackAnuncio.className = 'feedback-message'; // LINHA ALTERADA/ADICIONADA
            feedbackAnuncio.textContent = result.message; // Define o texto da mensagem

            if (response.ok) {
                feedbackAnuncio.classList.add('success'); // LINHA ALTERADA/ADICIONADA
                setTimeout(() => feedbackAnuncio.classList.add('show'), 10); // LINHA ADICIONADA
                setTimeout(() => {
                    window.location.href = '/anuncios/meus-anuncios.html';
                }, 2000);
            } else {
                feedbackAnuncio.classList.add('error'); // LINHA ADICIONADA
                setTimeout(() => feedbackAnuncio.classList.add('show'), 10); // LINHA ADICIONADA
            }
        } catch (error) {
            // ERRO DE CONEXÃO: Aplica as classes CSS
            feedbackAnuncio.className = 'feedback-message error'; // LINHA ALTERADA/ADICIONADA
            feedbackAnuncio.textContent = 'Erro de conexão ao criar anúncio.';
            setTimeout(() => feedbackAnuncio.classList.add('show'), 10); // LINHA ADICIONADA
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
    // Esta linha não foi modificada, pois o elemento 'current-date' não existe neste HTML
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
});