const API = "https://discord.com/api/v10";

const token = localStorage.getItem("am4_token");

if (!token) {
    window.location.replace("index.html");
}

async function checkLogin() {
    if (!token) return;

    try {
        const response = await fetch(`${API}/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem("am4_token");
            localStorage.removeItem("am4_user");

            window.location.replace("index.html");
            return;
        }

        const user = await response.json();

        loadUser(user);

    } catch (error) {
        console.error(error);

        localStorage.removeItem("am4_token");
        localStorage.removeItem("am4_user");

        window.location.replace("index.html");
    }
}

function loadUser(user) {
    const name = user.global_name || user.username;

    const welcome = document.getElementById("welcomeName");
    const username = document.getElementById("username");
    const userId = document.getElementById("userId");
    const avatar = document.getElementById("avatar");

    if (welcome) {
        welcome.textContent = `أهلاً بيك يا ${name} 👋`;
    }

    if (username) {
        username.textContent = `@${user.username}`;
    }

    if (userId) {
        userId.textContent = user.id;
    }

    if (avatar) {
        if (user.avatar) {
            avatar.src =
                `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
        } else {
            avatar.src =
                `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator || 0) % 5}.png`;
        }
    }
}

function logout() {
    localStorage.removeItem("am4_token");
    localStorage.removeItem("am4_user");

    window.location.replace("index.html");
}

document.addEventListener("DOMContentLoaded", () => {
    checkLogin();

    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});
