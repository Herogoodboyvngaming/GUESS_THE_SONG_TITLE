let currentUser = null;
let score = 0;
let questionNum = 1;
let isTTS = true;
let player;
let bgMusicPlayer;
let currentSong = null;

// Danh sách bài hát
const songs = [
    { title: "Fight Back", artist: "NEFFEX", id: "CYDP_8UTAus" },
    { title: "Best of Me", artist: "NEFFEX", id: "0Wa_CR0H8g4" },
    { title: "Rumors", artist: "NEFFEX", id: "LT_XSMrqS8M" },
    { title: "Cold", artist: "NEFFEX", id: "W0eW7bnJ6v8" },
    { title: "Grateful", artist: "NEFFEX", id: "83RUhxsfLWs" },
    { title: "Never Give Up", artist: "NEFFEX", id: "T7kiCsfqQfM" },
    { title: "Careless", artist: "NEFFEX", id: "zqKX0p0iW0o" },
    { title: "Failure", artist: "NEFFEX", id: "qG8M6nWqC4s" },
    { title: "Desperate", artist: "NEFFEX", id: "kDYn3gLr6XU" },

    { title: "Unity", artist: "TheFatRat", id: "n4tK7LYFxI0" },
    { title: "Monody", artist: "TheFatRat", id: "B7xai5u_tnk" },
    { title: "Fly Away", artist: "TheFatRat", id: "cMg8KaMdDYo" },
    { title: "The Calling", artist: "TheFatRat", id: "KR-eV7fHNbM" },
    { title: "We'll Meet Again", artist: "TheFatRat", id: "s3yB1oBOI4s" },
    { title: "Close To The Sun", artist: "TheFatRat", id: "O2oE7iPqZqM" },
    { title: "Rise Up", artist: "TheFatRat", id: "j-2DGYNXRx0" },
    { title: "Xenogenesis", artist: "TheFatRat", id: "5eW6EgnevGc" },
    { title: "Time Lapse", artist: "TheFatRat", id: "3Fx5QNEz1yo" },
    { title: "Warbringer", artist: "TheFatRat", id: "jiT2Mak9AzI" },
    { title: "Hiding in the Blue", artist: "TheFatRat", id: "lW0DIsC7n1U" },

    { title: "See You Again", artist: "Wiz Khalifa", id: "RgKAFK5djSk" },
];

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showLogin() {
    openModal(`
        <h2>Đăng nhập</h2>
        <input type="text" id="loginInput" placeholder="Tên hoặc Gmail" required><br><br>
        <input type="password" id="loginPass" placeholder="Mật khẩu" required><br><br>
        <button class="btn primary" onclick="login()">ĐĂNG NHẬP</button>
    `);
}

function showRegister() {
    openModal(`
        <h2>Đăng ký tài khoản</h2>
        <input type="text" id="regName" placeholder="Tên của bạn" required><br><br>
        <input type="email" id="regEmail" placeholder="Gmail của bạn" required><br><br>
        <input type="password" id="regPass" placeholder="Mật khẩu" required><br><br>
        <button class="btn primary" onclick="register()">ĐĂNG KÝ</button>
    `);
}

function showReportBug() {
    openModal(`
        <h2>🛠️ Báo lỗi</h2>
        <input type="text" id="bugName" placeholder="Tên của bạn" required><br><br>
        <input type="email" id="bugEmail" placeholder="Gmail của bạn" required><br><br>
        <textarea id="bugMsg" placeholder="Tin nhắn yêu cầu sửa lỗi" required></textarea><br><br>
        <button class="btn primary" onclick="submitBug()">GỬI BÁO LỖI</button>
    `);
}

function submitBug() {
    const name = document.getElementById('bugName').value.trim();
    const email = document.getElementById('bugEmail').value.trim();
    const msg = document.getElementById('bugMsg').value.trim();
    if (!name || !email || !msg) return alert("Vui lòng điền đầy đủ!");
    alert("Cảm ơn bạn đã báo lỗi!");
    closeModal();
}

