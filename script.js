// Usuário e senha predefinidos
const USERNAME = "xfut";
const PASSWORD = "xfut123"; // Troque para a senha que quiser

// Lista de jogos e opções
const jogos = [
  {
    nome: "Jogo do Palmeiras (off)",
    opcoes: [
      { nome: "Opção 1", url: "https://site.com" },
      { nome: "Opção 2", url: "https://site.com" }
    ]
  },
  {
    nome: "Jogo do Atletico-Mg (on)",
    opcoes: [
      { nome: "Opção 1", url: "https://embedflix.top/tv/espn-4" },
      { nome: "Opção 2", url: "https://embedflix.top/infra.php?url=/channels/bra/br6.php" }
    ]
  }
  // Adicione mais jogos aqui...
];

// Controle de sessão via localStorage
const SESSION_KEY = "xfut_session";

// Checa login ao carregar
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

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const msg = document.getElementById("login-msg");

  // Só deixa logar se não houver outra sessão ativa
  if (localStorage.getItem(SESSION_KEY) === "active") {
    msg.innerText = "Já existe um login ativo neste navegador!";
    return;
  }

  if (u === USERNAME && p === PASSWORD) {
    localStorage.setItem(SESSION_KEY, "active");
    showMain();
    msg.innerText = "";
  } else {
    msg.innerText = "Usuário ou senha inválidos!";
  }
}

function showMain() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("main-container").style.display = "block";
  renderJogos();
}

function showLogin() {
  document.getElementById("main-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
  localStorage.removeItem(SESSION_KEY);
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
}

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

// Ao fechar a aba ou navegador, remove a sessão
window.addEventListener("beforeunload", () => {
  localStorage.removeItem(SESSION_KEY);
});
