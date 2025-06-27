// O nav.js agora cuida da funcionalidade de logout, nome de usuário e pop-ups de feedback.
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


// ==========================================================
// --- NOVA FUNÇÃO ADICIONADA PARA MOSTRAR POP-UPS ---
// ==========================================================
/**
 * Exibe um pop-up de feedback customizado.
 * @param {string} message - A mensagem a ser exibida.
 */
function showFeedbackModal(message) {
    const modal = document.getElementById('feedback-modal');
    const modalMessage = document.getElementById('feedback-modal-message');
    const okBtn = document.getElementById('feedback-modal-ok-btn');

    // Se o HTML do modal não existir nesta página, a função não faz nada.
    if (!modal || !modalMessage || !okBtn) {
        // Como alternativa ao modal, podemos usar um alert simples.
        alert(message);
        return;
    }

    // Define a mensagem e mostra o pop-up
    modalMessage.textContent = message;
    modal.classList.add('show');

    // Define a ação do botão "OK" para fechar o pop-up
    okBtn.onclick = () => {
        modal.classList.remove('show');
    };
}