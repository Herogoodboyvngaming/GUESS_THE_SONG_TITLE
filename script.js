// script.js
const songs = [
    { name: "Nắng Dưới Chân Mây", artist: "Phan Mạnh Quỳnh", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", country: "VN" },
    { name: "Unity", artist: "TheFatRat", url: "https://www.youtube.com/embed/n4tK7LYFxI0", country: "International" },
    { name: "Fight Back", artist: "NEFFEX", url: "https://www.youtube.com/embed/CYDP_8UTAus", country: "International" },
    { name: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", url: "https://www.youtube.com/embed/RgKAFK5djSk", country: "International" },
    { name: "Em Của Ngày Hôm Qua", artist: "Sơn Tùng M-TP", url: "https://www.youtube.com/embed/LCyoT4r2Q2U", country: "VN" },
    { name: "Monody", artist: "TheFatRat", url: "https://www.youtube.com/embed/B7xai5u_tnk", country: "International" },
    { name: "Rumors", artist: "NEFFEX", url: "https://www.youtube.com/embed/5n1q2NXF5bA", country: "International" },
    { name: "Thiên Lý Ơi", artist: "Jack", url: "https://www.youtube.com/embed/6v2AG9iMhDM", country: "VN" }
];

let currentSong = null;
let score = 0;
let player = null;

// Auth system (localStorage)
const authScreen = document.getElementById('authScreen');
const gameScreen = document.getElementById('gameScreen');
const currentUserSpan = document.getElementById('currentUser');
const scoreSpan = document.getElementById('score');

function saveUser(username) {
    localStorage.setItem('currentUser', username);
    localStorage.setItem(username + '_score', score);
}

function loadUser(username) {
    currentUserSpan.textContent = username;
    score = parseInt(localStorage.getItem(username + '_score') || 0);
    scoreSpan.textContent = score;
}

document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (username && password) {
        loadUser(username);
        authScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    } else {
        document.getElementById('authMessage').textContent = 'Vui lòng nhập đầy đủ!';
    }
});

document.getElementById('registerBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (username && password) {
        saveUser(username);
        loadUser(username);
        authScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    } else {
        document.getElementById('authMessage').textContent = 'Vui lòng nhập đầy đủ!';
    }
});

// Real-time clock
function updateTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleString('vi-VN');
}
setInterval(updateTime, 1000);
updateTime();

// Game logic
const startBtn = document.getElementById('startBtn');
const questionArea = document.getElementById('questionArea');
const playBtn = document.getElementById('playBtn');
const optionsDiv = document.getElementById('options');
const resultArea = document.getElementById('resultArea');
const resultText = document.getElementById('resultText');
const nextBtn = document.getElementById('nextBtn');

startBtn.addEventListener('click', startGame);

function startGame() {
    startBtn.style.display = 'none';
    questionArea.style.display = 'block';
    loadNewSong();
}

function loadNewSong() {
    currentSong = songs[Math.floor(Math.random() * songs.length)];
    optionsDiv.innerHTML = '';
    const correctIndex = Math.floor(Math.random() * 4);
    const wrongSongs = songs.filter(s => s !== currentSong).sort(() => 0.5 - Math.random()).slice(0, 3);

    for (let i = 0; i < 4; i++) {
        const btn = document.createElement('button');
        if (i === correctIndex) {
            btn.textContent = `${currentSong.name} - ${currentSong.artist}`;
            btn.dataset.correct = true;
        } else {
            const wrong = wrongSongs.pop();
            btn.textContent = `${wrong.name} - ${wrong.artist}`;
        }
        btn.addEventListener('click', checkAnswer);
        optionsDiv.appendChild(btn);
    }
}

function checkAnswer(e) {
    const correct = e.target.dataset.correct;
    if (correct) {
        score += 20;
        resultText.textContent = 'ĐÚNG RỒI!!! +20 điểm 🎉';
    } else {
        score -= 10;
        resultText.textContent = 'SAI RỒI!!! -10 điểm 😭';
    }
    scoreSpan.textContent = score;
    localStorage.setItem(currentUserSpan.textContent + '_score', score);
    questionArea.style.display = 'none';
    resultArea.style.display = 'block';
}

playBtn.addEventListener('click', () => {
    if (player) player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    setTimeout(() => {
        if (player) player.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }, 10000); // Play 10 giây
});

nextBtn.addEventListener('click', () => {
    resultArea.style.display = 'none';
    questionArea.style.display = 'block';
    loadNewSong();
});

// Load YouTube player when music button clicked (unlock autoplay)
document.getElementById('musicBtn').addEventListener('click', () => {
    if (!player) {
        player = document.createElement('iframe');
        player.id = 'youtubePlayer';
        player.src = currentSong ? currentSong.url.replace('embed/', 'embed/') + '?enablejsapi=1' : songs[0].url.replace('embed/', 'embed/') + '?enablejsapi=1';
        player.style.display = 'none';
        document.body.appendChild(player);
    }
});

// Report button
document.getElementById('reportBtn').addEventListener('click', () => {
    alert('Cảm ơn bạn đã report! Mình sẽ sửa sớm nhất có thể nhé ♥️🇻🇳');
});