function showInfo() {
    openModal(`
        <h2>ℹ️ THÔNG TIN & UPDATE</h2>
        <p><strong>Phiên bản:</strong> 1.8 (07/01/2026)</p>
        <p>- Ẩn hoàn toàn thumbnail & tiêu đề YouTube<br>
        - Thêm nút ĐĂNG XUẤT<br>
        - Tự động đăng nhập + Chị Google hướng dẫn chi tiết</p>
        <p>Liên hệ hỗ trợ: Herogoodboymc2024@gmail.com</p>
    `);
}

function openModal(content) {
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function speak(text) {
    if (!isTTS) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
}

function register() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    if (!name || !email || !pass) return alert("Điền đầy đủ!");
    localStorage.setItem(email, JSON.stringify({ name, pass, score: 0, firstTime: true }));
    alert("Đăng ký thành công!");
    closeModal();
}

function login() {
    const input = document.getElementById('loginInput').value.trim();
    const pass = document.getElementById('loginPass').value;
    const userData = localStorage.getItem(input);
    if (!userData) return alert("Tài khoản không tồn tại!");
    const user = JSON.parse(userData);
    if (user.pass !== pass) return alert("Sai mật khẩu!");
    currentUser = { email: input, name: user.name, score: user.score || 0 };
    localStorage.setItem('lastLoggedInUser', input);
    showScreen('mainHome');
    document.getElementById('welcomeUser').textContent = `Xin chào ${user.name}!`;
    speak(`Chào mừng ${user.name} quay lại trò chơi nghe nhạc đoán tên bài hát nhé!`);
    closeModal();
    if (user.firstTime) {
        setTimeout(showTutorial, 2000);
        user.firstTime = false;
        localStorage.setItem(input, JSON.stringify(user));
    }
}

function showTutorial() {
    openModal(`<h2>Hướng dẫn chơi</h2><p>Nghe đoạn nhạc ngắn, đoán tên bài hát chính xác nhất.</p><p>Đúng +10 điểm • Skip -30 • Từ bỏ -10</p><p>Chúc vui!</p>`);
    speak("Hướng dẫn chơi: Nghe đoạn nhạc ngắn, đoán tên bài hát chính xác nhất. Đúng cộng 10 điểm. Skip trừ 30. Từ bỏ trừ 10. Chúc bạn chơi vui!");
}

function startGame() {
    score = currentUser ? (JSON.parse(localStorage.getItem(currentUser.email)).score || 0) : 0;
    questionNum = 1;
    document.getElementById('score').textContent = score;
    document.getElementById('questionNum').textContent = questionNum;
    showScreen('mainGame');
    loadNewSong();
    speak("Bắt đầu chơi nào! Bấm nút phát để nghe đoạn nhạc và đoán tên bài hát nhé. Không nhìn gì hết, chỉ nghe thôi! Chúc may mắn!");
}

function logout() {
    if (confirm("Bạn có chắc muốn đăng xuất không? Điểm số vẫn được lưu lại nhé!")) {
        localStorage.removeItem('lastLoggedInUser');
        currentUser = null;
        showScreen('mainMenu');
        showNotification("✅ Đã đăng xuất thành công!");
        speak("Tạm biệt nhé, hẹn gặp lại bạn trong lần chơi sau!");
    }
}

// Load YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    bgMusicPlayer = new YT.Player('bgMusicPlayer', {
        height: '0', width: '0', videoId: 'jfKfPfyJRdk',
        playerVars: { autoplay: 1, loop: 1, playlist: 'jfKfPfyJRdk', controls: 0 },
        events: { onReady: (e) => e.target.setVolume(20) }
    });
    loadNewSong();
}

function loadNewSong() {
    currentSong = songs[Math.floor(Math.random() * songs.length)];
    if (player) player.destroy();

    player = new YT.Player('songClipPlayer', {
        height: '80',
        width: '100%',
        videoId: currentSong.id,
        playerVars: {
            start: Math.floor(Math.random() * 40) + 20,
            end: Math.floor(Math.random() * 20) + 60,
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            playsinline: 1
        },
        events: {
            onReady: () => {
                const iframe = document.querySelector('#songClipPlayer iframe');
                if (iframe) iframe.style.background = '#000';
            },
            onError: () => loadNewSong()
        }
    });
}

