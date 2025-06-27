document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica para o botão de Logout ---
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            console.log("Botão Sair clicado. Fazendo logout...");
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/auth/login.html'; 
        };
    }

    // --- Lógica para atualizar o nome do usuário no cabeçalho ---
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
        const user = JSON.parse(userJSON);
        const usernameLink = document.getElementById('username-link');
        if (usernameLink) {
            const spanElement = usernameLink.querySelector('span');
            if(spanElement) {
                spanElement.textContent = user.nome;
            }
        }
    }
});


// --- FUNÇÃO PARA MOSTRAR POP-UPS ---

function showFeedbackModal(message) {
    const modal = document.getElementById('feedback-modal');
    const modalMessage = document.getElementById('feedback-modal-message');
    const okBtn = document.getElementById('feedback-modal-ok-btn');

    if (!modal || !modalMessage || !okBtn) {
        alert(message);
        return;
    }

    modalMessage.textContent = message;
    modal.classList.add('show');

    okBtn.onclick = () => {
        modal.classList.remove('show');
    };
}