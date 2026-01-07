// DANH SÁCH BÀI HÁT - THÊM NHIỀU BÀI QUỐC TẾ HOT (THE FAT RAT & NEFFEX MỞ KHÓA SẴN)
const songs = [
    { title: "Nắng Dưới Chân Mây", artist: "Nguyễn Hữu Kha (HuyPT Remix)", audio: "https://cdn.pixabay.com/download/audio/2023/08/02/audio_2e9f0b7e9e.mp3?filename=energetic-edm-118113.mp3" },
    { title: "Thiệp Hồng Sai Tên Remix", artist: "Hot TikTok VN 2025", audio: "https://cdn.pixabay.com/download/audio/2023/10/20/audio_5c7d9e2f1a.mp3?filename=edm-dance-122178.mp3" },
    { title: "Unity", artist: "TheFatRat", audio: "https://cdn.pixabay.com/download/audio/2022/11/02/audio_8d7b3c5e6f.mp3?filename=epic-trailer-124318.mp3" },
    { title: "Monody", artist: "TheFatRat", audio: "https://cdn.pixabay.com/download/audio/2022/05/28/audio_6d8f7e2b4c.mp3?filename=the-fat-rat-monody-remix-101292.mp3" },
    { title: "Time Lapse", artist: "TheFatRat", audio: "https://cdn.pixabay.com/download/audio/2023/01/27/audio_2d9f8e4b0a.mp3?filename=fight-no-copyright-music-113903.mp3" },
    { title: "The Calling", artist: "TheFatRat", audio: "https://cdn.pixabay.com/download/audio/2023/07/14/audio_9e4b2f1c7d.mp3?filename=motivational-epic-music-116491.mp3" },
    { title: "Fight Back", artist: "NEFFEX", audio: "https://cdn.pixabay.com/download/audio/2023/01/27/audio_2d9f8e4b0a.mp3?filename=fight-no-copyright-music-113903.mp3" },
    { title: "Rumors", artist: "NEFFEX", audio: "https://cdn.pixabay.com/download/audio/2024/03/15/audio_2f3e8b3f5d.mp3?filename=cyberpunk-gaming-20998.mp3" },
    { title: "Cold", artist: "NEFFEX", audio: "https://cdn.pixabay.com/download/audio/2023/08/02/audio_2e9f0b7e9e.mp3?filename=energetic-edm-118113.mp3" },
    { title: "Failure", artist: "NEFFEX", audio: "https://cdn.pixabay.com/download/audio/2023/10/20/audio_5c7d9e2f1a.mp3?filename=edm-dance-122178.mp3" }
];

const internationalSongs = songs.slice(2); // TẤT CẢ QUỐC TẾ MỞ KHÓA SẴN

let currentUser = null;
let currentScore = 0;
let currentQuestion = 0;
let audioElement = null;
let ttsAudio = null;
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
}

function confirmAction(message, callback) {
    if (confirm(message)) callback();
}

function speak(text) {
    if (ttsAudio) ttsAudio.pause();
    ttsAudio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`);
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
    updateTime();
    setInterval(updateTime, 1000);
}

document.getElementById('start-game').onclick = () => {
    confirmAction('Bạn có chắc muốn bắt đầu chơi không?', startGame);
};

function updateTime() {
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    document.getElementById('real-time').textContent = now;
}

// GAME
function getAvailableSongs() {
    let available = songs.slice(0, 2); // NHẠC VIỆT
    available = available.concat(internationalSongs); // MỞ KHÓA SẴN QUỐC TẾ
    return available;
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

    const available = getAvailableSongs();
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
        const pronounceBtn = document.createElement('button');
        pronounceBtn.textContent = '🔊';
        pronounceBtn.className = 'pronounce-btn';
        pronounceBtn.onclick = (e) => {
            e.stopPropagation();
            speak(`${song.title} của ${song.artist}`);
        };
        btn.appendChild(pronounceBtn);
        btn.innerHTML += `${song.title} - ${song.artist}`;
        btn.onclick = () => selectAnswer(song === currentSong, btn);
        optionsDiv.appendChild(btn);
    });

    if (audioElement) audioElement.pause();
    audioElement = new Audio(currentSong.audio);
    audioElement.onended = () => document.getElementById('play-btn').disabled = false;
    document.getElementById('play-btn').disabled = false;
}

document.getElementById('play-btn').onclick = () => {
    speak("Hãy lắng nghe đoạn nhạc sau");
    document.getElementById('play-btn').disabled = true;
    audioElement.currentTime = 0;
    audioElement.play();
    setTimeout(() => {
        audioElement.pause();
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
    confirmAction("Trở về trang chủ? Tiến độ sẽ mất.", () => showScreen('menu'));
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
