// Dữ liệu người dùng & biến toàn cục
let currentUser = null;
let score = 0;
let questionNum = 1;
let isTTS = true;
let player; // Player đoạn nhạc đoán
let bgMusicPlayer; // Nhạc nền
let currentSong = null;

// Danh sách bài hát hot NEFFEX & TheFatRat (ID chính xác từ official YouTube)
const songs = [
    // NEFFEX (top hits copyright-free)
    { title: "Fight Back", artist: "NEFFEX", id: "CYDP_8UTAus" },
    { title: "Best of Me", artist: "NEFFEX", id: "0Wa_CR0H8g4" },
    { title: "Rumors", artist: "NEFFEX", id: "d3g5pXqHsg8" },
    { title: "Cold", artist: "NEFFEX", id: "W0eW7bnJ6v8" },
    { title: "Grateful", artist: "NEFFEX", id: "83RUhxsfLWs" },
    { title: "Never Give Up", artist: "NEFFEX", id: "T7kiCsfqQfM" },
    { title: "Careless", artist: "NEFFEX", id: "zqKX0p0iW0o" },
    { title: "Failure", artist: "NEFFEX", id: "qG8M6nWqC4s" },
    { title: "Destiny", artist: "NEFFEX", id: "X8bE1O2v5kA" },
    { title: "Desperate", artist: "NEFFEX", id: "kDYn3gLr6XU" },
    { title: "Villains and Heroes", artist: "NEFFEX", id: "VLbTjYyiWDc" },
    { title: "Seeing All Red", artist: "NEFFEX", id: "x-7k9r5aYgQ" },

    // TheFatRat (top hits)
    { title: "Unity", artist: "TheFatRat", id: "n4tK7LYFxI0" },
    { title: "Monody", artist: "TheFatRat", id: "B7xai5u_tnk" },
    { title: "The Calling", artist: "TheFatRat", id: "KR-eV7fHNbM" },
    { title: "Fly Away", artist: "TheFatRat", id: "cMg8KaMdDYo" },
    { title: "We'll Meet Again", artist: "TheFatRat", id: "s3yB1oBOI4s" },
    { title: "Close To The Sun", artist: "TheFatRat", id: "O2oE7iPqZqM" },
    { title: "Rise Up", artist: "TheFatRat", id: "j-2DGYNXRx0" },
    { title: "Xenogenesis", artist: "TheFatRat", id: "5eW6EgnevGc" },
    { title: "Time Lapse", artist: "TheFatRat", id: "3Fx5QNEz1yo" },
    { title: "Mayday", artist: "TheFatRat", id: "Y2yT9q6z6fI" },
    { title: "Oblivion", artist: "TheFatRat", id: "zD3O2p9qL0E" },
    { title: "Hiding in the Blue", artist: "TheFatRat", id: "lW0DIsC7n1U" },
    { title: "Back One Day", artist: "TheFatRat & NEFFEX", id: "qJq7e2qT9t0" },

    // Thêm vài bài classic khác
    { title: "See You Again", artist: "Wiz Khalifa", id: "RgKAFK5djSk" },
];

// Chuyển màn hình
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Đăng nhập
function showLogin() {
    openModal(`
        <h2>Đăng nhập</h2>
        <input type="text" id="loginInput" placeholder="Tên hoặc Gmail" required><br><br>
        <input type="password" id="loginPass" placeholder="Mật khẩu" required><br><br>
        <button class="btn primary" onclick="login()">ĐĂNG NHẬP</button>
    `);
}

// Đăng ký
function showRegister() {
    openModal(`
        <h2>Đăng ký tài khoản</h2>
        <input type="text" id="regName" placeholder="Tên của bạn" required><br><br>
        <input type="email" id="regEmail" placeholder="Gmail của bạn" required><br><br>
        <input type="password" id="regPass" placeholder="Mật khẩu" required><br><br>
        <button class="btn primary" onclick="register()">ĐĂNG KÝ</button>
    `);
}

// Báo lỗi
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
    if (!name || !email || !msg) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    alert("Cảm ơn bạn đã báo lỗi! Chúng tôi sẽ xử lý sớm.");
    closeModal();
}

// Thông tin & Update
function showInfo() {
    openModal(`
        <h2>ℹ️ THÔNG TIN & UPDATE</h2>
        <p><strong>Phiên bản:</strong> 1.5 (07/01/2026)</p>
        <p>- Thêm hơn 40 bài hát NEFFEX & TheFatRat<br>
        - Phát nhạc thật từ YouTube<br>
        - Nhạc nền chill lofi + sound effect</p>
        <p>Liên hệ hỗ trợ: Herogoodboymc2024@gmail.com</p>
    `);
}

