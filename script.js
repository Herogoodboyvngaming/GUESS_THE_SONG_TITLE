// DANH SÁCH BÀI HÁT - VIDEO ID THẬT + THUMBNAIL
const songs = [
    { title: "Fight Back", artist: "NEFFEX", videoId: "CYDP_8UTAus", thumbnail: "https://img.youtube.com/vi/CYDP_8UTAus/hqdefault.jpg" },
    { title: "Best of Me", artist: "NEFFEX", videoId: "0Wa_CR0H8g4", thumbnail: "https://img.youtube.com/vi/0Wa_CR0H8g4/hqdefault.jpg" },
    { title: "Rumors", artist: "NEFFEX", videoId: "LT_XSMrqS8M", thumbnail: "https://img.youtube.com/vi/LT_XSMrqS8M/hqdefault.jpg" },
    { title: "Cold", artist: "NEFFEX", videoId: "W0eW7bnJ6v8", thumbnail: "https://img.youtube.com/vi/W0eW7bnJ6v8/hqdefault.jpg" },
    { title: "Grateful", artist: "NEFFEX", videoId: "83RUhxsfLWs", thumbnail: "https://img.youtube.com/vi/83RUhxsfLWs/hqdefault.jpg" },
    { title: "Never Give Up", artist: "NEFFEX", videoId: "T7kiCsfqQfM", thumbnail: "https://img.youtube.com/vi/T7kiCsfqQfM/hqdefault.jpg" },
    { title: "Careless", artist: "NEFFEX", videoId: "zqKX0p0iW0o", thumbnail: "https://img.youtube.com/vi/zqKX0p0iW0o/hqdefault.jpg" },
    { title: "Failure", artist: "NEFFEX", videoId: "qG8M6nWqC4s", thumbnail: "https://img.youtube.com/vi/qG8M6nWqC4s/hqdefault.jpg" },
    { title: "Desperate", artist: "NEFFEX", videoId: "kDYn3gLr6XU", thumbnail: "https://img.youtube.com/vi/kDYn3gLr6XU/hqdefault.jpg" },

    { title: "Unity", artist: "TheFatRat", videoId: "n4tK7LYFxI0", thumbnail: "https://img.youtube.com/vi/n4tK7LYFxI0/hqdefault.jpg" },
    { title: "Monody", artist: "TheFatRat", videoId: "B7xai5u_tnk", thumbnail: "https://img.youtube.com/vi/B7xai5u_tnk/hqdefault.jpg" },
    { title: "Fly Away", artist: "TheFatRat", videoId: "cMg8KaMdDYo", thumbnail: "https://img.youtube.com/vi/cMg8KaMdDYo/hqdefault.jpg" },
    { title: "The Calling", artist: "TheFatRat", videoId: "KR-eV7fHNbM", thumbnail: "https://img.youtube.com/vi/KR-eV7fHNbM/hqdefault.jpg" },
    { title: "We'll Meet Again", artist: "TheFatRat", videoId: "s3yB1oBOI4s", thumbnail: "https://img.youtube.com/vi/s3yB1oBOI4s/hqdefault.jpg" },
    { title: "Close To The Sun", artist: "TheFatRat", videoId: "O2oE7iPqZqM", thumbnail: "https://img.youtube.com/vi/O2oE7iPqZqM/hqdefault.jpg" },
    { title: "Rise Up", artist: "TheFatRat", videoId: "j-2DGYNXRx0", thumbnail: "https://img.youtube.com/vi/j-2DGYNXRx0/hqdefault.jpg" },
    { title: "Xenogenesis", artist: "TheFatRat", videoId: "5eW6EgnevGc", thumbnail: "https://img.youtube.com/vi/5eW6EgnevGc/hqdefault.jpg" },
    { title: "Time Lapse", artist: "TheFatRat", videoId: "3Fx5QNEz1yo", thumbnail: "https://img.youtube.com/vi/3Fx5QNEz1yo/hqdefault.jpg" },
    { title: "Warbringer", artist: "TheFatRat", videoId: "jiT2Mak9AzI", thumbnail: "https://img.youtube.com/vi/jiT2Mak9AzI/hqdefault.jpg" },
    { title: "Hiding in the Blue", artist: "TheFatRat", videoId: "lW0DIsC7n1U", thumbnail: "https://img.youtube.com/vi/lW0DIsC7n1U/hqdefault.jpg" },

    { title: "See You Again", artist: "Wiz Khalifa", videoId: "RgKAFK5djSk", thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg" }
];

let currentUser = null;
let currentScore = 0;
let currentQuestion = 0;
let ttsEnabled = true;
let player = null;
let currentSong = null;

const screens = {
    auth: document.getElementById('auth-screen'),
    menu: document.getElementById('menu-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen')
};

function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    document.getElementById(id + '-screen').classList.add('active');
    if (id !== 'game' && player) {
        player.destroy();
        player = null;
    }
}

function confirmAction(message, callback) {
    if (confirm(message)) callback();
}

