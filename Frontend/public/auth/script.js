document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');
  const feedbackMessage = document.getElementById('feedbackMessage');

  form.addEventListener('submit', async (event) => {
    // Impede o formulário de recarregar a página
    event.preventDefault();

    // Pega os dados dos campos do formulário
    const dadosDoFormulario = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value,
      tipo_usuario: 'cliente' 
    };

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

      // Limpa classes anteriores e adiciona a base 'feedback-message'
      feedbackMessage.className = 'feedback-message'; // LINHA ALTERADA/ADICIONADA
      feedbackMessage.textContent = result.message; // Define o texto da mensagem

      if (response.ok) {
        feedbackMessage.classList.add('success'); // LINHA ALTERADA/ADICIONADA
        setTimeout(() => feedbackMessage.classList.add('show'), 10); // LINHA ADICIONADA (para animação)
        form.reset(); // Limpa o formulário
      } else {
        feedbackMessage.classList.add('error'); // LINHA ALTERADA/ADICIONADA
        setTimeout(() => feedbackMessage.classList.add('show'), 10); // LINHA ADICIONADA (para animação)
      }
    } catch (error) {
      // Se houve um erro de rede ou de conexão
      feedbackMessage.className = 'feedback-message error'; // LINHA ALTERADA/ADICIONADA
      feedbackMessage.textContent = 'Erro de conexão com o servidor.';
      setTimeout(() => feedbackMessage.classList.add('show'), 10); // LINHA ADICIONADA (para animação)
      console.error('Erro no fetch:', error);
    }
  });
});