function playClip() {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
        speak("Đoạn nhạc đang phát! Lắng nghe kỹ và đoán tên bài hát nào! Chúc may mắn nhé!");
    } else {
        showNotification("⏳ Đang tải nhạc, bấm lại sau vài giây nhé!");
        setTimeout(playClip, 1500);
    }
}

function submitAnswer() {
    const input = document.getElementById('answerInput').value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const correct = currentSong.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (input && (input.includes(correct) || correct.includes(input))) {
        score += 10;
        showNotification("✅ Đúng rồi! +10 điểm");
        new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3').play();
    } else {
        showNotification("❌ Sai rồi! Hãy thử lại nhé");
        new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3').play();
    }

    document.getElementById('score').textContent = score;
    questionNum++;
    document.getElementById('questionNum').textContent = questionNum;
    document.getElementById('answerInput').value = '';

    if (currentUser) {
        const data = JSON.parse(localStorage.getItem(currentUser.email));
        data.score = score;
        localStorage.setItem(currentUser.email, JSON.stringify(data));
    }

    loadNewSong();
}

function skipConfirm() {
    if (confirm("Bạn chắc chắn muốn SKIP? (-30 điểm)")) {
        score -= 30;
        document.getElementById('score').textContent = score;
        loadNewSong();
    }
}

function resetConfirm() {
    if (confirm("⚠️ NẾU BẤM OK BẠN SẼ BỊ XÓA SẠCH ĐIỂM ĐANG CÓ ⚠️ Bạn đồng ý chứ?")) {
        score = 0;
        document.getElementById('score').textContent = score;
    }
}

function restartConfirm() {
    if (confirm("Bạn muốn bắt đầu lại từ đầu?")) {
        startGame();
    }
}

function giveUpConfirm() {
    if (confirm("Từ bỏ câu này? (-10 điểm)")) {
        score -= 10;
        document.getElementById('score').textContent = score;
        loadNewSong();
    }
}

function stopConfirm() {
    if (confirm("🛑 Dừng hẳn trò chơi và trở về trang chủ?")) {
        backToHome();
    }
}

function backToHome() {
    showScreen('mainHome');
}

setInterval(() => {
    if (currentUser) {
        showNotification("⚠️ HỆ THỐNG ĐANG LƯU DATA CHO BẠN, CẤM RELOAD TRANG LẠI ⚠️");
        setTimeout(() => {
            const data = JSON.parse(localStorage.getItem(currentUser.email));
            data.score = score;
            localStorage.setItem(currentUser.email, JSON.stringify(data));
            showNotification("✅ ĐÃ LƯU DATA HOÀN TẤT ✅");
        }, 30000);
    }
}, 60000);

function showNotification(msg) {
    const notif = document.getElementById('notification');
    notif.textContent = msg;
    notif.style.display = 'block';
    setTimeout(() => notif.style.display = 'none', 4000);
}

document.getElementById('ttsToggle').addEventListener('change', function() {
    isTTS = this.checked;
});

function addPlayerDivs() {
    const musicPlayer = document.querySelector('.music-player');
    if (musicPlayer && !document.getElementById('songClipPlayer')) {
        musicPlayer.insertAdjacentHTML('beforeend', `
            <div id="songClipPlayer" style="margin:20px 0; border-radius:15px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.5); width:100%; background:#000; height:80px;"></div>
            <div id="bgMusicPlayer" style="display:none;"></div>
        `);
    }
}

window.onload = () => {
    addPlayerDivs();

    const savedEmail = localStorage.getItem('lastLoggedInUser');
    if (savedEmail) {
        const userData = localStorage.getItem(savedEmail);
        if (userData) {
            const user = JSON.parse(userData);
            currentUser = { email: savedEmail, name: user.name, score: user.score || 0 };
            showScreen('mainHome');
            document.getElementById('welcomeUser').textContent = `Xin chào ${user.name}!`;
            speak(`Chào mừng ${user.name} quay lại nhé!`);
            return;
        }
    }

    showScreen('mainMenu');
};