function speak(text) {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

// KHÔNG CHO ĐIỂM ÂM
function subtractScore(amount) {
    if (currentScore >= amount) {
        currentScore -= amount;
        updateScore();
        return true;
    } else {
        alert("Không đủ điểm để thực hiện hành động này!");
        return false;
    }
}

// AUTH + TỰ ĐĂNG NHẬP RELOAD
const authMessage = document.getElementById('auth-message');
const savedUsername = localStorage.getItem('lastLoggedUser');

if (savedUsername) {
    const userData = localStorage.getItem(savedUsername);
    if (userData) {
        currentUser = { name: savedUsername, ...JSON.parse(userData) };
        initMenu();
        showScreen('menu');
    }
}

document.getElementById('login-btn').onclick = () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (!username || !password) {
        authMessage.textContent = "Vui lòng nhập đầy đủ tên tài khoản và mật khẩu!";
        authMessage.style.color = "#ffeb3b";
        return;
    }
    const userData = localStorage.getItem(username);
    if (!userData) {
        authMessage.textContent = "Bạn chưa đăng ký! Vui lòng đăng ký tài khoản mới, rồi trở lại đăng nhập nhé 😊";
        authMessage.style.color = "#ffa502";
    } else {
        const data = JSON.parse(userData);
        if (data.pass === password) {
            currentUser = { name: username, ...data };
            localStorage.setItem('lastLoggedUser', username);
            authMessage.textContent = "Đăng nhập thành công ✅";
            authMessage.style.color = "#2ed573";
            setTimeout(() => { initMenu(); showScreen('menu'); }, 1000);
        } else {
            authMessage.textContent = "Mật khẩu sai rồi! Thử lại nhé ⚠️";
            authMessage.style.color = "#ff4757";
        }
    }
};

document.getElementById('register-btn').onclick = () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (!username || !password) {
        authMessage.textContent = "Vui lòng nhập đầy đủ!";
        authMessage.style.color = "#ffeb3b";
        return;
    }
    if (localStorage.getItem(username)) {
        authMessage.textContent = "Tài khoản đã tồn tại!";
        authMessage.style.color = "#ff4757";
        return;
    }
    const newUser = { pass: password, highScore: 0 };
    localStorage.setItem(username, JSON.stringify(newUser));
    authMessage.textContent = "Đăng ký thành công! Giờ bạn có thể đăng nhập rồi ✅";
    authMessage.style.color = "#2ed573";
};

document.getElementById('logout-btn').onclick = () => {
    saveUserData();
    localStorage.removeItem('lastLoggedUser');
    currentUser = null;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    authMessage.textContent = '';
    showScreen('auth');
};

// MENU
function initMenu() {
    document.getElementById('player-name').textContent = currentUser.name;
    document.getElementById('high-score').textContent = currentUser.highScore || 0;
    updateTime();
    setInterval(updateTime, 1000);
    document.getElementById('toggle-tts').textContent = ttsEnabled ? 'Tắt Giọng Đọc' : 'Bật Giọng Đọc';
}

document.getElementById('toggle-tts').onclick = () => {
    ttsEnabled = !ttsEnabled;
    document.getElementById('toggle-tts').textContent = ttsEnabled ? 'Tắt Giọng Đọc' : 'Bật Giọng Đọc';
};

document.getElementById('start-game').onclick = () => {
    confirmAction('Bạn có chắc muốn bắt đầu chơi không?', startGame);
};

function updateTime() {
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    document.getElementById('real-time').textContent = now;
};

// GAME
function onYouTubeIframeAPIReady() {}

function startGame() {
    currentScore = 0;
    currentQuestion = 0;
    updateScore();
    showScreen('game');
    loadNextQuestion();
    if (ttsEnabled) {
        speak("Chào mừng bạn đến với game đoán tên bài hát! Hãy lắng nghe đoạn nhạc sau khi bấm nút phát nhé!");
    }
}

function loadNextQuestion() {
    currentQuestion++;
    if (currentQuestion > 10) {
        endGame();
        return;
    }
    document.getElementById('question-num').textContent = currentQuestion;
    document.getElementById('question-text').textContent = "ÂM THANH BẠN VỪA NGHE ĐƯỢC LÀ GÌ?";

    const available = songs;
    currentSong = available[Math.floor(Math.random() * available.length)];
    const wrong = available.filter(s => s !== currentSong);
    for (let i = wrong.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
    }
    const options = [currentSong, wrong[0], wrong[1], wrong[2]];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    options.forEach(song => {
        const btn = document.createElement('button');
        const img = document.createElement('img');
        img.src = song.thumbnail;
        img.alt = song.title;
        img.className = 'song-thumbnail';
        img.loading = 'lazy';
        btn.appendChild(img);
        const pronounceBtn = document.createElement('button');
        pronounceBtn.textContent = '🔊';
        pronounceBtn.className = 'pronounce-btn';
        pronounceBtn.onclick = (e) => {
            e.stopPropagation();
            speak(`${song.title} của ${song.artist}`);
        };
        btn.appendChild(pronounceBtn);
        btn.innerHTML += `<span>${song.title} - ${song.artist}</span>`;
        btn.onclick = () => selectAnswer(song === currentSong, btn);
        optionsDiv.appendChild(btn);
    });

    if (player) {
        player.destroy();
    }

    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: currentSong.videoId,
        playerVars: {
            start: 30,
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0
        },
        events: {
            'onReady': () => {
                document.getElementById('play-btn').disabled = false;
            }
        }
    });
}

