// Danh sách bài hát (giữ nguyên như trước)
const songs = [
    { title: "Nắng Dưới Chân Mây", artist: "Nguyễn Hữu Kha (HuyPT Remix)", audio: "https://cdn.pixabay.com/download/audio/2023/08/02/audio_2e9f0b7e9e.mp3?filename=energetic-edm-118113.mp3" },
    { title: "Thiệp Hồng Sai Tên Remix", artist: "Hot TikTok VN 2025", audio: "https://cdn.pixabay.com/download/audio/2023/10/20/audio_5c7d9e2f1a.mp3?filename=edm-dance-122178.mp3" },
    { title: "Unity", artist: "TheFatRat", audio: "https://cdn.pixabay.com/download/audio/2022/11/02/audio_8d7b3c5e6f.mp3?filename=epic-trailer-124318.mp3" },
    { title: "Fight Back", artist: "NEFFEX", audio: "https://cdn.pixabay.com/download/audio/2023/01/27/audio_2d9f8e4b0a.mp3?filename=fight-no-copyright-music-113903.mp3" },
    { title: "Monody", artist: "TheFatRat", audio: "https://cdn.pixabay.com/download/audio/2022/05/28/audio_6d8f7e2b4c.mp3?filename=the-fat-rat-monody-remix-101292.mp3" },
    { title: "Best of Me", artist: "NEFFEX", audio: "https://cdn.pixabay.com/download/audio/2023/07/14/audio_9e4b2f1c7d.mp3?filename=motivational-epic-music-116491.mp3" },
    { title: "Trả Cho Anh Remix", artist: "TikTok Trend 2026", audio: "https://cdn.pixabay.com/download/audio/2024/03/15/audio_2f3e8b3f5d.mp3?filename=cyberpunk-gaming-20998.mp3" },
    { title: "Nhường Lại Nỗi Đau Remix", artist: "VN Hot 2025", audio: "https://cdn.pixabay.com/download/audio/2023/08/02/audio_2e9f0b7e9e.mp3?filename=energetic-edm-118113.mp3" }
];

const internationalSongs = songs.slice(2, 6);

let currentUser = null;
let currentScore = 0;
let currentQuestion = 0;
let unlockedInternational = false;
let audioElement = null;
let ttsAudio = null;
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

// ====================== PHẦN ĐĂNG NHẬP / ĐĂNG KÝ ĐÃ SỬA ======================
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
        // Chưa có tài khoản
        authMessage.textContent = "Bạn chưa đăng ký! Vui lòng đăng ký tài khoản mới, rồi trở lại đăng nhập nhé 😊";
        authMessage.style.color = "#ffa502";
    } else {
        const data = JSON.parse(userData);
        if (data.pass === password) {
            // Đăng nhập thành công
            currentUser = { name: username, ...data };
            authMessage.textContent = "Đăng nhập thành công ✅";
            authMessage.style.color = "#2ed573";
            setTimeout(() => {
                initMenu();
                showScreen('menu');
            }, 1000);
        } else {
            // Sai mật khẩu
            authMessage.textContent = "Mật khẩu sai rồi! Thử lại nhé ⚠️";
            authMessage.style.color = "#ff4757";
        }
    }
};

document.getElementById('register-btn').onclick = () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        authMessage.textContent = "Vui lòng nhập đầy đủ tên tài khoản và mật khẩu!";
        authMessage.style.color = "#ffeb3b";
        return;
    }

    if (localStorage.getItem(username)) {
        authMessage.textContent = "Tài khoản đã tồn tại! Hãy đăng nhập hoặc dùng tên khác.";
        authMessage.style.color = "#ff4757";
        return;
    }

    // Tạo tài khoản mới
    const newUser = {
        pass: password,
        highScore: 0,
        points: 0,
        unlockedInternational: false
    };
    localStorage.setItem(username, JSON.stringify(newUser));
    authMessage.textContent = "Đăng ký thành công! Giờ bạn có thể đăng nhập rồi ✅";
    authMessage.style.color = "#2ed573";
};

// Đăng xuất
document.getElementById('logout-btn').onclick = () => {
    saveUserData();
    currentUser = null;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    authMessage.textContent = '';
    showScreen('auth');
};

// ====================== MENU ======================
function initMenu() {
    document.getElementById('player-name').textContent = currentUser.name;
    document.getElementById('high-score').textContent = currentUser.highScore || 0;
    unlockedInternational = currentUser.unlockedInternational || false;
    updateTime();
    setInterval(updateTime, 1000);
}

document.getElementById('start-game').onclick = () => {
    confirmAction('Bạn có chắc muốn bắt đầu chơi không?', startGame);
};

document.getElementById('shop-btn').onclick = () => {
    document.getElementById('shop-score').textContent = currentUser.points || 0;
    showScreen('shop');
};

document.getElementById('back-to-menu').onclick = () => showScreen('menu');
document.getElementById('back-to-menu-result').onclick = () => showScreen('menu');

function updateTime() {
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    document.getElementById('real-time').textContent = now;
}

// ====================== SHOP ======================
document.querySelector('.shop-item .buy-btn').onclick = () => {
    if (currentUser.unlockedInternational) {
        alert('Bạn đã sở hữu gói này rồi!');
        return;
    }
    if ((currentUser.points || 0) >= 500) {
        confirmAction('Mua gói nhạc quốc tế với 500 điểm?', () => {
            currentUser.points -= 500;
            currentUser.unlockedInternational = true;
            unlockedInternational = true;
            saveUserData();
            alert('Mua thành công! Giờ bạn có thể nghe nhạc quốc tế.');
        });
    } else {
        alert('Không đủ điểm! Chơi thêm để kiếm điểm nhé.');
    }
};

// ====================== GAME ======================
function getAvailableSongs() {
    let available = songs.slice(0, 2);
    if (unlockedInternational) available = available.concat(internationalSongs);
    return available;
}

function startGame() {
    currentScore = 0;
    currentQuestion = 0;
    updateScore();
    showScreen('game');
    nextQuestion();
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion > 10) { endGame(); return; }
    document.getElementById('question-num').textContent = currentQuestion;

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
            btn.style.background = '#2ed573';
            speak("Chính xác! Chúc mừng!");
        } else {
            subtractScore(10);
            btn.style.background = '#ff4757';
            speak("Sai rồi! Tiếp tục cố lên!");
        }
        updateScore();
        setTimeout(nextQuestion, 2000);
    });
}

function updateScore() {
    document.getElementById('score').textContent = currentScore;
    if (currentScore > (currentUser.points || 0)) {
        currentUser.points = currentScore;
    }
}

document.getElementById('skip-btn').onclick = () => {
    confirmAction("Skip câu này sẽ trừ 30 điểm (nếu còn điểm). Chắc chứ?", () => {
        subtractScore(30);
        nextQuestion();
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
            highScore: currentUser.highScore || 0,
            points: currentUser.points || 0,
            unlockedInternational: currentUser.unlockedInternational || false
        }));
    }
}
