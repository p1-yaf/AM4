/* =====================================
   AM4 SMP - SERVER PAGE
===================================== */

/* =========================
   LOGIN CHECK
========================= */

const token = localStorage.getItem("am4_token");

if (!token) {
    window.location.replace("index.html");
}


/* =========================
   MENU ELEMENTS
========================= */

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");


/* =========================
   OPEN MENU
========================= */

if (menuBtn) {
    menuBtn.addEventListener("click", () => {

        if (!sideMenu || !overlay) return;

        sideMenu.classList.add("active");
        overlay.classList.add("active");

        document.body.style.overflow = "hidden";
    });
}


/* =========================
   CLOSE MENU
========================= */

function closeSideMenu() {

    if (sideMenu) {
        sideMenu.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    document.body.style.overflow = "";
}


/* Close button */

if (closeMenu) {
    closeMenu.addEventListener("click", closeSideMenu);
}


/* Click outside */

if (overlay) {
    overlay.addEventListener("click", closeSideMenu);
}


/* =========================
   MENU LINKS
========================= */

document.querySelectorAll(".menu-links a").forEach(link => {

    link.addEventListener("click", () => {
        closeSideMenu();
    });

});


/* =========================
   COPY FUNCTION
========================= */

async function copyText(elementId, button) {

    const element = document.getElementById(elementId);

    if (!element || !button) {
        return;
    }

    const text = element.textContent.trim();

    try {

        await navigator.clipboard.writeText(text);

        const oldText = button.textContent;

        button.textContent = "تم ✓";

        button.style.color = "#22e58a";

        setTimeout(() => {

            button.textContent = oldText;

            button.style.color = "";

        }, 1500);

    } catch (error) {

        /* Fallback for older browsers */

        try {

            const textarea = document.createElement("textarea");

            textarea.value = text;

            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            document.execCommand("copy");

            textarea.remove();

            const oldText = button.textContent;

            button.textContent = "تم ✓";

            setTimeout(() => {
                button.textContent = oldText;
            }, 1500);

        } catch (fallbackError) {

            console.error(
                "AM4 Copy Error:",
                fallbackError
            );

        }

    }
}
