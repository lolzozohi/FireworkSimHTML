const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let clickPromptVisible = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

let explosionSound;
let fireworkSound;

// Function to clear the canvas
function clearCanvas() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
}

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

        // Play firework sound when the firework is launched
        if (fireworkSound) {
            fireworkSound.currentTime = 0; // Reset sound
            fireworkSound.play();
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

// Function to start the fireworks simulation
function startFireworks() {
    fireworks = [];
    particles = [];
    lastFireworkTime = 0;

    // Load sound files
    explosionSound = new Audio('explosion.mp3');
    fireworkSound = new Audio('firework.mp3'); // Make sure you have a firework sound file

    function animate(time) {
        requestAnimationFrame(animate);
        clearCanvas();

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
                // Play explosion sound when the firework explodes
                explosionSound.currentTime = 0; // Reset sound
                explosionSound.play();
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
}

// Event listener for mouse click to spawn a firework and start the simulation
canvas.addEventListener('click', (e) => {
    if (clickPromptVisible) {
        clickPromptVisible = false;
        document.getElementById('clickPrompt').style.display = 'none';
        startFireworks();
    } else {
        fireworks.push(new Firework(
            e.clientX,
            canvas.height,
            e.clientX,
            e.clientY,
            colors[Math.floor(Math.random() * colors.length)]
        ));
    }
});

// Function to show initial click prompt
function showClickPrompt() {
    const promptElement = document.createElement('div');
    promptElement.id = 'clickPrompt';
    promptElement.textContent = 'Click to Start!';
    promptElement.style.position = 'absolute';
    promptElement.style.top = '20px';
    promptElement.style.left = '50%';
    promptElement.style.transform = 'translateX(-50%)';
    promptElement.style.color = 'white';
    promptElement.style.fontFamily = 'Arial, sans-serif';
    promptElement.style.fontSize = '20px';
    promptElement.style.textAlign = 'center';
    promptElement.style.padding = '10px 20px';
    promptElement.style.background = 'rgba(0, 0, 0, 0.5)';
    promptElement.style.borderRadius = '5px';
    promptElement.style.zIndex = '1000';
    document.body.appendChild(promptElement);
}

showClickPrompt();
