// Jogos com opções de acesso personalizadas
const jogos = [
    {
        nome: "Palmeiras Vs São Paulo",
        horario: "2025-06-05T16:00:00-03:00",
        opcoes: [
            { nome: "Opção 1", link: "https://site1.com" },
            { nome: "Opção 2", link: "https://site2.com" },
            { nome: "Opção 3", link: "https://site3.com" },
            { nome: "Opção 4", link: "https://site4.com" }
        ]
    },
    {
        nome: "Flamengo Vs Vasco",
        horario: "2025-06-05T18:00:00-03:00",
        opcoes: [
            { nome: "Opção 1", link: "https://flamengo.com" },
            { nome: "Opção 2", link: "https://vasco.com" },
            { nome: "Opção 3", link: "https://opcao3.com" },
            { nome: "Opção 4", link: "https://opcao4.com" }
        ]
    },
    {
        nome: "Corinthians Vs Santos",
        horario: "2025-06-05T20:00:00-03:00",
        opcoes: [
            { nome: "Opção 1", link: "https://corinthians.com" },
            { nome: "Opção 2", link: "https://santos.com" },
            { nome: "Opção 3", link: "https://opcao3.com" },
            { nome: "Opção 4", link: "https://opcao4.com" }
        ]
    }
];

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}
function setLoggedIn(value) {
    if(value) localStorage.setItem('isLoggedIn', 'true');
    else localStorage.removeItem('isLoggedIn');
}
function logoutIfNeeded() {
    if (!isLoggedIn()) {
        document.getElementById('main-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    }
}
window.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn()) {
        document.getElementById('main-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    } else {
        document.getElementById('main-page').style.display = 'block';
        document.getElementById('login-page').style.display = 'none';
        setupMainPage();
    }

    // LOGIN PAGE: temporizador de 30s no botão
    let timer = 30;
    const loginBtn = document.getElementById('login-btn');
    const timerSpan = document.getElementById('timer');
    let interval = setInterval(() => {
        timer--;
        timerSpan.textContent = timer;
        if (timer <= 0) {
            clearInterval(interval);
            loginBtn.textContent = "Login";
            loginBtn.disabled = false;
            loginBtn.classList.add('enabled');
            loginBtn.style.cursor = 'pointer';
        }
    }, 1000);

    loginBtn.addEventListener('click', () => {
        if (loginBtn.disabled) return;
        setLoggedIn(true);
        document.getElementById('main-page').style.display = 'block';
        document.getElementById('login-page').style.display = 'none';
        setupMainPage();
    });

    window.addEventListener('beforeunload', () => {
        setLoggedIn(false);
    });
});

function setupMainPage() {
    // Lista de jogos
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = '';
    jogos.forEach((jogo, idx) => {
        const item = document.createElement('div');
        item.className = 'game-item';
        item.textContent = `${jogo.nome} (${formatarHorario(jogo.horario)})`;
        item.addEventListener('click', () => iniciarJogo(idx));
        gamesList.appendChild(item);
    });

    // Mostrar o primeiro jogo por padrão
    iniciarJogo(0);

    window.onblur = () => { setLoggedIn(false); };
    window.onfocus = () => { logoutIfNeeded(); };
}

let cronometroInterval = null, statusTimeout = null;
function iniciarJogo(idx) {
    clearInterval(cronometroInterval);
    clearTimeout(statusTimeout);
    const jogo = jogos[idx];
    const timerSpan = document.getElementById('game-timer');
    const statusSpan = document.getElementById('game-status');
    let horarioJogo = new Date(jogo.horario).getTime();
    let agora = Date.now();

    // Atualiza opções de acesso dinâmicas
    const linksDiv = document.getElementById('links');
    if (jogo.opcoes && jogo.opcoes.length > 0) {
        let html = `<h3>Opções de Acesso</h3><ul>`;
        jogo.opcoes.forEach(opcao => {
            html += `<li><a href="${opcao.link}" target="_blank">${opcao.nome}</a></li>`;
        });
        html += `</ul>`;
        linksDiv.innerHTML = html;
    } else {
        linksDiv.innerHTML = '';
    }

    function updateTimer() {
        agora = Date.now();
        if (agora < horarioJogo) {
            let diff = Math.floor((horarioJogo - agora)/1000);
            timerSpan.textContent = `Começa em: ${formatarTempo(diff)}`;
            statusSpan.textContent = "";
        } else if (agora >= horarioJogo && agora < horarioJogo + 2*3600*1000) {
            timerSpan.textContent = "";
            statusSpan.textContent = "AO VIVO AGORA";
            let tempoRestante = Math.floor((horarioJogo + 2*3600*1000 - agora)/1000);
            if (tempoRestante <= 0) {
                encerrarJogo();
            }
        } else {
            encerrarJogo();
        }
    }
    updateTimer();
    cronometroInterval = setInterval(updateTimer, 1000);

    function encerrarJogo() {
        clearInterval(cronometroInterval);
        timerSpan.textContent = "";
        statusSpan.textContent = "JOGO ENCERRADO!";
    }
}

function formatarTempo(segundos) {
    if (segundos < 0) return "00:00";
    let h = Math.floor(segundos/3600);
    let m = Math.floor((segundos%3600)/60);
    let s = segundos%60;
    let out = "";
    if (h > 0) out += String(h).padStart(2,'0') + ":";
    out += String(m).padStart(2,'0') + ":" + String(s).padStart(2,'0');
    return out;
}
function formatarHorario(horarioISO) {
    const d = new Date(horarioISO);
    let h = String(d.getHours()).padStart(2,'0');
    let m = String(d.getMinutes()).padStart(2,'0');
    return `${h}:${m}`;
}