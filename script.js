const LOGINS = [
  { username: "admjao", password: "SlAxMjMhMTIz" },
  { username: "zanatta", password: "c2FtdWNhMjAxMQ==" },
  { username: "nome2", password: "bXVkYXIxMjMhMTIz" }
];

const SESSION_KEY = "xfut_session";

// Lista de jogos e opções (agora com data e hora exata de início)
const jogos = [
  {
    nome: "Brasil(F) Vs Japão(F) (30/05)",
    inicio: "2025-05-30T21:30:00-03:00", // Exemplo: 30/05/2025 19:00 (horário de Brasília)
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Final da Champions | PSG VS Inter (31/05)",
    inicio: "2025-05-31T16:00:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://embedflix.top/tv/tnt" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/tnt" }
    ]
  },
  {
    nome: "Bahia VS São Paulo (31/05)",
    inicio: "2025-05-31T18:30:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://embedflix.top/tv/prfc-2-hd" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/prfc-1-hd" }
    ]
  },
    {
    nome: "Vasco VS Bragantino (31/05)",
    inicio: "2025-05-31T21:00:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" }
    ]
  },
  {
    nome: "Mirassol Vs Sport Recife (01/06)",
    inicio: "2025-06-01T11:00:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Juventude Vs Grêmio (01/06)",
    inicio: "2025-06-01T16:00:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Santos Vs Botafogo (01/06)",
    inicio: "2025-06-01T16:00:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Flamengo Vs Fortaleza (01/06)",
    inicio: "2025-06-01T18:30:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Ceará SC Vs Atlético-MG (01/06)",
    inicio: "2025-06-01T18:30:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Corinthians Vs EC Vitória (01/06)",
    inicio: "2025-06-01T18:30:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Cruzeiro Vs Palmeiras (01/06)",
    inicio: "2025-06-01T19:30:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Internacional Vs Fluminense (01/06)",
    inicio: "2025-06-01T20:30:00-03:00",
    opcoes: [
      { nome: "Opção 1", url: "https://meuplayeronlinehd.com/myplay/watch.html?id=sportv" },
      { nome: "Opção 2", url: "https://embedflix.top/tv/globo-sp" }
    ]
  },
  {
    nome: "Canais Fixos",
    inicio: null, // Não tem contagem para canais fixos
    opcoes: [
      { nome: "UFC", url: "https://embedflix.top/tv/ufc-fight-pass-hd" },
      { nome: "Globo Sp", url: "https://embedflix.top/tv/globo-sp" }
    ]
  }
];

// Função para formatar tempo restante (hh:mm:ss)
function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(n => String(n).padStart(2, '0')).join(':');
}

// Função para mostrar a tela principal
function showMain() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("main-container").style.display = "block";
  document.getElementById("notificacao-jogo").style.display = "block";
  renderJogos();
}

// Função para mostrar tela de login
function showLogin() {
  document.getElementById("main-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
  localStorage.removeItem(SESSION_KEY);
}

// Função de login (com comparação Base64)
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const msg = document.getElementById("login-msg");
  if (localStorage.getItem(SESSION_KEY) === "active") {
    msg.innerText = "Já existe um login ativo neste navegador!";
    return;
  }
  const encodedPass = btoa(p);
  const isValid = LOGINS.some(login => login.username === u && login.password === encodedPass);
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

// Função principal para renderizar lista de jogos
function renderJogos(filter = "") {
  const list = document.getElementById("games-list");
  list.innerHTML = "";
  jogos
    .filter(jogo => jogo.nome.toLowerCase().includes(filter))
    .forEach((jogo, idx) => {
      const block = document.createElement("div");
      block.className = "game-block";

      const title = document.createElement("h3");
      title.innerText = jogo.nome;
      block.appendChild(title);

      // Se houver inicio definido, cria a área de contagem
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

      // Se tem contagem, inicializa
      if (jogo.inicio) {
        iniciarContagemJogo(jogo, idx);
      }
    });
}

const TEMPO_JOGO_MS = 100 * 60 * 1000; // 1h40min em ms

// Função para iniciar contagem regressiva individual por jogo
function iniciarContagemJogo(jogo, idx) {
  const statusArea = document.getElementById(`status-jogo-${idx}`);
  if (!statusArea) return;

  function updateStatus() {
    const agora = new Date();
    const inicio = new Date(jogo.inicio);
    const diff = inicio - agora;
    if (diff > 0) {
      // Menos de 5 minutos para começar
      if (diff <= 5 * 60 * 1000) {
        statusArea.innerHTML = `<span class="status ao-vivo-instant">AO VIVO EM INSTANTE</span> <span class="timer">${formatTime(diff)}</span>`;
      } else {
        statusArea.innerHTML = `<span class="status countdown">Começa em: <span class="timer">${formatTime(diff)}</span></span>`;
      }
    } else if (diff > -TEMPO_JOGO_MS) {
      // Já começou, está AO VIVO
      const tempoRestante = TEMPO_JOGO_MS + diff;
      if (tempoRestante > 0) {
        statusArea.innerHTML = `<span class="status ao-vivo-agora">🟢 AO VIVO AGORA</span> <span class="timer">${formatTime(tempoRestante)}</span>`;
      } else {
        statusArea.innerHTML = `<span class="status encerrado">Jogo encerrado</span>`;
      }
    } else {
      statusArea.innerHTML = `<span class="status encerrado">Jogo encerrado</span>`;
    }
  }
  updateStatus();
  setInterval(updateStatus, 1000);
}

// Evento único para carregar a página
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

// Remove a sessão ao fechar a aba ou navegador
window.addEventListener("beforeunload", () => {
  localStorage.removeItem(SESSION_KEY);
});

function closeNotification() {
  const notif = document.getElementById("user-notification");
  if (notif) notif.style.display = "none";
}

// Pesquisa de jogos filtrados
function handleSearch() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  renderJogos(searchTerm);
}
