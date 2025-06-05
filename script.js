const SESSION_KEY = "xfut_session";

// --- NOVO LOGIN: SÓ BOTÃO E PROPAGANDA ---
function showAd() {
  // Substitua o link abaixo pelo link do seu anúncio!
  const adWindow = window.open('https://www.google.com', '_blank');
  // Aguarda a janela fechar
  let checkInterval = setInterval(() => {
    if (adWindow.closed) {
      clearInterval(checkInterval);
      liberarAcesso();
    }
  }, 800);
}

function liberarAcesso() {
  localStorage.setItem(SESSION_KEY, "active");
  showMain();
  document.getElementById("login-msg").innerText = "";
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
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

// Mostra só o login (sem rodapé, sem notificações)
function showLogin() {
  document.getElementById("main-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
  localStorage.removeItem(SESSION_KEY);
  // Esconde rodapé
  let rodape = document.querySelector('.rodape-moderno');
  if (rodape) rodape.style.display = "none";
  // Esconde notificações
  let notif = document.getElementById("user-notification");
  if (notif) notif.style.display = "none";
  let aviso = document.getElementById("notificacao-jogo");
  if (aviso) aviso.style.display = "none";
}

// Mostra a área principal (com rodapé e notificações)
function showMain() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("main-container").style.display = "block";
  let notifJogo = document.getElementById("notificacao-jogo");
  if (notifJogo) notifJogo.style.display = "block";
  renderJogos();
  let rodape = document.querySelector('.rodape-moderno');
  if (rodape) {
    rodape.classList.remove('rodape-fixa');
    rodape.style.display = "block";
    setupRodapeScroll();
  }
}

// O RESTANTE DO SCRIPT SEGUE COMO ANTES (lista de jogos, renderização, busca)

const jogos = [
    {
    nome: "nome1 VS nome2 (00.00)",
    inicio: null,
    opcoes: [
      { nome: "Opção 1", url: "https://embedflix.top/tv/ufc-fight-pass-hd" },
      { nome: "Opção 2", url: "https://nossoplayeronlinehd.com/tv/ufcfightpass" },
      { nome: "Opção 3", url: "https://embedflix.top/tv/globo-sp" },
      { nome: "Opção 4", url: "https://nossoplayeronlinehd.lat/tv/sbt" },
      { nome: "Opção 5", url: "https://nossoplayeronlinehd.lat/tv/record" }
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

// Funções auxiliares e renderização dos jogos (mantenha igual ao original):

const intervalosJogos = {};

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(n => String(n).padStart(2, '0')).join(':');
}

function normalizar(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function renderJogos(filter = "") {
  const list = document.getElementById("games-list");
  list.innerHTML = "";
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
  if (intervalosJogos[idx]) clearInterval(intervalosJogos[idx]);
  intervalosJogos[idx] = setInterval(updateStatus, 1000);
}

function closeNotification() {
  const notif = document.getElementById("user-notification");
  if (notif) notif.style.display = "none";
}

function handleSearch() {
  const searchTerm = document.getElementById('search-input').value;
  renderJogos(searchTerm);
}

// ----------- CONTROLE DO RODAPÉ ---------------

function setupRodapeScroll() {
  const rodape = document.querySelector('.rodape-moderno');
  function verificarRodape() {
    if (document.getElementById("main-container").style.display === "block") {
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
  verificarRodape();
}

// -----------------------------------------------------
