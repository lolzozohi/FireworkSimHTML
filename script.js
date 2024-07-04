const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

class Firework {
    constructor(x, y, targetX, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.speed = Math.random() * 2 + 2;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.distanceToTarget = Math.sqrt((targetX - x) ** 2 + (targetY - y) ** 2);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([x, y]);
        }
    }

    update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.distanceTraveled += this.speed;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        return this.distanceTraveled >= this.distanceToTarget;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = Math.random() * 5 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = Math.floor(Math.random() * 360);
        this.brightness = Math.floor(Math.random() * 31) + 50;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.01;
    }

    update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
        return this.alpha <= this.decay;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.fill();
    }
}

let fireworks = [];
let particles = [];
let lastFireworkTime = 0;

function animate(time) {
    requestAnimationFrame(animate);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    if (time - lastFireworkTime > 500) {
        fireworks.push(new Firework(
            Math.random() * canvas.width,
            canvas.height,
            Math.random() * canvas.width,
            Math.random() * canvas.height / 2,
            colors[Math.floor(Math.random() * colors.length)]
        ));
        lastFireworkTime = time;
    }

    fireworks.forEach((firework, index) => {
        firework.draw();
        if (firework.update()) {
            fireworks.splice(index, 1);
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(firework.x, firework.y, firework.color));
            }
        }
    });

    particles.forEach((particle, index) => {
        particle.draw();
        if (particle.update()) {
            particles.splice(index, 1);
        }
    });
}

animate();

