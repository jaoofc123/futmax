const LOGINS = [
  { username: "admjao", password: "SlAxMjMhMTIz", nome: "João" },
  { username: "nome0", password: "ZXVtdWRvMTIz", nome: "Nome0" },
  { username: "nome1", password: "ZXVtdWRvMTIz", nome: "Nome1" },
  { username: "nome2", password: "ZXVtdWRvMTIz", nome: "Nome2" },
  { username: "nome3", password: "ZXVtdWRvMTIz", nome: "Nome3" },         
  { username: "nome4", password: "ZXVtdWRvMTIz", nome: "Nome4" },       
  { username: "nome5", password: "ZXVtdWRvMTIz", nome: "Nome5" },   
  { username: "nome6", password: "ZXVtdWRvMTIz", nome: "Nome6" },  
  { username: "nome7", password: "ZXVtdWRvMTIz", nome: "Nome7" },
  { username: "nome8", password: "ZXVtdWRvMTIz", nome: "Nome8" },
  { username: "nome9", password: "ZXVtdWRvMTIz", nome: "Nome9" }
];

const SESSION_KEY = "xfut_session";

// Lista de jogos e opções (agora com data e hora exata de início)
const jogos = [
    {
    nome: "Jogos em Breve",
    inicio: "2025-06-02T19:00:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://jaoofc123.github.io/xfut/" },
      { nome: "Opção 2", url: "https://jaoofc123.github.io/xfut/" },
      { nome: "Opção 3", url: "https://jaoofc123.github.io/xfut/" },
      { nome: "Opção 4", url: "https://jaoofc123.github.io/xfut/" }
    ]
  },
  {
    nome: "Canais Fixos",
    inicio: null,
    opcoes: [
      { nome: "UFC 1", url: "https://embedflix.top/tv/ufc-fight-pass-hd" },
      { nome: "UFC 2", url: "https://nossoplayeronlinehd.com/tv/ufcfightpass" },
      { nome: "Globo Sp", url: "https://embedflix.top/tv/globo-sp" },
      { nome: "SBT", url: "https://nossoplayeronlinehd.lat/tv/sbt" },
      { nome: "Record Tv", url: "https://nossoplayeronlinehd.lat/tv/record" }
    ]
  }
];

const intervalosJogos = {};

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(n => String(n).padStart(2, '0')).join(':');
}

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const msg = document.getElementById("login-msg");
  if (localStorage.getItem(SESSION_KEY) === "active") {
    msg.innerText = "Já existe um login ativo neste navegador!";
    return;
  }
  let encodedPass = "";
  try {
    encodedPass = btoa(p);
  } catch (e) {
    msg.innerText = "Senha contém caracteres inválidos!";
    return;
  }
  const userObj = LOGINS.find(login => login.username === u && login.password === encodedPass);
  if (userObj) {
    const nome = userObj.nome;
    localStorage.setItem(SESSION_KEY, "active");
    showMain();
    msg.innerText = "";
    showWelcomeNotification(nome);
  } else {
    msg.innerText = "Usuário ou senha inválidos!";
  }
}
  const msg = document.getElementById("login-msg");
  if (localStorage.getItem(SESSION_KEY) === "active") {
    msg.innerText = "Já existe um login ativo neste navegador!";
    return;
  }
  let encodedPass = "";
  try {
    encodedPass = btoa(p);
  } catch (e) {
    msg.innerText = "Senha contém caracteres inválidos!";
    return;
  }
  const isValid = LOGINS.some(login => login.username === u && login.password === encodedPass);
  if (isValid) {
    localStorage.setItem(SESSION_KEY, "active");
    showMain();
    msg.innerText = "";
    showWelcomeNotification(nome); // Chama mensagem personalizada!
  } else {
    msg.innerText = "Usuário ou senha inválidos!";
  }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
}

