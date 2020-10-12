// Rules Navigation button for Rules Modal
let rules = document.getElementById("rulesCard");

// Modal that displays/hides the rules to the user
let rulesModal = document.getElementById("rules");
// button for closing rules modal
let rulesSpan = document.getElementById("close");
// Boolean to hide/show rules
let rulesOpen = false;

// Modal that displays/hides when user's game ends
let modal = document.getElementById("endGame");
// button for closing or retrying after game ends
let closeSpan = document.getElementById("endSpan");
let retry = document.getElementById("retrySpan");

// Creates a 2D drawing panel
const canvas = document.getElementById('miniGame');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; // set drawing panel to browser viewing width
canvas.height = window.innerHeight; // set drawing panel to broswer viewing height

// (x,y) co-ordinates for canvas center
const center = { x: canvas.width / 2, y: canvas.height / 2 };

let playerImg = new Image();
window.onload = () => {
    playerImg = document.getElementById('playerImg');
};
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius
        this.color = color
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

}

class Projectile {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius
        this.color = color
        this.speed = speed
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.speed.x;
        this.y = this.y + this.speed.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius
        this.color = color
        this.speed = speed
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.speed.x;
        this.y = this.y + this.speed.y;
    }
}

// (x,y) co-ordinates for mouse
let mouse = {
    x: null,
    y: null
};
// updates mouse (x,y) co-ordinates
canvas.addEventListener('mousemove',
    (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

class Crosshair {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y,);
        ctx.lineTo(this.x - 10, this.y);
        ctx.moveTo(this.x, this.y + 10);
        ctx.lineTo(this.x, this.y - 10);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    update() {
        this.x = mouse.x;
        this.y = mouse.y;

        this.draw();
    }
}

// construct player in center of canvas
const player = new Player(center.x, center.y, 40, 'rgba(66,0,110, 1)');
// draw crosshair on mouse (x,y) co-ordinates
const crosshair = new Crosshair(mouse.x, mouse.y, 10, 'rgba(255,0,0,1)'); // #crosshair

// constructs an array to contain projectiles
const projectiles = [];
// constructs an array to contain enemies
const enemies = [];

// score of player at new game
let score = 0;
// display for player score
var finalScore = document.getElementById("score");

// current animation frame
let frame;

// spans enemy randomly around the edge of the canvas
function spawnEnemy() {
    setInterval(() => {
        const radius = Math.random() * (50 - 5) + 5;
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const rR = Math.random() * 255;
        const rG = Math.random() * 255;
        const rB = Math.random() * 255;

        const color = 'rgba(' + rR + ',' + rG + ',' + rB + ',1)';
        const angle = Math.atan2(center.y - y, center.x - x);
        const speed = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };

        enemies.push(new Enemy(x, y, radius, color, speed));
    }, 1000);
};

// animates the drawing pad 
function animate() {
    frame = requestAnimationFrame(animate);
    // clear canvas and draw player
    ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    // displays player score to user
    ctx.font = "30px Verdana";
    ctx.fillStyle = 'purple';
    ctx.fillText('Score: ' + score, 50, 50);

    // draw each projectile in array and update possition
    projectiles.forEach((projectile, i) => {
        projectile.update();

        // if projectile leaves canvas its removed from array
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(i, 1);
            }, 0);
        }
    });

    // draw each enemy in array and update possition
    enemies.forEach((enemy, i) => {
        enemy.update();
        // if enemy comes in contact with player stop animation and display end game modal
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < .1) {
            cancelAnimationFrame(frame);
            canvas.style.cursor = 'crosshair'; // #crosshair
            gameEnd();
        }

        // if a projectile hits enemy, reduce enemy size and update score
        projectiles.forEach((projectile, j) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < .1) {
                if (enemy.radius - 10 > 10) {
                    enemy.radius = enemy.radius / 2;
                    setTimeout(() => {
                        projectiles.splice(j, 1);
                        score++;
                    }, 0);
                } else {
                    setTimeout(() => {
                        enemies.splice(i, 1);
                        projectiles.splice(j, 1);
                        score += 10;
                    }, 0);
                }

            };
        });
    });
    // keep crosshair on canvas
    crosshair.update(); // #crosshair
};

// on mouse click or screen tap draw projectiles from center to mouse(x,y) co-ordinates
canvas.addEventListener('mousedown',
    (e) => {
        const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
        const speed = {
            x: Math.cos(angle) * 3,
            y: Math.sin(angle) * 3
        };
        projectiles.push(new Projectile(center.x, center.y, 10, 'rgba(255,255,255,1)', speed));
    }
);

animate();
spawnEnemy();

// when window is resized updates canvas and player
window.addEventListener('resize',
    () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        center.x = canvas.width / 2;
        center.y = canvas.height / 2;
        player.x = center.x;
        player.y = center.y;
        player.draw();
    }
);

// Displays/hides navigation buttons
function displayButtons() {
    var buttons = document.getElementById("pageLinks");
    if (buttons.style.display == "block") {
        buttons.style.display = "none";
    } else {
        buttons.style.display = "block";
    }
}

// Javascript to handle button animations
const button = document.querySelectorAll('a');
const turbulence = document.querySelector('feTurbulence');
let verticleFrequency = 0.001;
turbulence.setAttribute('baseFrequency', verticleFrequency + '0.0001');

const steps = 20;
const interval = 25;

button.forEach(function (button) {
    button.addEventListener('mouseover', function () {
        verticleFrequency = 0.001;
        for (let i = 0; i < steps; i++) {
            setTimeout(function () {
                verticleFrequency += 0.005;
                turbulence.setAttribute('baseFrequency', verticleFrequency + ' ' + verticleFrequency);
            }, i * interval);

        }
    })
});
// end button animations javascript

// Display/hide end game prompt to user
function gameEnd() {
    finalScore.textContent = 'Score: ' + score;
    modal.style.display = "block";
    closeSpan.onclick = function () {
        modal.style.display = "none";
    }
    retry.onclick = function () {
        location.reload();
    }
};

// Display/hide rules prompt to user on click
// also cancels / resumes canvas animation
rules.onclick = function () {
    rulesModal.style.display = "block";
    cancelAnimationFrame(frame);
    rulesSpan.onclick = function () {
        rulesModal.style.display = "none";
        animate();
    };
};

window.addEventListener('keydown',
    (key) => {
        if (key.keyCode == 27 && !rulesOpen) {
            rules.click();
        }
    }
);