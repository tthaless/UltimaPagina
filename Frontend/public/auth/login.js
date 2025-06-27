document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const feedbackMessage = document.getElementById('feedbackMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dadosDoFormulario = {
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosDoFormulario)
            });

            const result = await response.json();

            if (response.ok) {
                
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.usuario));

                if (result.usuario && result.usuario.tipo_usuario === 'admin') {
                    window.location.href = '/home-admin.html';
                } else {
                    window.location.href = '/home.html';
                }

            } else {
                feedbackMessage.textContent = 'Erro: ' + (result.message || 'não foi possível fazer login.');
                feedbackMessage.style.color = 'red';
            }
        } catch (error) {
            feedbackMessage.textContent = 'Erro de conexão com o servidor.';
            feedbackMessage.style.color = 'red';
            console.error('Erro no fetch:', error);
        }
    });
});