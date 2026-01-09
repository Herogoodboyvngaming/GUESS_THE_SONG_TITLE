let currentUser = null;
let score = 0;
let questionNum = 1;
let isTTS = true;
let player;
let bgMusicPlayer;
let currentSong = null;
let loginAttempts = 0;
let isOnline = navigator.onLine;
let commandsEnabled = true;

// Admin credentials (1 panel duy nhất)
const ADMIN_USERNAME = "herogoodboyvngaming";
const ADMIN_PASSWORD = "Nguyen2009";

// 3 Gmail owner random gửi code cho admin panel
const OWNER_EMAILS = [
    "herogoodboymc2024@gmail.com",
    "herogoodboyvnff2024@gmail.com",
    "herogoodboymc@gmail.com"
];

let adminList = [];
let verificationCode = null;
let verificationTime = null;
let verificationType = ''; // 'register', 'login', 'admin'
let verificationEmail = '';
const VERIFICATION_TIMEOUT = 15 * 60 * 1000; // 15 phút

// Load adminList từ localStorage
function loadAdminList() {
    const saved = localStorage.getItem('gameAdminList');
    if (saved) {
        adminList = JSON.parse(saved);
    } else {
        adminList = ["herogoodboymc@gmail.com"];
        localStorage.setItem('gameAdminList', JSON.stringify(adminList));
    }
}

// Kiểm tra admin
function isAdmin() {
    return currentUser && adminList.includes(currentUser.email);
}

// Danh sách bài hát FULL
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
    { title: "My Way", artist: "NEFFEX", id: "a6j5lbt6OLQ" },
    { title: "Statement", artist: "NEFFEX", id: "WeiM_vffWAw" },

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

    { title: "Faded", artist: "Alan Walker", id: "60ItHLz5WEA" },
    { title: "Alone", artist: "Alan Walker", id: "1-xGerv5FOk" },
    { title: "Sing Me to Sleep", artist: "Alan Walker", id: "TCBBBw1j4eA" },
    { title: "The Spectre", artist: "Alan Walker", id: "w7d0k9G4jnU" },
    { title: "Lily", artist: "Alan Walker, K-391 & Emelie Hollow", id: "hdonNbzHHXE" },
    { title: "Darkside", artist: "Alan Walker", id: "M-P4QBt-FWw" },
    { title: "Ignite", artist: "K-391 & Alan Walker", id: "Az-mGR-CehY" },
    { title: "On My Way", artist: "Alan Walker ft. Sabrina Carpenter & Farruko", id: "p-9j5w0Z3M" },
    { title: "Fire!", artist: "Alan Walker ft. YUQI & JVKE", id: "rO1ANdXvdTg" },

    { title: "Hãy Trao Cho Anh", artist: "Sơn Tùng M-TP ft. Snoop Dogg", id: "knW7-x7Y7RE" },
    { title: "Muộn Rồi Mà Sao Còn", artist: "Sơn Tùng M-TP", id: "xypzmu5mMPY" },
    { title: "Chạy Ngay Đi", artist: "Sơn Tùng M-TP", id: "32sYGCOYJUM" },
    { title: "Nơi Này Có Anh", artist: "Sơn Tùng M-TP", id: "FN7ALfpGxiI" },
    { title: "Lạc Trôi", artist: "Sơn Tùng M-TP", id: "_2l6M3G1GDc" },
    { title: "Chúng Ta Của Hiện Tại", artist: "Sơn Tùng M-TP", id: "psZ1g9fMfeo" },
    { title: "Có Chắc Yêu Là Đây", artist: "Sơn Tùng M-TP", id: "rQuy4aZxTKE" },
    { title: "Đừng Làm Trái Tim Anh Đau", artist: "Sơn Tùng M-TP", id: "abPmZCZZrFA" },
    { title: "Buông Đôi Tay Nhau Ra", artist: "Sơn Tùng M-TP", id: "9g3BgM4uI0g" },
    { title: "Âm Thầm Bên Em", artist: "Sơn Tùng M-TP", id: "0W_wY0sZgtQ" },

    { title: "See You Again", artist: "Wiz Khalifa", id: "RgKAFK5djSk" },
];

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showLogin() {
    loginAttempts = 0;
    openModal(`
        <h2>Đăng nhập</h2>
        <input type="text" id="loginInput" placeholder="Tên hoặc Gmail" required><br><br>
        <input type="password" id="loginPass" placeholder="Mật khẩu" required><br><br>
        <button class="btn primary" onclick="requestLoginCode()">GỬI MÃ VERIFICATION</button>
        <input type="text" id="verificationCode" placeholder="Nhập mã 4 số" style="display:none; margin-top:15px;"><br><br>
        <button class="btn danger" id="verifyLoginBtn" style="display:none;" onclick="verifyLogin()">XÁC NHẬN & ĐĂNG NHẬP</button>
    `);
}

