// DANH SÁCH BÀI HÁT - VIDEO ID THẬT TỪ YOUTUBE OFFICIAL + THUMBNAIL ĐÚNG
const songs = [
    { title: "Nắng Dưới Chân Mây", artist: "Nguyễn Hữu Kha (HuyPT Remix)", videoId: "7ojHIPRouik", thumbnail: "https://img.youtube.com/vi/7ojHIPRouik/hqdefault.jpg" },
    { title: "Thiệp Hồng Sai Tên Remix", artist: "Hot TikTok VN 2025", videoId: "exampleVNID", thumbnail: "https://img.youtube.com/vi/exampleVNID/hqdefault.jpg" }, // Thay ID thật nếu có
    { title: "Unity", artist: "TheFatRat", videoId: "n8X9_MgEdCg", thumbnail: "https://img.youtube.com/vi/n8X9_MgEdCg/hqdefault.jpg" },
    { title: "Monody", artist: "TheFatRat", videoId: "B7xai5u_tnk", thumbnail: "https://img.youtube.com/vi/B7xai5u_tnk/hqdefault.jpg" },
    { title: "The Calling", artist: "TheFatRat", videoId: "KR-eV7fHNbM", thumbnail: "https://img.youtube.com/vi/KR-eV7fHNbM/hqdefault.jpg" },
    { title: "Xenogenesis", artist: "TheFatRat", videoId: "3_-a9nVZYjk", thumbnail: "https://img.youtube.com/vi/3_-a9nVZYjk/hqdefault.jpg" },
    { title: "Fight Back", artist: "NEFFEX", videoId: "CYDP_8UTAus", thumbnail: "https://img.youtube.com/vi/CYDP_8UTAus/hqdefault.jpg" },
    { title: "Rumors", artist: "NEFFEX", videoId: "LT_XSMrqS8M", thumbnail: "https://img.youtube.com/vi/LT_XSMrqS8M/hqdefault.jpg" },
    { title: "Cold", artist: "NEFFEX", videoId: "WzQBAc8i73E", thumbnail: "https://img.youtube.com/vi/WzQBAc8i73E/hqdefault.jpg" },
    { title: "Failure", artist: "NEFFEX", videoId: "YKqDiNJJPXk", thumbnail: "https://img.youtube.com/vi/YKqDiNJJPXk/hqdefault.jpg" }
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
    shop: document.getElementById('shop-screen'),
    result: document.getElementById('result-screen')
};

function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    document.getElementById(id + '-screen').classList.add('active');
}

function confirmAction(message, callback) {
    if (confirm(message)) callback();
}

function speak(text) {
    if (!ttsEnabled) return;
    const ttsAudio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`);
    ttsAudio.play().catch(() => {});
}

function subtractScore(amount) {
    if (currentScore >= amount) {
        currentScore -= amount;
    } else {
        currentScore = 0;
    }
    updateScore();
}

// AUTH
const authMessage = document.getElementById('auth-message');

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
    const newUser = { pass: password, highScore: 0, points: 0 };
    localStorage.setItem(username, JSON.stringify(newUser));
    authMessage.textContent = "Đăng ký thành công! Giờ bạn có thể đăng nhập rồi ✅";
    authMessage.style.color = "#2ed573";
};

document.getElementById('logout-btn').onclick = () => {
    saveUserData();
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
    document.getElementById('current-points').textContent = currentUser.points || 0;
    document.getElementById('shop-points').textContent = currentUser.points || 0;
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

document.getElementById('shop-btn').onclick = () => {
    document.getElementById('shop-points').textContent = currentUser.points || 0;
    showScreen('shop');
};

document.getElementById('back-to-menu-shop').onclick = () => showScreen('menu');

function updateTime() {
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    document.getElementById('real-time').textContent = now;
}

// SHOP (COMING SOON)
document.querySelector('.shop-item .buy-btn').onclick = () => {
    if ((currentUser.points || 0) >= 500) {
        confirmAction('Mua gói nhạc nước ngoài khác với 500 điểm?', () => {
            currentUser.points -= 500;
            saveUserData();
            alert('Mua thành công! Gói nhạc sẽ coming soon ⏰ Cảm ơn bạn đã ủng hộ!');
            document.getElementById('shop-points').textContent = currentUser.points;
        });
    } else {
        alert('Không đủ điểm! Chơi thêm để kiếm điểm nhé.');
    }
};

// GAME WITH YOUTUBE PLAYER
function onYouTubeIframeAPIReady() {
    // API ready
}

function startGame() {
    currentScore = 0;
    currentQuestion = 0;
    updateScore();
    showScreen('game');
    loadNextQuestion();
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
            subtractScore(10);
            btn.style.background = 'linear-gradient(45deg, #ff4757, #ff7675)';
            speak("Sai rồi! Tiếp tục cố lên!");
        }
        updateScore();
        setTimeout(loadNextQuestion, 2000);
    });
};

function updateScore() {
    document.getElementById('score').textContent = currentScore;
    if (currentScore > (currentUser.points || 0)) {
        currentUser.points = currentScore;
    }
}

document.getElementById('skip-btn').onclick = () => {
    confirmAction("Skip câu này sẽ trừ 30 điểm (nếu còn điểm). Chắc chứ?", () => {
        subtractScore(30);
        loadNextQuestion();
    });
};

document.getElementById('giveup-btn').onclick = () => {
    confirmAction("Từ bỏ sẽ trừ 10 điểm (nếu còn điểm). Chắc chứ?", () => {
        subtractScore(10);
        showScreen('menu');
    });
};

document.getElementById('home-btn').onclick = () => {
    confirmAction("Trở về menu? Tiến độ sẽ mất.", () => showScreen('menu'));
};

document.getElementById('restart-btn').onclick = () => {
    confirmAction("Restart game từ đầu?", startGame);
};

function endGame() {
    saveUserData();
    document.getElementById('final-score').textContent = currentScore;
    if (currentScore > (currentUser.highScore || 0)) {
        currentUser.highScore = currentScore;
        document.getElementById('new-record').textContent = "KỶ LỤC MỚI!";
    } else {
        document.getElementById('new-record').textContent = "";
    }
    showScreen('result');
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem(currentUser.name, JSON.stringify({
            pass: currentUser.pass,
            highScore: currentUser.highScore || 0,
            points: currentUser.points || 0
        }));
    }
}

// REPORT BUG MODAL
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

// UPDATE MODAL
const updateModal = document.getElementById('update-modal');
const updateBtn = document.getElementById('update-btn');
const closeUpdateModal = document.getElementById('close-update-modal');

updateBtn.onclick = () => { updateModal.style.display = 'flex'; };
closeUpdateModal.onclick = () => { updateModal.style.display = 'none'; };
window.onclick = (e) => { if (e.target === updateModal) { updateModal.style.display = 'none'; } };
