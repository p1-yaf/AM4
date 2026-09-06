/* =========================================
   AM4 SMP DASHBOARD
========================================= */


/* اسم السيرفر */

const GUILD_NAME = "AM4 SMP";


/*
    لو تعرف ID سيرفر Discord
    حطه هنا.

    مثال:

    const GUILD_ID = "123456789";

*/

const GUILD_ID = "";


/* =========================================
   الأخبار
========================================= */

const NEWS = [

    {
        icon: "📢",

        title: "AM4 SMP جاهز ليك",

        text:
            "السيرفر فاتح ومستنيك تدخل تبدأ مغامرتك.",

        date:
            "06 سبتمبر 2026"
    },


    {
        icon: "🔥",

        title: "آخر أخبار AM4",

        text:
            "خليك متابع الصفحة دي عشان كل جديد هينزل هنا.",

        date:
            "06 سبتمبر 2026"
    },


    {
        icon: "⚡",

        title: "تحديثات مستمرة",

        text:
            "بنشتغل على السيرفر عشان التجربة تفضل أحسن كل يوم.",

        date:
            "قريباً"
    }

];


/* =========================================
   Session
========================================= */

const token =
    localStorage.getItem("am4_token");


const savedUser =
    JSON.parse(
        localStorage.getItem("am4_user") || "null"
    );


/*
    لو مش مسجل
    يرجعه للـLogin
*/

if (!token || !savedUser) {

    window.location.replace(
        "index.html"
    );

}


/* =========================================
   Avatar
========================================= */

function getAvatar(user) {

    if (user.avatar) {

        return (
            "https://cdn.discordapp.com/avatars/" +
            user.id +
            "/" +
            user.avatar +
            ".png?size=256"
        );

    }


    return (
        "https://cdn.discordapp.com/embed/avatars/" +
        (Number(user.discriminator || 0) % 5) +
        ".png"
    );

}


/* =========================================
   User
========================================= */

function renderUser(user) {

    const name =
        user.global_name ||
        user.username ||
        "لاعب";


    document.getElementById(
        "welcome-name"
    ).textContent = name;


    document.getElementById(
        "username"
    ).textContent = name;


    document.getElementById(
        "discordname"
    ).textContent =
        user.username || "—";


    document.getElementById(
        "userid"
    ).textContent =
        "ID: " + user.id;


    document.getElementById(
        "avatar"
    ).src =
        getAvatar(user);

}


/* =========================================
   News
========================================= */

function renderNews() {

    const newsList =
        document.getElementById(
            "news-list"
        );


    newsList.innerHTML =
        NEWS.map(news => {

            return `

                <article class="news-card">

                    <div class="news-icon">
                        ${news.icon}
                    </div>

                    <h3>
                        ${news.title}
                    </h3>

                    <p>
                        ${news.text}
                    </p>

                    <time>
                        ${news.date}
                    </time>

                </article>

            `;

        }).join("");

}


/* =========================================
   Discord API
========================================= */

async function discordAPI(path) {

    const response =
        await fetch(
            "https://discord.com/api/v10" +
            path,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            response.status
        );

    }


    return response.json();

}


/* =========================================
   Membership
========================================= */

async function getMembership() {

    const memberBox =
        document.getElementById(
            "member-box"
        );


    const role =
        document.getElementById(
            "role"
        );


    try {

        let guildId =
            GUILD_ID;


        /*
            لو مفيش Guild ID
            نحاول نلاقي AM4 من السيرفرات
        */

        if (!guildId) {

            const guilds =
                await discordAPI(
                    "/users/@me/guilds"
                );


            const am4 =
                guilds.find(
                    guild =>
                        guild.name
                            .toLowerCase()
                            .includes("am4")
                );


            if (am4) {

                guildId =
                    am4.id;

            }

        }


        /*
            AM4 مش موجود
        */

        if (!guildId) {

            memberBox.className =
                "member-box no";


            memberBox.textContent =
                "أنت مش موجود في سيرفر AM4 حالياً.";


            role.textContent =
                "مش عضو";


            return;

        }


        /*
            محاولة قراءة العضوية
        */

        const member =
            await discordAPI(
                `/users/@me/guilds/${guildId}/member`
            );


        memberBox.className =
            "member-box ok";


        memberBox.textContent =
            "أنت عضو في سيرفر AM4 ❤️";


        /*
            Discord OAuth مش بيرجع
            أسماء الرتب مباشرة.

            هنظهر إن عنده رتبة،
            ولما نعمل Backend للـBot
            نقدر نجيب الاسم الحقيقي.
        */

        if (
            member.roles &&
            member.roles.length > 0
        ) {

            role.textContent =
                "عضو في AM4";

        } else {

            role.textContent =
                "@everyone";

        }


    } catch (error) {

        console.error(
            "Membership error:",
            error
        );


        memberBox.className =
            "member-box no";


        memberBox.textContent =
            "مش قادرين نجيب بيانات عضويتك دلوقتي.";


        role.textContent =
            "غير متاحة";

    }

}


/* =========================================
   Logout
========================================= */

document
    .getElementById("logout")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "am4_token"
            );


            localStorage.removeItem(
                "am4_user"
            );


            window.location.replace(
                "index.html"
            );

        }
    );


/* =========================================
   Start
========================================= */

renderUser(
    savedUser
);


renderNews();


getMembership();