function showRegister() {
    openModal(`
        <h2>Đăng ký tài khoản</h2>
        <input type="text" id="regName" placeholder="Tên của bạn" required><br><br>
        <input type="email" id="regEmail" placeholder="Gmail của bạn" required><br><br>
        <input type="password" id="regPass" placeholder="Mật khẩu" required><br><br>
        <button class="btn primary" onclick="requestRegisterCode()">GỬI MÃ VERIFICATION</button>
        <input type="text" id="verificationCode" placeholder="Nhập mã 4 số" style="display:none; margin-top:15px;"><br><br>
        <button class="btn danger" id="verifyRegisterBtn" style="display:none;" onclick="verifyRegister()">XÁC NHẬN & ĐĂNG KÝ</button>
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
        <p><strong>Phiên bản 4.2 (09/01/2026)</p>
        <p>- Verification code 4 số tự động gửi vào Gmail khi bấm GỬI MÃ<br>
        - Code hết hạn sau 15 phút<br>
        - Đăng ký/Đăng nhập/Admin Panel đều cần code hợp lệ</p>
        <p>Liên hệ hỗ trợ: Herogoodboymc2024@gmail.com</p>
    `);
}

function openModal(content) {
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    verificationCode = null;
    verificationTime = null;
    verificationType = '';
    verificationEmail = '';
}

function speak(text) {
    if (!isTTS) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
}

function generateUserID() {
    return "USER#" + Math.floor(Math.random() * 9000 + 1000);
}

function updateProfile() {
    if (currentUser) {
        document.getElementById('userProfile').textContent = `Tên: ${currentUser.name} | ID: ${currentUser.id}`;
    }
}

function requestRegisterCode() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;

    if (!name || !email || !pass) return alert("Điền đầy đủ thông tin!");
    if (!email.includes('@gmail.com')) return alert("Chỉ chấp nhận Gmail!");

    verificationType = 'register';
    verificationEmail = email;
    verificationCode = Math.floor(1000 + Math.random() * 9000);
    verificationTime = Date.now();
    console.log("Code gửi đến:", email, "Code:", verificationCode, "Thời gian:", new Date(verificationTime).toLocaleString());
    alert(`Mã verification 4 số đã được gửi tự động đến Gmail ${email} của bạn! (Test: ${verificationCode})`);
    document.getElementById('verificationCode').style.display = 'block';
    document.getElementById('verifyRegisterBtn').style.display = 'block';
}

function verifyRegister() {
    const inputCode = document.getElementById('verificationCode').value.trim();
    if (!inputCode) return alert("Bắt buộc nhập verification code!");
    if (inputCode !== verificationCode.toString()) return alert("Mã verification sai!");

    const elapsed = Date.now() - verificationTime;
    if (elapsed > VERIFICATION_TIMEOUT) {
        verificationCode = null;
        verificationTime = null;
        return alert("Mã verification đã hết hạn! Vui lòng gửi mã mới.");
    }

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;

    const newID = generateUserID();
    localStorage.setItem(email, JSON.stringify({ name, pass, score: 0, firstTime: true, id: newID }));
    alert("Đăng ký thành công! ID cố định của bạn: " + newID);
    closeModal();
}