// Função para normalizar string (remover acentos)
function normalizar(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function renderJogos(filter = "") {
  const list = document.getElementById("games-list");
  list.innerHTML = "";
  // Limpa todos intervalos antigos
  for (const idx in intervalosJogos) {
    clearInterval(intervalosJogos[idx]);
    delete intervalosJogos[idx];
  }
  jogos
    .filter(jogo => normalizar(jogo.nome).includes(normalizar(filter)))
    .forEach((jogo, idx) => {
      const block = document.createElement("div");
      block.className = "game-block";

      const title = document.createElement("h3");
      title.innerText = jogo.nome;
      block.appendChild(title);

      let statusArea = null;
      if (jogo.inicio) {
        statusArea = document.createElement("div");
        statusArea.className = "status-area";
        statusArea.id = `status-jogo-${idx}`;
        block.appendChild(statusArea);
      }

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

      if (jogo.inicio) {
        iniciarContagemJogo(jogo, idx);
      }
    });
}

const TEMPO_JOGO_MS = 120 * 60 * 1000; // 2 horas em ms

function iniciarContagemJogo(jogo, idx) {
  const statusArea = document.getElementById(`status-jogo-${idx}`);
  if (!statusArea) return;

  function updateStatus() {
    const agora = new Date();
    const inicio = new Date(jogo.inicio);
    const diff = inicio - agora;
    if (diff > 0) {
      if (diff <= 5 * 60 * 1000) {
        statusArea.innerHTML = `<span class="status ao-vivo-instant">AO VIVO EM INSTANTE</span> <span class="timer">${formatTime(diff)}</span>`;
      } else {
        statusArea.innerHTML = `<span class="status countdown">Começa em: <span class="timer">${formatTime(diff)}</span></span>`;
      }
    } else if (diff > -TEMPO_JOGO_MS) {
      const tempoRestante = TEMPO_JOGO_MS + diff;
      if (tempoRestante > 0) {
        statusArea.innerHTML = `<span class="status ao-vivo-agora">🟢 AO VIVO AGORA</span>`;
      } else {
        statusArea.innerHTML = `<span class="status encerrado">Jogo encerrado</span>`;
      }
    } else {
      statusArea.innerHTML = `<span class="status encerrado">Jogo encerrado</span>`;
    }
  }
  updateStatus();
  // Limpa intervalo antigo se houver
  if (intervalosJogos[idx]) clearInterval(intervalosJogos[idx]);
  intervalosJogos[idx] = setInterval(updateStatus, 1000);
}

window.onload = function() {
  if (localStorage.getItem(SESSION_KEY) === "active") {
    showMain();
  } else {
    showLogin();
  }
  window.addEventListener("storage", function(e) {
    if (e.key === SESSION_KEY && e.newValue !== "active") {
      showLogin();
    }
  });
};

window.addEventListener("beforeunload", () => {
  localStorage.removeItem(SESSION_KEY);
});

function handleSearch() {
  const searchTerm = document.getElementById('search-input').value;
  renderJogos(searchTerm);
}

// ----------- CONTROLE DO RODAPÉ ---------------

function setupRodapeScroll() {
  const rodape = document.querySelector('.rodape-moderno');
  function verificarRodape() {
    // Só ativa se a tela da lista de jogos estiver visível
    if (document.getElementById("main-container").style.display === "block") {
      // Chegou no fim da página? (com margem de 2px para tolerância)
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        rodape.style.display = "block";
      } else {
        rodape.style.display = "none";
      }
    } else {
      rodape.style.display = "none";
    }
  }
  window.addEventListener('scroll', verificarRodape);
  window.addEventListener('resize', verificarRodape);
  verificarRodape(); // Checa inicialmente
}

function showLogin() {
  document.getElementById("main-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
  localStorage.removeItem(SESSION_KEY);
  const rodape = document.querySelector('.rodape-moderno');
  rodape.classList.add('rodape-fixa');
  rodape.style.display = "block";
}

function showMain() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("main-container").style.display = "block";
  document.getElementById("notificacao-jogo").style.display = "block";
  renderJogos();
  const rodape = document.querySelector('.rodape-moderno');
  rodape.classList.remove('rodape-fixa');
  setupRodapeScroll();
}

// --- Notificação personalizada de boas-vindas (central, bloqueia o resto) ---
function showWelcomeNotification(nome) {
  const notif = document.getElementById("user-notification");
  const msg = document.getElementById("notification-message");
  msg.innerHTML = `Oiiiii, <b>${nome}</b>! Bom jogo pra você — que seu time brilhe em campo e saia com a vitória!`;
  notif.style.display = "flex";
  document.body.classList.add("blur");
  notif._timeout = setTimeout(closeNotification, 10000);
  document.onkeydown = function(e) {
    if (e.key === "Escape") closeNotification();
  }
}
function closeNotification() {
  const notif = document.getElementById("user-notification");
  notif.style.display = "none";
  document.body.classList.remove("blur");
  clearTimeout(notif._timeout);
  document.onkeydown = null;
}
