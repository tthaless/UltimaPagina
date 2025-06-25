document.addEventListener('DOMContentLoaded', () => {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (!navbarPlaceholder) return;

  const token = localStorage.getItem('authToken');
  const userJSON = localStorage.getItem('user');
  const user = userJSON ? JSON.parse(userJSON) : null;

  let navHTML = '<nav class="navbar">';

  if (token && user) {
    // --- LÓGICA CORRETA DE LINKS ---
    let links = '<a href="home.html">Home</a>'; 

    if (user.tipo_usuario === 'admin') {
      links += '<a href="gerenciar-categorias.html">Gerenciar Categorias</a>';
    } else { // Se não é admin, é cliente
      links += '<a href="meus-anuncios.html">Meus Anúncios</a>';
    }
    // --- FIM DA LÓGICA ---

    navHTML += `
      <div class="nav-left">
        ${links}
      </div>
      <div class="nav-right">
        <span>Olá, ${user.nome}</span>
        <button id="logoutBtn">Sair</button>
      </div>
    `;
  } else {
    navHTML += `<div class="nav-left"><span>Última Página</span></div>`;
  }

  navHTML += '</nav>';
  navbarPlaceholder.innerHTML = navHTML;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    };
  }
});