function requestLoginCode() {
    const input = document.getElementById('loginInput').value.trim();
    const pass = document.getElementById('loginPass').value;

    if (!input || !pass) return alert("Điền đầy đủ!");

    const userData = localStorage.getItem(input);
    if (!userData) return alert("Tài khoản không tồn tại!");

    const user = JSON.parse(userData);
    if (user.pass !== pass) return alert("Sai mật khẩu!");

    verificationType = 'login';
    verificationEmail = input;
    verificationCode = Math.floor(1000 + Math.random() * 9000);
    verificationTime = Date.now();
    console.log("Code gửi đến:", input, "Code:", verificationCode, "Thời gian:", new Date(verificationTime).toLocaleString());
    alert(`Mã verification 4 số đã được gửi tự động đến Gmail ${input} của bạn! (Test: ${verificationCode})`);
    document.getElementById('verificationCode').style.display = 'block';
    document.getElementById('verifyLoginBtn').style.display = 'block';
}

function verifyLogin() {
    const inputCode = document.getElementById('verificationCode').value.trim();
    if (!inputCode) return alert("Bắt buộc nhập verification code!");
    if (inputCode !== verificationCode.toString()) return alert("Mã verification sai!");

    const elapsed = Date.now() - verificationTime;
    if (elapsed > VERIFICATION_TIMEOUT) {
        verificationCode = null;
        verificationTime = null;
        return alert("Mã verification đã hết hạn! Vui lòng gửi mã mới.");
    }

    const input = document.getElementById('loginInput').value.trim();
    const userData = localStorage.getItem(input);
    const user = JSON.parse(userData);

    currentUser = { email: input, name: user.name, score: user.score || 0, id: user.id };
    localStorage.setItem('lastLoggedInUser', input);
    showScreen('mainHome');
    document.getElementById('welcomeUser').textContent = `Xin chào ${user.name}!`;
    updateProfile();
    speak(`Chào mừng ${user.name} quay lại trò chơi nghe nhạc đoán tên bài hát nhé!`);
    closeModal();

    if (user.firstTime) {
        setTimeout(showTutorial, 2000);
        user.firstTime = false;
        localStorage.setItem(input, JSON.stringify(user));
    }
}

function showAdminLogin() {
    openModal(`
        <h2>🔧 ADMIN PANEL</h2>
        <p style="color:#ff6b6b; font-weight:bold;">Này chỉ dành cho admin người thường không thể truy cập vào được!</p>
        <input type="text" id="adminUser" placeholder="Tên đăng nhập admin" required><br><br>
        <input type="password" id="adminPass" placeholder="Mật khẩu admin" required><br><br>
        <button class="btn primary" onclick="requestAdminCode()">GỬI MÃ VERIFICATION</button>
        <input type="text" id="verificationCode" placeholder="Nhập mã 4 số" style="display:none; margin-top:15px;"><br><br>
        <button class="btn danger" id="verifyAdminBtn" style="display:none;" onclick="verifyAdmin()">XÁC NHẬN & VÀO PANEL</button>
    `);
}

function requestAdminCode() {
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value;

    if (user !== ADMIN_USERNAME || pass !== ADMIN_PASSWORD) return alert("Sai TK/MK admin!");

    verificationType = 'admin';
    verificationCode = Math.floor(1000 + Math.random() * 9000);
    verificationTime = Date.now();
    const randomEmail = OWNER_EMAILS[Math.floor(Math.random() * OWNER_EMAILS.length)];
    console.log("Code gửi đến Owner:", randomEmail, "Code:", verificationCode, "Thời gian:", new Date(verificationTime).toLocaleString());
    alert(`Mã verification 4 số đã được gửi tự động đến Gmail Owner (${randomEmail})! (Test: ${verificationCode})`);
    document.getElementById('verificationCode').style.display = 'block';
    document.getElementById('verifyAdminBtn').style.display = 'block';
}

