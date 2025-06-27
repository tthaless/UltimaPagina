document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) { window.location.href = '/auth/login.html'; return; }

    const form = document.getElementById('formEditarAnuncio');
    const feedbackAnuncio = document.getElementById('feedbackAnuncio');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Pega o ID do anúncio da URL (ex: editar-anuncio.html?id=123)
    const params = new URLSearchParams(window.location.search);
    const anuncioId = params.get('id');

    if (!anuncioId) {
        form.innerHTML = '<p style="color:red;">ID do anúncio não fornecido.</p>';
        return;
    }

    // Lógica para o botão "voltar"
    const backButton = document.getElementById('backToMyAdsBtn');
    if (backButton) {
        backButton.onclick = () => { window.location.href = '/anuncios/meus-anuncios.html'; };
    }

    // Função para carregar todos os dados necessários para o formulário
    async function carregarDadosParaEdicao() {
        try {
            // Busca os dados DO ANÚNCIO, de TODAS AS CATEGORIAS e de TODOS OS BAIRROS ao mesmo tempo
            const [resAnuncio, resCategorias, resBairros] = await Promise.all([
                fetch(`/api/anuncios/${anuncioId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/categorias/public', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/bairros', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!resAnuncio.ok) throw new Error('Anúncio não encontrado ou sem permissão para editar.');

            const anuncio = await resAnuncio.json();
            const categorias = await resCategorias.json();
            const bairros = await resBairros.json();

            // --- Preenche os campos do formulário com os dados do anúncio ---
            document.getElementById('titulo').value = anuncio.titulo;
            document.getElementById('telefone').value = anuncio.contato_telefone || '';
            document.getElementById('descricao').value = anuncio.descricao;
            document.getElementById('descricaoCompleta').value = anuncio.descricao_completa || '';

            // Popula e seleciona a categoria correta
            const selectCategoria = document.getElementById('categoria');
            selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
            categorias.forEach(cat => {
                const selected = cat.id === anuncio.categoria_id ? 'selected' : '';
                selectCategoria.innerHTML += `<option value="${cat.id}" ${selected}>${cat.nome}</option>`;
            });

            // Popula e seleciona o bairro correto
            const selectBairro = document.getElementById('bairro');
            selectBairro.innerHTML = '<option value="">Selecione um bairro</option>';
            bairros.forEach(bairro => {
                const selected = bairro.id === anuncio.bairro_id ? 'selected' : '';
                selectBairro.innerHTML += `<option value="${bairro.id}" ${selected}>${bairro.nome}</option>`;
            });
            
            // Dispara manualmente o evento de input para os contadores de caracteres atualizarem
            document.getElementById('titulo').dispatchEvent(new Event('input'));
            document.getElementById('descricao').dispatchEvent(new Event('input'));
            document.getElementById('descricaoCompleta').dispatchEvent(new Event('input'));

        } catch (error) {
            form.innerHTML = `<p style="color:red;">Erro ao carregar dados para edição: ${error.message}</p>`;
        }
    }

    // Lógica para ENVIAR o formulário com as atualizações
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
            feedbackAnuncio.textContent = result.message;
            feedbackAnuncio.style.color = response.ok ? 'green' : 'red';

            if(response.ok) {
                // Volta para a lista após 2 segundos
                setTimeout(() => { window.location.href = '/anuncios/meus-anuncios.html'; }, 2000);
            }
        } catch (error) {
            feedbackAnuncio.textContent = 'Erro de conexão ao salvar alterações.';
        }
    });

    const cancelButton = document.querySelector('.btn-cancelar');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            // Apenas redireciona o usuário para a página anterior
            window.location.href = '/anuncios/meus-anuncios.html';
        });
    }
    
    // Contadores de Caracteres (igual ao da página de criar)
    function setupCounter(inputId) {
        const input = document.getElementById(inputId);
        const counter = input.nextElementSibling;
        const maxLength = input.getAttribute('maxlength');
        if (counter && counter.classList.contains('char-counter')) {
            const update = () => counter.textContent = `${input.value.length} / ${maxLength} CARACTERES`;
            input.addEventListener('input', update);
            update(); // Roda uma vez para mostrar o estado inicial
        }
    }
    setupCounter('titulo');
    setupCounter('descricao');
    setupCounter('descricaoCompleta');

    // Inicializa a página
    carregarDadosParaEdicao();
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
});