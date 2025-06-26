// O nav.js agora só cuida da funcionalidade de logout.
document.addEventListener('DOMContentLoaded', () => {
    
    // Procura o botão de logout na página
    const logoutBtn = document.getElementById('logoutButton');

    // Se encontrar o botão, adiciona a função de clique
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            console.log("Botão Sair clicado. Fazendo logout...");
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/auth/login.html'; 
        };
    }

    // Você pode adicionar aqui a lógica para atualizar o nome do usuário, se quiser.
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
        const user = JSON.parse(userJSON);
        const usernameLink = document.getElementById('username-link');
        if (usernameLink) {
            // Encontra o <span> dentro do link para mudar só o texto "usuário"
            const spanElement = usernameLink.querySelector('span');
            if(spanElement) {
                spanElement.textContent = user.nome;
            }
        }
    }
});