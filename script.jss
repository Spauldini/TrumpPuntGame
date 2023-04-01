const g = 9.81;
const trump = document.getElementById("trump");
const wall = document.getElementById("wall");
const angleInput = document.getElementById("angle");
const velocityInput = document.getElementById("velocity");
const kickButton = document.getElementById("kick");
const score = document.getElementById("score");

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function timeOfFlight(v0, theta) {
    return (2 * v0 * Math.sin(theta)) / g;
}

function calculateDistances(v0, theta, t) {
    const x = v0 * Math.cos(theta) * t;
    const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
    return { x, y };
}

function clearsWall(distances) {
    const wallX = wall.getBoundingClientRect().right;
    const wallHeight = wall.getBoundingClientRect().height;

    return distances.x > wallX && distances.y > wallHeight;
}

function animateMotion(distances) {
    const startX = trump.getBoundingClientRect().left;
    const startY = trump.getBoundingClientRect().bottom;
    const endX = startX + distances.x;
    const endY = startY + distances.y;
    const animationDuration = 2000
    const startTime = performance.now();

    function step(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = elapsedTime / animationDuration;

        if (progress < 1) {
            const currentX = startX + progress * distances.x;
            const currentY = startY + progress * distances.y - 0.5 * g * progress * progress * animationDuration;
            trump.style.transform = `translate(${currentX}px, ${currentY}px)`;
            requestAnimationFrame(step);
        } else {
            trump.style.transform = `translate(${startX}px, 0)`;
        }
    }

    requestAnimationFrame(step);
}

kickButton.addEventListener("click", () => {
    const theta = degToRad(angleInput.value);
    const v0 = velocityInput.value;
    const t = timeOfFlight(v0, theta);
    const distances = calculateDistances(v0, theta, t);

    if (clearsWall(distances)) {
        score.textContent = parseInt(score.textContent) + 1;
        animateMotion(distances);
    } else {
        alert("Failed to clear the wall. Adjust the angle and kick velocity.");
        trump.style.transform = `translate(0, 0)`;
    }
});
