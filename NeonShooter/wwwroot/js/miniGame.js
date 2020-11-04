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

const enemySVG = new Image();
enemySVG.src = document.getElementById("enemySVG").src;

const playerSVG = new Image();
playerSVG.src = document.getElementById("playerSVG").src;

const projectile = new Image();
projectile.src = document.getElementById("projectileSVG").src;

const backgroundImg = new Image();
backgroundImg.src = document.getElementById("backgroundImg").src;
// #upgrade class start
class Upgrade {
    constructor(x, y, radius, speed, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.type = type; // Offensive(true) or Defensive(false) boolean upgrade
        this.active = false;
    }

    draw() {
        if (this.type == true) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(250,0,250,1)';
            ctx.fill();
        }
        else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(0,250,0,1)';
            ctx.fill();
        }
    }

    update() {
        if (!this.active) {
            this.draw();
            this.x = this.x + this.speed.x;
            this.y = this.y + this.speed.y;
        } else {
            this.drawUse();
        }
    }

    drawUse() {
        if (this.type == true) {
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius/2, 0, Math.PI * 2, false);
            ctx.strokeStyle = 'rgba(250,0,250,1)';
            ctx.stroke();
        }
        else {
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);
            ctx.strokeStyle = 'rgba(0,250,0,1)';
            ctx.stroke();
        }
    }
}
// #upgrade class end
class Player {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.radiusShip = Math.sqrt(((radius / 2) * (radius / 2)) * 2);
    }

    draw() {
        ctx.drawImage(playerSVG, this.x - (this.radiusShip / 2), this.y - (this.radiusShip / 2), this.radiusShip, this.radiusShip);
    }

}

class Projectile {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
    }

    draw() {
        ctx.drawImage(projectile, this.x, this.y, this.radius, this.radius);
    }

    update() {
        this.draw();
        this.x = this.x + this.speed.x;
        this.y = this.y + this.speed.y;
    }
}

class Enemy {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.radiusShip = Math.sqrt(((radius / 2) * (radius / 2)) * 2);;
    }

    draw() {
        ctx.drawImage(enemySVG, this.x - (this.radiusShip / 2), this.y - (this.radiusShip / 2), this.radiusShip, this.radiusShip);
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
const player = new Player(center.x, center.y, 110);
// draw crosshair on mouse (x,y) co-ordinates
const crosshair = new Crosshair(mouse.x, mouse.y, 10, 'rgba(255,0,0,1)'); // #crosshair

// constructs an array to contain projectiles
const projectiles = [];
// constructs an array to contain enemies
const enemies = [];
// constructs an array to contain upgrades #upgrade
const upgrades = [];


// score of player at new game
let score = 0;
// display for player score
var finalScore = document.getElementById("score");

// current animation frame
let frame;

// spawns enemy randomly around the edge of the canvas
function spawnEnemy() {
    setInterval(() => {
        const radius = Math.random() * 100 + 55;
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius * Math.PI : canvas.width + radius * Math.PI;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius * Math.PI : canvas.height + radius * Math.PI;
        }

        const angle = Math.atan2(center.y - y, center.x - x);
        const speed = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };


        enemies.push(new Enemy(x, y, radius, speed));
    }, 2000);
};

// animates the drawing pad 
function animate() {
    frame = requestAnimationFrame(animate);
    // clear canvas and draw player
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
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
        
        for (let upgrade of upgrades) {
            if (!upgrade.type && upgrade.active && (dist - enemy.radiusShip / 2 - player.radiusShip / 2 < .05)) {
                setTimeout(() => {
                    enemies.splice(i, 1);
                    upgrades.splice(upgrades.indexOf(upgrade),1);
                }, 0);
                break;
            };
        };
        if (dist - enemy.radiusShip / 2 - player.radiusShip / 2 < .05 && !upgrades.some(checkUpgrade)) {
            gameEnd();
        };
        

        // if a projectile hits enemy, reduce enemy size and update score
        projectiles.forEach((projectile, j) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radiusShip / 2 - projectile.radius / 2 < .05) {
                if (enemy.radiusShip - 15 >= 20) {
                    enemy.radiusShip = enemy.radiusShip / 2;
                    setTimeout(() => {
                        projectiles.splice(j, 1);
                        score++;
                    }, 0);
                } else {
                    setTimeout(() => {
                        const reward = Math.random() * 2 < 0.5 ? true : false; // Random reward boolean #upgrade
                        if (reward) { upgrades.push(new Upgrade(enemy.x, enemy.y, 5, enemy.speed, Math.random() < 0.5 ? true : false)) }; // #upgrade
                        enemies.splice(i, 1);
                        projectiles.splice(j, 1);
                        score += 10;
                    }, 0);
                }

            };
        });
    });
    // draw each upgrade in array and update possition #upgrade start
    upgrades.forEach((upgrade, i) => {
        upgrade.update();
        const dist = Math.hypot(player.x - upgrade.x, player.y - upgrade.y);
        if (dist - upgrade.radius / 2 - player.radiusShip / 2 < .05 && !upgrade.active) {
            upgrade.active = true;
        };

    });
    // #upgrade end
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
        projectiles.push(new Projectile(center.x, center.y, 15, speed));
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
    cancelAnimationFrame(frame);
    canvas.style.cursor = 'crosshair'; // #crosshair
    finalScore.textContent = 'Score: ' + score;
    modal.style.display = "block";
    closeSpan.onclick = function () {
        modal.style.display = "none";
    }
    retry.onclick = function () {
        location.reload();
    }
};
function checkUpgrade(upgrade) {
    return upgrade.type;
}
// Display/hide rules prompt to user on click
// also cancels / resumes canvas animation
rules.onclick = function () {
    rulesModal.style.display = "block";
    cancelAnimationFrame(frame);
    rulesSpan.onclick = function () {
        rulesModal.style.display = "none";
        clearInterval(spawnEnemy);
        requestAnimationFrame(animate);
    };
};

window.addEventListener('keydown',
    (key) => {
        if (key.keyCode == 27 && !rulesOpen) {
            rules.click();
            rulesOpen = true;
        }
        else if (key.keyCode == 27 && rulesOpen) {
            rulesSpan.click();
            rulesOpen = false;
        }
    }
);