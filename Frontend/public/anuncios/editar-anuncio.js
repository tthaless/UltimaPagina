document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) { window.location.href = '/auth/login.html'; return; }

    const form = document.getElementById('formEditarAnuncio');
    const feedbackAnuncio = document.getElementById('feedbackAnuncio');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Pega o ID do anúncio da URL
    const params = new URLSearchParams(window.location.search);
    const anuncioId = params.get('id');

    if (!anuncioId) {
        form.innerHTML = '<p style="color:red;">ID do anúncio não fornecido.</p>';
        return;
    }

    const backButton = document.getElementById('backToMyAdsBtn');
    if (backButton) {
        backButton.onclick = () => { window.location.href = '/anuncios/meus-anuncios.html'; };
    }

    // Função para carregar todos os dados necessários para o formulário
    async function carregarDadosParaEdicao() {
        try {
            const [resAnuncio, resCategorias, resBairros] = await Promise.all([
                fetch(`/api/anuncios/${anuncioId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/categorias/public', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/bairros', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!resAnuncio.ok) throw new Error('Anúncio não encontrado ou sem permissão para editar.');

            const anuncio = await resAnuncio.json();
            const categorias = await resCategorias.json();
            const bairros = await resBairros.json();

            document.getElementById('titulo').value = anuncio.titulo;
            document.getElementById('telefone').value = anuncio.contato_telefone || '';
            document.getElementById('descricao').value = anuncio.descricao;
            document.getElementById('descricaoCompleta').value = anuncio.descricao_completa || '';

            const selectCategoria = document.getElementById('categoria');
            selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
            categorias.forEach(cat => {
                const selected = cat.id === anuncio.categoria_id ? 'selected' : '';
                selectCategoria.innerHTML += `<option value="${cat.id}" ${selected}>${cat.nome}</option>`;
            });

            const selectBairro = document.getElementById('bairro');
            selectBairro.innerHTML = '<option value="">Selecione um bairro</option>';
            bairros.forEach(bairro => {
                const selected = bairro.id === anuncio.bairro_id ? 'selected' : '';
                selectBairro.innerHTML += `<option value="${bairro.id}" ${selected}>${bairro.nome}</option>`;
            });
            
            document.getElementById('titulo').dispatchEvent(new Event('input'));
            document.getElementById('descricao').dispatchEvent(new Event('input'));
            document.getElementById('descricaoCompleta').dispatchEvent(new Event('input'));

        } catch (error) {
            form.innerHTML = `<p style="color:red;">Erro ao carregar dados para edição: ${error.message}</p>`;
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dadosAtualizados = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            descricao_completa: document.getElementById('descricaoCompleta').value,
            contato_telefone: document.getElementById('telefone').value,
            categoria_id: document.getElementById('categoria').value,
            bairro_id: document.getElementById('bairro').value
        };

        try {
            const response = await fetch(`/api/anuncios/${anuncioId}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(dadosAtualizados)
            });

            const result = await response.json();
            
            feedbackAnuncio.className = 'feedback-message'; 
            feedbackAnuncio.textContent = result.message;

            if(response.ok) {
                feedbackAnuncio.classList.add('success');
                setTimeout(() => feedbackAnuncio.classList.add('show'), 10); 
                setTimeout(() => { window.location.href = '/anuncios/meus-anuncios.html'; }, 2000);
            } else {
                feedbackAnuncio.classList.add('error');
                setTimeout(() => feedbackAnuncio.classList.add('show'), 10); 
            }
        } catch (error) {
            feedbackAnuncio.className = 'feedback-message error';
            feedbackAnuncio.textContent = 'Erro de conexão ao salvar alterações.';
            setTimeout(() => feedbackAnuncio.classList.add('show'), 10);
        }
    });

    const cancelButton = document.querySelector('.btn-cancelar');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {

            window.location.href = '/anuncios/meus-anuncios.html';
        });
    }
    
    // Contadores de Caracteres
    function setupCounter(inputId) {
        const input = document.getElementById(inputId);
        const counter = input.nextElementSibling;
        const maxLength = input.getAttribute('maxlength');
        if (counter && counter.classList.contains('char-counter')) {
            const update = () => counter.textContent = `${input.value.length} / ${maxLength} CARACTERES`;
            input.addEventListener('input', update);
            update();
        }
    }
    setupCounter('titulo');
    setupCounter('descricao');
    setupCounter('descricaoCompleta');

    carregarDadosParaEdicao();
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
});