function verifyAdmin() {
    const inputCode = document.getElementById('verificationCode').value.trim();
    if (!inputCode) return alert("Bắt buộc nhập verification code!");
    if (inputCode !== verificationCode.toString()) return alert("Mã verification sai!");

    const elapsed = Date.now() - verificationTime;
    if (elapsed > VERIFICATION_TIMEOUT) {
        verificationCode = null;
        verificationTime = null;
        return alert("Mã verification đã hết hạn! Vui lòng gửi mã mới.");
    }

    closeModal();
    showAdminPanel();
}

function showAdminPanel() {
    openModal(`
        <h2>🔧 ADMIN PANEL</h2>
        <p>Chào mừng Admin <strong>${currentUser.name || currentUser.email}</strong>!</p>
        <hr>
        <h3>1. ADD ADMIN MỚI</h3>
        <input type="text" id="newAdminID" placeholder="Nhập Gmail hoặc ID người dùng" style="width:100%; padding:12px; border-radius:50px; border:none; margin-bottom:10px;">
        <button class="btn primary" onclick="addNewAdmin()">ADD ADMIN</button>
        <hr>
        <h3>2. GỬI LỆNH ADMIN</h3>
        <input type="text" id="adminCommandInput" placeholder="Gõ lệnh (vd: /addpoint 100, /set 999, /clear...)" style="width:100%; padding:12px; border-radius:50px; border:none; margin-bottom:10px;">
        <button class="btn danger" onclick="executeAdminCommand()">GỬI LỆNH</button>
        <hr>
        <p><strong>Lệnh hiện có:</strong></p>
        <ul style="text-align:left;">
            <li>/addpoint [số] → cộng điểm</li>
            <li>/removepoint [số] → trừ điểm</li>
            <li>/set [số] → set điểm chính xác</li>
            <li>/clear → xóa sạch điểm</li>
            <li>/ban [ID] → ban người dùng</li>
            <li>/help → xem lệnh</li>
        </ul>
        <button class="btn secondary" onclick="closeModal()">ĐÓNG PANEL</button>
    `);
}

function addNewAdmin() {
    const newAdmin = document.getElementById('newAdminID').value.trim();
    if (!newAdmin) {
        alert("Vui lòng nhập Gmail hoặc ID người dùng!");
        return;
    }
    if (adminList.includes(newAdmin)) {
        alert("Người này đã là admin rồi!");
        return;
    }
    adminList.push(newAdmin);
    localStorage.setItem('gameAdminList', JSON.stringify(adminList));
    alert(`Đã cấp quyền ADMIN cho ${newAdmin} thành công!!`);
    showNotification(`✅ Đã add admin mới: ${newAdmin}`);
    document.getElementById('newAdminID').value = '';
    showAdminPanel();
}

function executeAdminCommand() {
    const input = document.getElementById('adminCommandInput').value.trim();
    if (!input) {
        showNotification("❌ Bạn chưa nhập lệnh!");
        return;
    }
    if (input.startsWith("/") && commandsEnabled) {
        handleAdminCommand(input);
        document.getElementById('adminCommandInput').value = '';
    } else {
        showNotification("❌ Lệnh không hợp lệ!");
    }
}

