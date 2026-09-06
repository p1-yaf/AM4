/* ==========================================
   AM4 SMP - Discord Login
========================================== */


/* Discord App */

const CLIENT_ID = "1546040930509791282";

const REDIRECT_URI = "https://p1-yaf.github.io/AM4/";


/* OAuth */

const DISCORD_AUTH_URL =
    "https://discord.com/api/oauth2/authorize" +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    "&response_type=token" +
    "&scope=identify%20email";


/* Elements */

const discordBtn = document.getElementById("discord-btn");

const loginSection =
    document.getElementById("login-section");

const userInfo =
    document.getElementById("user-info");

const userName =
    document.getElementById("user-name");

const userAvatar =
    document.getElementById("user-avatar");

const logoutBtn =
    document.getElementById("logout-btn");

const toast =
    document.getElementById("toast");

const toastText =
    document.getElementById("toast-text");


/* ==========================================
   Toast
========================================== */

function showToast(message) {

    toastText.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* ==========================================
   Discord Login
========================================== */

discordBtn.addEventListener("click", () => {

    discordBtn.disabled = true;

    discordBtn.style.opacity = "0.7";

    discordBtn.querySelector("span").textContent =
        "جاري فتح Discord...";

    window.location.href = DISCORD_AUTH_URL;
});


/* ==========================================
   Get Token From URL
========================================== */

function getTokenFromURL() {

    const hash =
        window.location.hash.substring(1);

    if (!hash) {
        return null;
    }

    const params =
        new URLSearchParams(hash);

    return params.get("access_token");
}


/* ==========================================
   Get Discord User
========================================== */

async function getDiscordUser(token) {

    try {

        const response =
            await fetch(
                "https://discord.com/api/users/@me",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Session expired"
            );

        }


        return await response.json();

    } catch (error) {

        console.error(error);

        return null;
    }
}


/* ==========================================
   Avatar
========================================== */

function getAvatar(user) {

    if (user.avatar) {

        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;

    }

    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator || 0) % 5}.png`;
}


/* ==========================================
   Show User
========================================== */

function showUser(user) {

    if (!user) return;


    userName.textContent =
        user.global_name ||
        user.username;


    userAvatar.src =
        getAvatar(user);


    loginSection.classList.add("hidden");

    userInfo.classList.remove("hidden");
}


/* ==========================================
   Save Session
========================================== */

function saveSession(user, token) {

    localStorage.setItem(
        "am4_user",
        JSON.stringify(user)
    );

    localStorage.setItem(
        "am4_token",
        token
    );
}


/* ==========================================
   Remove Session
========================================== */

function clearSession() {

    localStorage.removeItem("am4_user");

    localStorage.removeItem("am4_token");

}


/* ==========================================
   Handle Discord Redirect
========================================== */

async function handleRedirect() {

    const token =
        getTokenFromURL();


    if (!token) {
        return false;
    }


    /* شيل التوكن من الـURL */

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );


    const user =
        await getDiscordUser(token);


    if (!user) {

        clearSession();

        showToast(
            "حصلت مشكلة في تسجيل الدخول، جرب تاني."
        );

        return false;
    }


    saveSession(user, token);

    showUser(user);

    showToast(
        `أهلاً بيك يا ${user.global_name || user.username} 👋`
    );


    return true;
}


/* ==========================================
   Check Existing Session
========================================== */

async function checkSession() {

    const savedToken =
        localStorage.getItem("am4_token");

    const savedUser =
        localStorage.getItem("am4_user");


    /* مفيش جلسة */

    if (!savedToken || !savedUser) {

        return;
    }


    try {

        const user =
            await getDiscordUser(savedToken);


        /* التوكن لسه شغال */

        if (user) {

            saveSession(user, savedToken);

            showUser(user);

            return;
        }


    } catch (error) {

        console.error(error);

    }


    /* الجلسة انتهت */

    clearSession();

}


/* ==========================================
   Logout
========================================== */

logoutBtn.addEventListener(
    "click",
    () => {

        clearSession();


        userInfo.classList.add("hidden");

        loginSection.classList.remove("hidden");


        discordBtn.disabled = false;

        discordBtn.style.opacity = "1";

        discordBtn.querySelector("span").textContent =
            "تسجيل الدخول بـ Discord";


        showToast(
            "خرجت من حسابك بنجاح 👋"
        );

    }
);


/* ==========================================
   Start
========================================== */

async function start() {

    /*
        الأول نشوف هل Discord رجعنا
        من تسجيل الدخول ولا لأ
    */

    const loggedIn =
        await handleRedirect();


    /*
        لو مفيش Login جديد،
        نشوف الجلسة القديمة
    */

    if (!loggedIn) {

        await checkSession();

    }

}


start();
