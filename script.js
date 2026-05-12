const correctDay = 16;
const correctMonth = 2;

function createHearts() {
    const container = document.getElementById("heartsContainer");

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = (Math.random() * 3 + 3) + "s";

        container.appendChild(heart);
    }
}

function checkBirthday() {
    const day = parseInt(document.getElementById("day").value);
    const month = parseInt(document.getElementById("month").value);

    const error = document.getElementById("errorMessage");

    if (day === correctDay && month === correctMonth) {
        window.location.href = "https://mosev1474.github.io/SOFTY/";
    } else {
        error.innerText = "اي يحسونه نسيتي وله اي 🤨";
    }
}

window.onload = () => {
    createHearts();

    setTimeout(() => {
        document.getElementById("loadingSpinner").style.display = "none";
    }, 1000);
};
