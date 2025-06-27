document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');
  const feedbackMessage = document.getElementById('feedbackMessage');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Pega os dados dos campos do formulário
    const dadosDoFormulario = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value,
      tipo_usuario: 'cliente' 
    };

    feedbackMessage.className = 'feedback-message';
    feedbackMessage.textContent = '';

    try {
      // Envia os dados para o backend usando a API Fetch
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosDoFormulario)
      });

      const result = await response.json();

      feedbackMessage.textContent = result.message;

      if (response.ok) {
        feedbackMessage.classList.add('success'); 
        setTimeout(() => feedbackMessage.classList.add('show'), 10); 
        form.reset();

        setTimeout(() => {
          feedbackMessage.classList.remove('show', 'success'); 
          feedbackMessage.textContent = '';
        }, 3000);

      } else {
        feedbackMessage.classList.add('error'); 
        setTimeout(() => feedbackMessage.classList.add('show'), 10);

        setTimeout(() => {
          feedbackMessage.classList.remove('show', 'error');
          feedbackMessage.textContent = '';
        }, 5000);
      }
    } catch (error) {
      feedbackMessage.className = 'feedback-message error'; 
      feedbackMessage.textContent = 'Erro de conexão com o servidor.';
      setTimeout(() => feedbackMessage.classList.add('show'), 10); 
      console.error('Erro no fetch:', error);

      setTimeout(() => {
        feedbackMessage.classList.remove('show', 'error');
        feedbackMessage.textContent = '';
      }, 5000);
    }
  });
});