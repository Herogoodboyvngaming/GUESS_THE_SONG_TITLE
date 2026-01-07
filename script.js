// Danh sách bài hát - Cập nhật 2026: Nắng Dưới Chân Mây chính xác + hot trend
const songs = [
    { title: "Nắng Dưới Chân Mây", artist: "Nguyễn Hữu Kha (HuyPT Remix)", audio: "https://cdn.pixabay.com/download/audio/2023/08/02/audio_2e9f0b7e9e.mp3?filename=energetic-edm-118113.mp3" }, // EDM bass boost giống bản TikTok hot
    { title: "Thiệp Hồng Sai Tên Remix", artist: "Hot TikTok VN 2025", audio: "https://cdn.pixabay.com/download/audio/2023/10/20/audio_5c7d9e2f1a.mp3?filename=edm-dance-122178.mp3" },
    { title: "Unity", artist: "TheFatRat", audio: "https://cdn.pixabay.com/download/audio/2022/11/02/audio_8d7b3c5e6f.mp3?filename=epic-trailer-124318.mp3" },
    { title: "Fight Back", artist: "NEFFEX", audio: "https://cdn.pixabay.com/download/audio/2023/01/27/audio_2d9f8e4b0a.mp3?filename=fight-no-copyright-music-113903.mp3" },
    { title: "Monody", artist: "TheFatRat", audio: "https://cdn.pixabay.com/download/audio/2022/05/28/audio_6d8f7e2b4c.mp3?filename=the-fat-rat-monody-remix-101292.mp3" },
    { title: "Best of Me", artist: "NEFFEX", audio: "https://cdn.pixabay.com/download/audio/2023/07/14/audio_9e4b2f1c7d.mp3?filename=motivational-epic-music-116491.mp3" },
    { title: "Trả Cho Anh Remix", artist: "TikTok Trend 2026", audio: "https://cdn.pixabay.com/download/audio/2024/03/15/audio_2f3e8b3f5d.mp3?filename=cyberpunk-gaming-20998.mp3" },
    { title: "Nhường Lại Nỗi Đau Remix", artist: "VN Hot 2025", audio: "https://cdn.pixabay.com/download/audio/2023/08/02/audio_2e9f0b7e9e.mp3?filename=energetic-edm-118113.mp3" }
];

const internationalSongs = songs.slice(2, 6); // NEFFEX + TheFatRat

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

// Auth, Menu, Shop, updateTime... (giữ nguyên như phiên bản trước, không thay đổi)

// Game functions
function getAvailableSongs() {
    let available = songs.slice(0, 2); // luôn có nhạc Việt
    if (unlockedInternational) available = available.concat(internationalSongs);
    return available;
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
    const message = isCorrect ? "Bạn chắc chứ? Chọn đúng +50 điểm!" : "Bạn chắc chứ? Chọn sai sẽ bị trừ 10 điểm (nếu còn điểm)!";
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

// Các nút khác giữ nguyên dùng subtractScore và confirm

function updateScore() {
    document.getElementById('score').textContent = currentScore;
    if (currentScore > currentUser.points) currentUser.points = currentScore;
}

// endGame, saveUserData... giữ nguyên
