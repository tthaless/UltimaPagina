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
      // Definimos o tipo de usuário como 'cliente' por padrão para este formulário
      tipo_usuario: 'cliente' 
    };

    try {
      // Envia os dados para o nosso backend usando a API Fetch
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosDoFormulario)
      });

      const result = await response.json();

      if (response.ok) {
        // Se o cadastro foi bem-sucedido
        feedbackMessage.textContent = result.message;
        feedbackMessage.style.color = 'green';
        form.reset(); // Limpa o formulário
      } else {
        // Se houve um erro no cadastro
        feedbackMessage.textContent = 'Erro: ' + (result.message || 'Não foi possível cadastrar.');
        feedbackMessage.style.color = 'red';
      }
    } catch (error) {
      // Se houve um erro de rede ou de conexão
      feedbackMessage.textContent = 'Erro de conexão com o servidor.';
      feedbackMessage.style.color = 'red';
      console.error('Erro no fetch:', error);
    }
  });
});