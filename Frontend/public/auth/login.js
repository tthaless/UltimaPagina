document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const feedbackMessage = document.getElementById('feedbackMessage');

  form.addEventListener('submit', async (event) => {
    // Impede o formulário de recarregar a página
    event.preventDefault();

    // Pega os dados dos campos do formulário
    const dadosDoFormulario = {
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value
    };

    try {
      // Envia os dados para o nosso endpoint de login no backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosDoFormulario)
      });

      const result = await response.json();

      if (response.ok) {
        
          // 1. Guarda o token
          localStorage.setItem('authToken', result.token);

          // 2. Guarda os dados do usuário para usarmos em outras páginas
          localStorage.setItem('user', JSON.stringify(result.usuario));

           // Redireciona os usuários para a home.html
           window.location.href = '/home.html';
          }
         else {
        // Se houve um erro no login 
        feedbackMessage.textContent = 'Erro: ' + (result.message || 'Não foi possível fazer login.');
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