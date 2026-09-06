// 🔑 استبدل هذه القيم بقيم تطبيقك
const CLIENT_ID = '1546040930509791282';
const REDIRECT_URI = 'https://p1-yaf.github.io/AM4/'; // رابط موقعك بالظبط
const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify%20email`;

// عناصر الصفحة
const discordBtn = document.getElementById('discord-btn');
const userInfoDiv = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const userAvatarImg = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');

// 🟢 التحقق من وجود توكن في الرابط (بعد تسجيل الدخول)
function handleRedirect() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
        fetchUserData(token);
        // ننظف الرابط عشان التوكن ميظهرش
        window.history.replaceState(null, '', window.location.pathname);
    }
}

// 🟢 جلب بيانات المستخدم من Discord
function fetchUserData(token) {
    fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        if (!res.ok) throw new Error('فشل في جلب البيانات');
        return res.json();
    })
    .then(user => {
        // خزن البيانات عشان تفضل مسجل
        localStorage.setItem('am4_user', JSON.stringify({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            email: user.email || 'غير متوفر'
        }));
        localStorage.setItem('am4_token', token);
        showUser(user);
    })
    .catch(err => {
        console.error('خطأ:', err);
        alert('حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى.');
    });
}

// 🟢 عرض بيانات المستخدم
function showUser(user) {
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';

    userAvatarImg.src = avatarUrl;
    userNameSpan.textContent = `${user.username}#${user.discriminator || '0'}`;
    
    // إخفاء زر الدخول وإظهار معلومات المستخدم
    document.querySelector('.login-box').style.display = 'none';
    userInfoDiv.style.display = 'flex';
}

// 🟢 التحقق من وجود جلسة نشطة
function checkSession() {
    const storedUser = localStorage.getItem('am4_user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        showUser(user);
    }
}

// 🟢 تسجيل الخروج
function logout() {
    localStorage.removeItem('am4_user');
    localStorage.removeItem('am4_token');
    userInfoDiv.style.display = 'none';
    document.querySelector('.login-box').style.display = 'block';
}

// 🟢 أحداث
discordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // نفتح نافذة Discord في تبويب جديد
    window.location.href = DISCORD_AUTH_URL;
});

logoutBtn.addEventListener('click', logout);

// 🚀 تشغيل
handleRedirect();
checkSession();