function handleAdminCommand(cmd) {
    const parts = cmd.slice(1).split(" ");
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    if (currentUser.email === "herogoodboymc@gmail.com" && command === "ban") {
        showNotification("❌ Không thể ban Owner!");
        return;
    }

    if (command === "addpoint") {
        const points = parseInt(arg);
        if (!isNaN(points) && points > 0) {
            score += points;
            document.getElementById('score').textContent = score;
            if (currentUser) {
                const data = JSON.parse(localStorage.getItem(currentUser.email));
                data.score = score;
                localStorage.setItem(currentUser.email, JSON.stringify(data));
            }
            showNotification(`✅ Admin cộng +${points} điểm!`);
        } else {
            showNotification("❌ Sai cú pháp! /addpoint [số điểm > 0]");
        }
    } else if (command === "removepoint") {
        const points = parseInt(arg);
        if (!isNaN(points) && points > 0) {
            score = Math.max(0, score - points);
            document.getElementById('score').textContent = score;
            if (currentUser) {
                const data = JSON.parse(localStorage.getItem(currentUser.email));
                data.score = score;
                localStorage.setItem(currentUser.email, JSON.stringify(data));
            }
            showNotification(`❌ Admin trừ -${points} điểm!`);
        } else {
            showNotification("❌ Sai cú pháp! /removepoint [số điểm > 0]");
        }
    } else if (command === "set") {
        const points = parseInt(arg);
        if (!isNaN(points) && points >= 0) {
            score = points;
            document.getElementById('score').textContent = score;
            if (currentUser) {
                const data = JSON.parse(localStorage.getItem(currentUser.email));
                data.score = score;
                localStorage.setItem(currentUser.email, JSON.stringify(data));
            }
            showNotification(`✅ Admin set điểm thành ${points}!`);
        } else {
            showNotification("❌ Sai cú pháp! /set [số điểm ≥ 0]");
        }
    } else if (command === "clear") {
        score = 0;
        document.getElementById('score').textContent = score;
        if (currentUser) {
            const data = JSON.parse(localStorage.getItem(currentUser.email));
            data.score = 0;
            localStorage.setItem(currentUser.email, JSON.stringify(data));
        }
        showNotification("🗑️ Admin xóa sạch điểm về 0!");
    } else if (command === "ban") {
        if (arg) {
            showNotification(`🔨 Đã BAN người dùng ${arg}!`);
        } else {
            showNotification("❌ Sai cú pháp! /ban [ID]");
        }
    } else if (command === "help") {
        showNotification("Lệnh admin: /addpoint [số], /removepoint [số], /set [số], /clear, /ban [ID], /help");
    } else {
        showNotification("❌ Lệnh không tồn tại! Gõ /help");
    }
}

function deleteAccountConfirm() {
    if (confirm("Bạn chắc chắn muốn xóa tài khoản của mình chứ, một khi xóa là không thể khôi phục bạn đồng ý chứ?")) {
        openModal(`
            <h2>🔴 XÁC NHẬN XÓA TÀI KHOẢN</h2>
            <p style="color:#ff6b6b; font-weight:bold; margin-bottom:20px;">
                Đây là bước cuối! Tài khoản sẽ bị xóa vĩnh viễn nếu mật khẩu đúng.
            </p>
            <input type="password" id="deletePassConfirm" placeholder="Nhập mật khẩu để xác nhận xóa" required style="width:100%; padding:12px; border-radius:50px; border:none; margin-bottom:20px;">
            <button class="btn danger" onclick="finalDeleteAccount()">XÓA VĨNH VIỄN</button>
            <button class="btn secondary" onclick="closeModal()">Hủy bỏ</button>
        `);
        setTimeout(() => document.getElementById('deletePassConfirm').focus(), 300);
    }
}

function finalDeleteAccount() {
    const inputPass = document.getElementById('deletePassConfirm').value.trim();
    if (!inputPass) {
        alert("Vui lòng nhập mật khẩu!");
        return;
    }

    const userData = localStorage.getItem(currentUser.email);
    const user = JSON.parse(userData);

    if (inputPass !== user.pass) {
        alert("Sai mật khẩu! Tài khoản KHÔNG bị xóa. May quá huhu 😭");
        closeModal();
        return;
    }

    localStorage.removeItem(currentUser.email);
    localStorage.removeItem('lastLoggedInUser');
    currentUser = null;
    closeModal();
    showScreen('mainMenu');
    showNotification("❌ Tài khoản đã bị xóa vĩnh viễn!");
    speak("Tài khoản đã bị xóa hoàn toàn. Cảm ơn bạn đã chơi trò chơi của Nguyễn Chí Dự!");
}

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    bgMusicPlayer = new YT.Player('bgMusicPlayer', {
        height: '0',
        width: '0',
        videoId: 'jfKfPfyJRdk',
        playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: 'jfKfPfyJRdk',
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
            onReady: (e) => {
                e.target.setVolume(20);
                const iframe = document.querySelector('#bgMusicPlayer iframe');
                if (iframe) {
                    iframe.style.position = 'absolute';
                    iframe.style.left = '-100px';
                    iframe.style.top = '-100px';
                    iframe.style.opacity = '0';
                    iframe.style.pointerEvents = 'none';
                    iframe.style.width = '0px';
                    iframe.style.height = '0px';
                }
            }
        }
    });
    loadNewSong();
}

