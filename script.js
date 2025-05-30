const LOGINS = [
  { username: "admjao", password: "JP123!123" },
  { username: "zanatta", password: "samuca2011" },
  { username: "nome2", password: "mudar123!123" }
];

const SESSION_KEY = "xfut_session";


// Lista de jogos e opções
const jogos = [
  {
    nome: "Final da Champions | PSG VS Inter (31/05)",
    opcoes: [
      { nome: "Opção 1", url: "https://embedflix.top/tv/tnt" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/tnt" }
    ]
  },
  {
    nome: "Jogo do Palmeiras (01/06)",
    opcoes: [
      { nome: "Opção 1", url: "https://site1.com" },
      { nome: "Opção 2", url: "https://site2.com" }
    ]
  },
  {
    nome: "Jogo do Vila Nova VS Novorizontino (30/05)",
    opcoes: [
      { nome: "Opção 1", url: "https://embedflix.top/tv/espn" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/espn" }
    ]
  },
  {
    nome: "Jogo do Brasil(F) Vs Japão(F) (30/05)",
    opcoes: [
      { nome: "Opção 1", url: "https://hlsplus.pro/play/prime.php?id=sportvalt" },
      { nome: "Opção 2", url: "https://hlsplus.pro/play/prime.php?id=globoce" }
    ]
  },
  {
    nome: "Jogo do Vasco da Gama Vs Bragantino (31/05)",
    opcoes: [
      { nome: "Opção 1", url: "https://embedflix.top/tv/prfc-2-hd" },
      { nome: "Opção 2", url: "https://hlsplus.pro/play/prime.php?id=sportv" }
    ]
  },
  {
    nome: "Jogo do Bahia VS São Paulo (31/05)",
    opcoes: [
      { nome: "Opção 1", url: "https://embedflix.top/tv/prfc-2-hd" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/prfc-1-hd" }
    ]
  },
  {
    nome: "Canais Fixos",
    opcoes: [
      { nome: "UFC", url: "https://embedflix.top/tv/ufc-fight-pass-hd" }
    ]
  }
];

// Função para mostrar a tela principal
function showMain() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("main-container").style.display = "block";
  renderJogos();
}

// Função para mostrar tela de login
function showLogin() {
  document.getElementById("main-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
  localStorage.removeItem(SESSION_KEY);
}

// Função de login
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const msg = document.getElementById("login-msg");

  if (localStorage.getItem(SESSION_KEY) === "active") {
    msg.innerText = "Já existe um login ativo neste navegador!";
    return;
  }

  const isValid = LOGINS.some(login => login.username === u && login.password === p);
  if (isValid) {
    localStorage.setItem(SESSION_KEY, "active");
    showMain();
    msg.innerText = "";
  } else {
    msg.innerText = "Usuário ou senha inválidos!";
  }
}

// Função para logout
function logout() {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
}

// Renderizar lista de jogos
function renderJogos() {
  const list = document.getElementById("games-list");
  list.innerHTML = "";
  jogos.forEach(jogo => {
    const block = document.createElement("div");
    block.className = "game-block";
    const title = document.createElement("h3");
    title.innerText = jogo.nome;
    block.appendChild(title);

    const opcoes = document.createElement("div");
    opcoes.className = "opcoes";
    jogo.opcoes.forEach(opcao => {
      const link = document.createElement("a");
      link.href = opcao.url;
      link.innerText = opcao.nome;
      link.className = "opcao-link";
      link.target = "_blank";
      opcoes.appendChild(link);
    });
    block.appendChild(opcoes);

    list.appendChild(block);
  });
}

// Evento único para carregar a página
window.onload = function() {
  if (localStorage.getItem(SESSION_KEY) === "active") {
    showMain();
  } else {
    showLogin();
  }
  // Bloquear segunda aba aberta logada
  window.addEventListener("storage", function(e) {
    if (e.key === SESSION_KEY && e.newValue !== "active") {
      showLogin();
    }
  });
};

// Remove a sessão ao fechar a aba ou navegador
window.addEventListener("beforeunload", () => {
  localStorage.removeItem(SESSION_KEY);
});