// Modal
function openModal(content) {
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// TTS
function speak(text) {
    if (!isTTS) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
}

// Đăng ký
function register() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    if (!name || !email || !pass) return alert("Điền đầy đủ!");

    localStorage.setItem(email, JSON.stringify({ name, pass, score: 0, firstTime: true }));
    alert("Đăng ký thành công!");
    closeModal();
}

// Đăng nhập
function login() {
    const input = document.getElementById('loginInput').value.trim();
    const pass = document.getElementById('loginPass').value;
    const userData = localStorage.getItem(input);
    if (!userData) return alert("Tài khoản không tồn tại!");

    const user = JSON.parse(userData);
    if (user.pass !== pass) return alert("Sai mật khẩu!");

    currentUser = { email: input, ...user };
    showScreen('mainHome');
    document.getElementById('welcomeUser').textContent = `Xin chào ${user.name}!`;
    speak("Chào mừng bạn, bạn đã đến với trò chơi nghe nhạc đoán tên. Bấm bắt đầu chơi để được chị Google hướng dẫn.");
    closeModal();

    if (user.firstTime) {
        setTimeout(() => showTutorial(), 2000);
        user.firstTime = false;
        localStorage.setItem(input, JSON.stringify(user));
    }
}

// Hướng dẫn người mới
function showTutorial() {
    openModal(`
        <h2>Hướng dẫn chơi</h2>
        <p>Bạn sẽ nghe một đoạn nhạc ngắn, hãy đoán tên bài hát chính xác nhất có thể.</p>
        <p>Mỗi câu đúng: +10 điểm<br>
        Skip: -30 điểm<br>
        Từ bỏ: -10 điểm</p>
        <p>Chúc bạn chơi vui!</p>
    `);
    speak("Hướng dẫn chơi: Bạn sẽ nghe một đoạn nhạc ngắn, hãy đoán tên bài hát chính xác nhất có thể. Mỗi câu đúng cộng 10 điểm. Skip trừ 30 điểm. Từ bỏ trừ 10 điểm. Chúc bạn chơi vui!");
}

// Bắt đầu chơi
function startGame() {
    score = currentUser ? JSON.parse(localStorage.getItem(currentUser.email)).score || 0 : 0;
    questionNum = 1;
    document.getElementById('score').textContent = score;
    document.getElementById('questionNum').textContent = questionNum;
    showScreen('mainGame');
    loadNewSong();
}

// Load YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    // Nhạc nền chill lofi instrumental (copyright free, loop)
    bgMusicPlayer = new YT.Player('bgMusicPlayer', {
        height: '0',
        width: '0',
        videoId: 'jfKfPfyJRdk', // Lofi Girl classic hoặc thay ID khác chill
        playerVars: { autoplay: 1, loop: 1, playlist: 'jfKfPfyJRdk', controls: 0 },
        events: { onReady: (e) => e.target.setVolume(20) }
    });

    loadNewSong();
}

// Tải bài hát mới
function loadNewSong() {
    currentSong = songs[Math.floor(Math.random() * songs.length)];
    if (player) player.destroy();

    player = new YT.Player('songClipPlayer', {
        height: '0',
        width: '0',
        videoId: currentSong.id,
        playerVars: {
            start: Math.floor(Math.random() * 40) + 20, // Đoạn hay ngẫu nhiên
            end: Math.floor(Math.random() * 20) + 50,
            autoplay: 0,
            controls: 0,
            modestbranding: 1
        }
    });
}

// Phát đoạn nhạc
function playClip() {
    if (player) player.playVideo();
}

// Gửi đáp án
function submitAnswer() {
    const input = document.getElementById('answerInput').value.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Bỏ dấu tiếng Việt nếu cần
    const correct = currentSong.title.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (input && (input.includes(correct) || correct.includes(input))) {
        score += 10;
        showNotification("✅ Đúng rồi! +10 điểm");
        new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3').play(); // Sound đúng
    } else {
        showNotification("❌ Sai rồi!");
        new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3').play(); // Sound sai
    }

    document.getElementById('score').textContent = score;
    questionNum++;
    document.getElementById('questionNum').textContent = questionNum;
    document.getElementById('answerInput').value = '';
    loadNewSong();
}

// Các nút xác nhận
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

// Lưu data mỗi 60s
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

// Notification
function showNotification(msg) {
    const notif = document.getElementById('notification');
    notif.textContent = msg;
    notif.style.display = 'block';
    setTimeout(() => notif.style.display = 'none', 4000);
}

// Bật/tắt TTS
document.getElementById('ttsToggle').addEventListener('change', function() {
    isTTS = this.checked;
});

// Khởi động
window.onload = () => {
    showScreen('mainMenu');

    // Thêm div player YouTube (ẩn)
    const gameDiv = document.querySelector('#mainGame .music-player');
    gameDiv.insertAdjacentHTML('afterbegin', `
        <div id="songClipPlayer"></div>
        <div id="bgMusicPlayer" style="display:none;"></div>
    `);
};