document.getElementById('play-btn').onclick = () => {
    speak("Hãy lắng nghe đoạn nhạc sau");
    document.getElementById('play-btn').disabled = true;
    player.seekTo(30);
    player.playVideo();
    setTimeout(() => {
        player.pauseVideo();
        speak("Âm thanh bạn vừa nghe được là gì?");
        document.getElementById('play-btn').disabled = false;
    }, 10000);
};

function selectAnswer(isCorrect, btn) {
    const message = isCorrect 
        ? "Bạn chắc chứ? Chọn đúng +50 điểm!" 
        : "Bạn chắc chứ? Chọn sai sẽ bị trừ 10 điểm (nếu còn điểm)!";
    confirmAction(message, () => {
        if (isCorrect) {
            currentScore += 50;
            btn.style.background = 'linear-gradient(45deg, #2ed573, #51e898)';
            speak("Chính xác! Chúc mừng!");
        } else {
            if (subtractScore(10)) {
                btn.style.background = 'linear-gradient(45deg, #ff4757, #ff7675)';
                speak("Sai rồi! Tiếp tục cố lên!");
            }
        }
        updateScore();
        setTimeout(loadNextQuestion, 2000);
    });
};

function updateScore() {
    document.getElementById('score').textContent = currentScore;
}

document.getElementById('skip-btn').onclick = () => {
    if (subtractScore(30)) {
        loadNextQuestion();
    }
};

document.getElementById('giveup-btn').onclick = () => {
    if (subtractScore(10)) {
        showScreen('menu');
    }
};

document.getElementById('home-btn').onclick = () => {
    confirmAction("Trở về menu? Tiến độ sẽ mất.", () => showScreen('menu'));
};

document.getElementById('restart-btn').onclick = () => {
    confirmAction("Restart game từ đầu?", startGame);
};

document.getElementById('back-to-menu-result').onclick = () => {
    showScreen('menu');
};

function endGame() {
    saveUserData();
    document.getElementById('final-score').textContent = currentScore;
    if (currentScore > (currentUser.highScore || 0)) {
        currentUser.highScore = currentScore;
        document.getElementById('new-record').textContent = "KỶ LỤC MỚI!";
        saveUserData();
    } else {
        document.getElementById('new-record').textContent = "";
    }
    showScreen('result');
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem(currentUser.name, JSON.stringify({
            pass: currentUser.pass,
            highScore: currentUser.highScore || 0
        }));
    }
}

// REPORT & UPDATE MODAL
const reportModal = document.getElementById('report-modal');
const reportBtn = document.getElementById('report-btn');
const closeModal = document.getElementById('close-modal');
const sendReport = document.getElementById('send-report');
const reportStatus = document.getElementById('report-status');

reportBtn.onclick = () => { reportModal.style.display = 'flex'; };
closeModal.onclick = () => { reportModal.style.display = 'none'; reportStatus.textContent = ''; };
window.onclick = (e) => { if (e.target === reportModal) { reportModal.style.display = 'none'; reportStatus.textContent = ''; } };

sendReport.onclick = () => {
    const name = document.getElementById('report-name').value.trim();
    const email = document.getElementById('report-email').value.trim();
    const message = document.getElementById('report-message').value.trim();
    if (!name || !email || !message) {
        reportStatus.textContent = 'Vui lòng điền đầy đủ tất cả các trường!';
        reportStatus.style.color = '#ff4757';
        return;
    }
    const subject = encodeURIComponent(`Report từ ${name}`);
    const body = encodeURIComponent(`Tên: ${name}\nEmail: \( {email}\nTin nhắn:\n \){message}`);
    window.location.href = `mailto:Herogoodboymc2024@gmail.com?subject=\( {subject}&body= \){body}`;
    reportStatus.textContent = 'Đã mở mail để gửi! Cảm ơn bạn rất nhiều ❤️';
    reportStatus.style.color = '#2ed573';
    document.getElementById('report-name').value = '';
    document.getElementById('report-email').value = '';
    document.getElementById('report-message').value = '';
};

const updateModal = document.getElementById('update-modal');
const updateBtn = document.getElementById('update-btn');
const closeUpdateModal = document.getElementById('close-update-modal');

updateBtn.onclick = () => { updateModal.style.display = 'flex'; };
closeUpdateModal.onclick = () => { updateModal.style.display = 'none'; };
window.onclick = (e) => { if (e.target === updateModal) { updateModal.style.display = 'none'; } };
