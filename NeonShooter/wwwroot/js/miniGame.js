﻿const canvas = document.getElementById('miniGame');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const center = { x: canvas.width / 2, y: canvas.height / 2 };

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

// generate player
const player = new Player(center.x, center.y, 40, 'rgba(66,0,110, 1)');

const projectiles = [];
const enemies = [];
let frame;
let score = 0;

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

function animate() {
    frame = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, .3)'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    ctx.font = "30px Verdana";
    ctx.fillStyle = 'purple';
    ctx.fillText('Score: ' + score, 50, 50);

    projectiles.forEach((projectile, i) => {
        projectile.update();

        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(i, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, i) => {
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < .1) {
            cancelAnimationFrame(frame);
        }

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
                        score += 5;
                    }, 0);
                }

            };
        });
    });
};

window.addEventListener('mousedown',
    (e) => {
        const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
        const speed = {
            x: Math.cos(angle) * 3,
            y: Math.sin(angle) * 3
        };
        projectiles.push(new Projectile(center.x, center.y, 10, 'rgba(255,255,255,1)', speed))
    }
);

animate();
spawnEnemy();

// Javascript to handle button animation
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

function displayButtons() {
    var buttons = document.getElementById("pageLinks");
    if (buttons.style.display === "block") {
        buttons.style.display = "none";
    } else {
        buttons.style.display = "block";
    }
}