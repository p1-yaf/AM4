const CLIENT_ID = "1546040930509791282";

const REDIRECT_URI =
    "https://p1-yaf.github.io/AM4/";


const DISCORD_AUTH_URL =
    "https://discord.com/oauth2/authorize" +

    "?client_id=" +
    CLIENT_ID +

    "&redirect_uri=" +
    encodeURIComponent(REDIRECT_URI) +

    "&response_type=token" +

    "&scope=identify%20email%20guilds";


const discordBtn =
    document.getElementById("discord-btn");


const toast =
    document.getElementById("toast");


/* ==============================
   Toast
============================== */

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


/* ==============================
   Discord User
============================== */

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

            return null;

        }


        return await response.json();

    } catch (error) {

        console.error(error);

        return null;

    }

}


/* ==============================
   Start
============================== */

async function start() {

    /*
        نشوف هل Discord رجعنا
        بتوكن جديد
    */

    const hash =
        window.location.hash.substring(1);


    const params =
        new URLSearchParams(hash);


    const newToken =
        params.get("access_token");


    /* ==========================
       LOGIN جديد
    ========================== */

    if (newToken) {

        const user =
            await getDiscordUser(newToken);


        if (!user) {

            showToast(
                "حصلت مشكلة في تسجيل الدخول."
            );

            return;

        }


        /*
            حفظ الحساب
        */

        localStorage.setItem(
            "am4_token",
            newToken
        );


        localStorage.setItem(
            "am4_user",
            JSON.stringify(user)
        );


        /*
            تنظيف الرابط
        */

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );


        /*
            🔥 التحويل للصفحة الجديدة
        */

        window.location.replace(
            "dashboard.html"
        );


        return;

    }


    /* ==========================
       SESSION قديمة
    ========================== */

    const savedToken =
        localStorage.getItem(
            "am4_token"
        );


    if (!savedToken) {

        return;

    }


    const user =
        await getDiscordUser(
            savedToken
        );


    if (user) {

        localStorage.setItem(
            "am4_user",
            JSON.stringify(user)
        );


        /*
            🔥 يدخل Dashboard
            من غير Login تاني
        */

        window.location.replace(
            "dashboard.html"
        );

    } else {

        /*
            التوكن انتهى
        */

        localStorage.removeItem(
            "am4_token"
        );

        localStorage.removeItem(
            "am4_user"
        );

    }

}


/* ==============================
   Discord Button
============================== */

if (discordBtn) {

    discordBtn.addEventListener(
        "click",
        () => {

            discordBtn.disabled = true;


            const text =
                discordBtn.querySelector("b");


            if (text) {

                text.textContent =
                    "جاري فتح Discord...";

            }


            window.location.href =
                DISCORD_AUTH_URL;

        }
    );

}


/* تشغيل */

start();