function loadNewSong() {
    currentSong = songs[Math.floor(Math.random() * songs.length)];
    if (player) player.destroy();

    player = new YT.Player('songClipPlayer', {
        height: '1',
        width: '1',
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
                if (iframe) {
                    iframe.style.position = 'absolute';
                    iframe.style.left = '-100px';
                    iframe.style.opacity = '0';
                    iframe.style.pointerEvents = 'none';
                }
            },
            onError: () => loadNewSong()
        }
    });
}

function playClip() {
    if (player && typeof player.playVideo === 'function') {
        player.setVolume(100);
        player.playVideo();
        speak("Đoạn nhạc đang phát! Lắng nghe kỹ và đoán tên bài hát nào! Chúc may mắn nhé!");
    } else {
        showNotification("⏳ Đang tải nhạc, bấm lại sau vài giây nhé!");
        setTimeout(playClip, 1500);
    }
}

function submitAnswer() {
    const input = document.getElementById('answerInput').value.trim();

    const normalizedInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedCorrect = currentSong.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (normalizedInput && (normalizedInput.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedInput))) {
        score += 10;
        showNotification("✅ Đúng rồi! +10 điểm");
        new Audio('https://www.myinstants.com/media/sounds/correct-answer-gameshow.mp3').play();
    } else {
        score = Math.max(0, score - 10);
        showNotification("❌ Sai rồi! -10 điểm");
        new Audio('https://www.myinstants.com/media/sounds/wrong-answer-gameshow.mp3').play();
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

function surrenderConfirm() {
    if (confirm("Bạn chắc chắn chịu thua? Sẽ hiện đáp án đúng và chuyển bài mới nhé!")) {
        showNotification(`Đáp án đúng là: "${currentSong.title}" của ${currentSong.artist}!`);
        loadNewSong();
    }
}

function skipConfirm() {
    if (score < 30) {
        showNotification("❌ Không đủ điểm để SKIP! (cần 30 điểm)");
        return;
    }
    if (confirm("Bạn chắc chắn muốn SKIP? (-30 điểm)")) {
        score = Math.max(0, score - 30);
        document.getElementById('score').textContent = score;
        loadNewSong();
    }
}

function giveUpConfirm() {
    if (score < 10) {
        showNotification("❌ Không đủ điểm để TỪ BỎ! (cần 10 điểm)");
        return;
    }
    if (confirm("Từ bỏ câu này? (-10 điểm)")) {
        score = Math.max(0, score - 10);
        document.getElementById('score').textContent = score;
        loadNewSong();
    }
}

function resetConfirm() {
    if (confirm("⚠️ XÓA SẠCH ĐIỂM? ⚠️")) {
        score = 0;
        document.getElementById('score').textContent = score;
    }
}

function restartConfirm() {
    if (confirm("Bắt đầu lại từ đầu?")) startGame();
}

function stopConfirm() {
    if (confirm("🛑 Dừng hẳn trò chơi?")) backToHome();
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
}, 300000);

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
            <div id="songClipPlayer" style="position:absolute; left:-100px; opacity:0; pointer-events:none;"></div>
            <div id="bgMusicPlayer" style="display:none;"></div>
        `);
    }
}

window.onload = () => {
    addPlayerDivs();
    loadAdminList();

    if (!navigator.onLine) {
        alert("Bạn cần kết nối internet để chơi game!");
    }

    const savedEmail = localStorage.getItem('lastLoggedInUser');
    if (savedEmail) {
        const userData = localStorage.getItem(savedEmail);
        if (userData) {
            const user = JSON.parse(userData);
            currentUser = { email: savedEmail, name: user.name, score: user.score || 0, id: user.id };
            showScreen('mainHome');
            document.getElementById('welcomeUser').textContent = `Xin chào ${user.name}!`;
            updateProfile();
            speak(`Chào mừng ${user.name} quay lại nhé!`);
            return;
        }
    }

    showScreen('mainMenu');
};
