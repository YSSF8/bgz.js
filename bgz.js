let elementBg = {
    rain: (element, { radius = 25, speed, spacing = 50 } = {}) => {
        if (typeof radius != 'number') {
            throw new Error(`Radius must be a number`);
        }

        const el = document.querySelector(element);

        for (let i = 0; i < radius; i++) {
            const bg = document.createElement('div');
            el.appendChild(bg);

            let bgSpeed;
            if (speed === undefined) {
                bgSpeed = Math.floor(Math.random() * 60) + 60;
            } else if (typeof speed === 'object' && speed !== null && typeof speed.min === 'number' && typeof speed.max === 'number') {
                if (speed.min >= speed.max) {
                    throw new Error(`Speed min must be less than speed max`);
                }
                bgSpeed = Math.floor(Math.random() * (speed.max - speed.min + 1)) + speed.min;
            } else if (typeof speed !== 'number') {
                throw new Error(`Speed must be a number or an object with min and max properties`);
            } else {
                bgSpeed = speed;
            }

            bg.classList.add('bgz-rain');
            bg.setAttribute('style', `--speed: ${bgSpeed};`);

            if (i > 0) {
                const prevBg = el.children[i - 1];
                const prevRight = prevBg.getBoundingClientRect().right;
                const bgLeft = bg.getBoundingClientRect().left;
                const diff = bgLeft - prevRight;
                if (diff < spacing) {
                    bg.style.left = `${prevRight + spacing}px`;
                }
            }
        }
    },
    bing: element => {
        const el = document.querySelector(element);

        if (!/<img/g.test(el.outerHTML)) {
            throw new Error(`The element \`${el.outerHTML}\` must an img element`);
        } else {
            fetch('https://bing.biturl.top/')
                .then(res => res.json())
                .then(data => el.src = data.url);
        }
    }
}

let canvasBg = {
    waves: (element, { color = '#0078d4', waves = [{ amplitude: 25, wavelength: 150 }, { amplitude: 35, wavelength: 120 }, { amplitude: 20, wavelength: 200 }], lineWidth = 2, lineColor = '#005ea2' } = {}) => {
        const el = document.querySelector(element);

        if (/<canvas/g.test(el.outerHTML)) {
            const canvas = el;
            const context = canvas.getContext('2d');

            let width = canvas.width;
            let height = canvas.height;

            context.lineWidth = lineWidth;
            context.strokeStyle = lineColor;

            let increment = 0;

            function draw() {
                requestAnimationFrame(draw);

                context.clearRect(0, 0, width, height);

                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(width, 0);
                context.stroke();

                for (let i = 0; i < waves.length; i++) {
                    const { amplitude, wavelength } = waves[i];
                    context.beginPath();
                    context.moveTo(0, height / 2);

                    for (let x = 0; x < width; x++) {
                        let y = amplitude * Math.sin(x / wavelength + increment) + height / 2;

                        context.lineTo(x, y);
                    }

                    context.strokeStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${1 - (i / waves.length)})`;
                    context.stroke();
                }

                increment += 0.015;
            }

            draw();
        } else {
            throw new Error('The selected element must be a <canvas> element');
        }
    },
    particleSystem: (element, { color = '#0078d4', size = 2, count = 50, speed = 1 } = {}) => {
        const el = document.querySelector(element);

        if (el.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a <canvas> element');
        }

        const ctx = el.getContext('2d');
        let particles = [];

        function createParticle() {
            let x = Math.random() * el.width;
            let y = Math.random() * el.height;
            let xv = ((Math.random() * 2) - 1) * speed;
            let yv = ((Math.random() * 2) - 1) * speed;
            particles.push({ x, y, xv, yv });
        }

        function updateParticles() {
            for (let i = 0; i < particles.length; i++) {
                particles[i].x += particles[i].xv;
                particles[i].y += particles[i].yv;

                if (particles[i].x < 0 || particles[i].x > el.width) {
                    particles[i].xv *= -1;
                }

                if (particles[i].y < 0 || particles[i].y > el.height) {
                    particles[i].yv *= -1;
                }
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, el.width, el.height);
            ctx.fillStyle = color;

            for (let i = 0; i < particles.length; i++) {
                ctx.beginPath();
                ctx.arc(particles[i].x, particles[i].y, size, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        function loop() {
            updateParticles();
            drawParticles();
            requestAnimationFrame(loop);
        }

        for (let i = 0; i < count; i++) {
            createParticle();
        }

        loop();
    },
    matrix: (element, options = {}) => {
        class MatrixRain {
            constructor(canvas, options) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.options = Object.assign({
                    color: '#0f0',
                    size: 16,
                    speed: 50,
                    text: '01',
                }, options);

                this.columns = Math.ceil(this.canvas.width / this.options.size);
                this.drops = [];

                this.ctx.fillStyle = this.options.color;
                this.ctx.font = `${this.options.size}px monospace`;
                this.ctx.textBaseline = 'top';
            }

            start() {
                this.render();
            }

            render() {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                for (let i = 0; i < this.columns; i++) {
                    if (Math.random() < 0.1) {
                        this.drops[i] = 0;
                    }

                    if (this.drops[i] !== undefined) {
                        this.ctx.fillStyle = this.options.color;

                        const text = this.options.text.charAt(Math.floor(Math.random() * this.options.text.length));
                        this.ctx.fillText(text, i * this.options.size, this.drops[i] * this.options.size);

                        this.drops[i]++;

                        if (this.drops[i] * this.options.size > this.canvas.height) {
                            this.drops[i] = undefined;
                        }
                    }
                }

                setTimeout(() => {
                    requestAnimationFrame(this.render.bind(this));
                }, this.options.speed);
            }
        }

        const canvas = document.querySelector(element);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('The selected element must be a canvas element');
        }

        const matrixRain = new MatrixRain(canvas, options);
        matrixRain.start();
    },
    rain: (element, { speed = 15, size = 20, count = 50, color = '#0078d4' } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');

        const createRaindrop = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            speed: speed + Math.random() * speed,
            length: size + Math.random() * size,
        });

        let raindrops = [];

        for (let i = 0; i < count; i++) {
            raindrops.push(createRaindrop());
        }

        const updateRain = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < raindrops.length; i++) {
                const raindrop = raindrops[i];
                raindrop.y += raindrop.speed;

                if (raindrop.y - raindrop.length > canvas.height) {
                    raindrops[i] = createRaindrop();
                }

                ctx.beginPath();
                ctx.moveTo(raindrop.x, raindrop.y);
                ctx.lineTo(raindrop.x, raindrop.y - raindrop.length);
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        };

        setInterval(() => {
            updateRain();
        }, 1000 / 60);
    },
    bubbles: (element, { size = 20, speed = 5, spawningRadius = 1000, color = '#0078d4' } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        const bubbles = [];

        const createBubble = () => {
            const x = Math.random() * canvas.width;
            const y = canvas.height;
            return { x, y };
        };

        const updateBubble = (bubble, index) => {
            bubble.y -= speed;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            if (bubble.y < -size) {
                bubbles.splice(index, 1);
            }
        };

        const updateBubbles = () => {
            for (let i = 0; i < bubbles.length; i++) {
                updateBubble(bubbles[i], i);
            }
        };

        setInterval(() => {
            bubbles.push(createBubble());
        }, spawningRadius);

        setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateBubbles();
        }, 1000 / 60);
    },
    confetti: (element, { colors = ['#e67e22', '#16a085', '#2e86c1', '#8e44ad'], count = 50, speed = 4 } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        const particles = [];

        const spawnParticle = () => {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                size: Math.random() * 10 + 10,
                angle: Math.random() * 360,
                speed: speed + Math.random() * 10 - 5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        };

        const updateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                const radians = particle.angle * Math.PI / 180;
                particle.x += particle.speed * Math.cos(radians);
                particle.y += particle.speed * Math.sin(radians);
                particle.angle += Math.random() * 4 - 2;

                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 50) {
                    const angle = Math.atan2(dy, dx);
                    particle.x += Math.cos(angle) * 5;
                    particle.y += Math.sin(angle) * 5;
                }

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                if (particle.x < -50 || particle.x > canvas.width + 50 || particle.y < -50 || particle.y > canvas.height + 50) {
                    particles.splice(particles.indexOf(particle), 1);
                }
            });

            if (particles.length < count) {
                for (let i = 0; i < count - particles.length; i++) {
                    spawnParticle();
                }
            }

            requestAnimationFrame(updateParticles);
        };

        let mouseX = 0;
        let mouseY = 0;
        canvas.addEventListener('mousemove', event => {
            mouseX = event.clientX - canvas.offsetLeft;
            mouseY = event.clientY - canvas.offsetTop;
        });

        updateParticles();
    },
    starfield: (element, { speed = 2, density = 500, starColor = '#fff', backgroundColor = '#000' } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        const stars = [];
        for (let i = 0; i < density; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3,
                speed: speed * Math.random() + 1
            });
        }
        const updateStars = () => {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = starColor;
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                star.x -= star.speed;
                if (star.x < 0) {
                    star.x = canvas.width;
                }
            });
            requestAnimationFrame(updateStars);
        };
        updateStars();
    },
    leaves: (element, { color = '#87ceeb', count = 50, speed = 1 } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        const leaves = [];
        const hexToRgb = hex => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        for (let i = 0; i < count; i++) {
            leaves.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 10 + 10,
                color: hexToRgb(color),
                angle: Math.random() * 360,
                speed: Math.random() * speed
            });
        }
        const updateLeaves = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            leaves.forEach(leaf => {
                leaf.angle += Math.random() * 0.05 - 0.025;
                leaf.y += leaf.speed;
                if (leaf.x > canvas.width + 50 || leaf.x < -50 || leaf.y > canvas.height + 50 || leaf.y < -50) {
                    leaf.x = Math.random() * canvas.width;
                    leaf.y = -10;
                }
                const gradient = ctx.createLinearGradient(leaf.x, leaf.y, leaf.x + leaf.size, leaf.y + leaf.size);
                gradient.addColorStop(0, `rgba(${leaf.color.r}, ${leaf.color.g}, ${leaf.color.b}, 0)`);
                gradient.addColorStop(1, `rgba(${leaf.color.r}, ${leaf.color.g}, ${leaf.color.b}, 1)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(leaf.x, leaf.y, leaf.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(updateLeaves);
        };
        updateLeaves();
    },
    bouncingBalls: (element, { count = 50, size = 10, speed = 5, gravity = 0.2, bounce = 0.8, colors = ['#ff4b4b', '#4be0c8', '#fac45e'] } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        const balls = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const dx = (Math.random() - 0.5) * speed;
            const dy = (Math.random() - 0.5) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            balls.push({ x, y, dx, dy, size, color });
        }

        const updateBalls = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(ball => {
                ball.x += ball.dx;
                ball.y += ball.dy;
                if (ball.y + ball.size > canvas.height) {
                    ball.y = canvas.height - ball.size;
                    ball.dy = -ball.dy * bounce;
                } else {
                    ball.dy += gravity;
                }
                if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
                    ball.dx = -ball.dx;
                }
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
                ctx.fillStyle = ball.color;
                ctx.fill();
            });
            requestAnimationFrame(updateBalls);
        };
        updateBalls();
    },
    clouds: (element, { speed = 1, opacity = 0.5, count = 20, src = 'https://static.vecteezy.com/system/resources/thumbnails/009/302/650/small/white-cloud-clipart-design-illustration-free-png.png' } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        const clouds = [];
        const randomIntFromRange = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        const image = new Image();
        image.src = src;
        for (let i = 0; i < count; i++) {
            const x = randomIntFromRange(-canvas.width, canvas.width);
            const y = randomIntFromRange(-canvas.height, canvas.height);
            const size = randomIntFromRange(100, 200);
            clouds.push({ x, y, size });
        }
        const updateClouds = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            clouds.forEach(cloud => {
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.drawImage(image, cloud.x, cloud.y, cloud.size, cloud.size / 2);
                ctx.restore();
                cloud.x += speed;
                if (cloud.x > canvas.width) {
                    cloud.x = -cloud.size;
                }
            });
            requestAnimationFrame(updateClouds);
        };
        updateClouds();
    },
    fireworks: (element, { count = 15, speed = 4, gravity = 0.1, burstSpeed = 4, colors = ['#ff4b4b', '#4be0c8', '#fac45e'], lifespan = 50 } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        const fireworks = [];

        class Firework {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.bursts = [];
                this.burstSpeed = burstSpeed;
                this.lifespan = lifespan;
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                this.y -= speed;
                this.draw();
                if (this.y <= canvas.height / 2) {
                    this.burst();
                }
            }

            burst() {
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 30;
                    const x = this.x + radius * Math.cos(angle);
                    const y = this.y + radius * Math.sin(angle);
                    const dx = (x - this.x) / this.burstSpeed;
                    const dy = (y - this.y) / this.burstSpeed;
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    this.bursts.push({ x, y, dx, dy, color, lifespan: this.lifespan });
                }
            }
        }

        const updateFireworks = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            fireworks.forEach((firework, index) => {
                firework.update();
                if (firework.bursts.length) {
                    firework.bursts.forEach((burst, burstIndex) => {
                        burst.x += burst.dx;
                        burst.y += burst.dy;
                        burst.dy += gravity;
                        ctx.beginPath();
                        ctx.fillStyle = burst.color;
                        ctx.arc(burst.x, burst.y, 2, 0, Math.PI * 2);
                        ctx.fill();
                        burst.lifespan--;
                        if (burst.lifespan <= 0) {
                            firework.bursts.splice(burstIndex, 1);
                        }
                    });
                }
                if (firework.y <= canvas.height / 2 && firework.bursts.length === 0) {
                    fireworks.splice(index, 1);
                }
            });
            requestAnimationFrame(updateFireworks);
        };

        canvas.addEventListener('click', (event) => {
            const x = event.clientX - canvas.offsetLeft;
            const y = event.clientY - canvas.offsetTop;
            const color = colors[Math.floor(Math.random() * colors.length)];
            fireworks.push(new Firework(x, canvas.height, color));
        });

        updateFireworks();
    },
    underwater: (element, { count = 15, speed = 1, bubbleCount = 30, bubbleSpeed = 1, bubbleSize = 5, colors = ['#4ECDC4', '#C7F464', '#FF6B6B', '#FFA861'], backgroundColor = '#0d5fdd' } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        const fishes = [];
        const bubbles = [];

        canvas.style.backgroundColor = backgroundColor;

        class Fish {
            constructor(x, y, color, size) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.size = size;
                this.speed = Math.random() * speed + 1;
                this.angle = Math.random() * Math.PI * 2;
                this.tail = [];
                for (let i = 0; i < 3; i++) {
                    this.tail.push(Math.random() * 20 + 10);
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.moveTo(0, 0);
                ctx.lineTo(this.size, -this.size / 2);
                ctx.lineTo(this.size, this.size / 2);
                ctx.lineTo(0, 0);
                ctx.closePath();
                ctx.fill();
                for (let i = 0; i < this.tail.length; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(-this.tail[i], i * 10 - 10);
                    ctx.lineTo(-this.tail[i], i * 10);
                    ctx.lineTo(0, 0);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            }

            update() {
                this.x += this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);
                if (this.x < -this.size) {
                    this.x = canvas.width + this.size;
                }
                if (this.x > canvas.width + this.size) {
                    this.x = -this.size;
                }
                if (this.y < -this.size) {
                    this.y = canvas.height + this.size;
                }
                if (this.y > canvas.height + this.size) {
                    this.y = -this.size;
                }
            }
        }

        class Bubble {
            constructor(x, y, size, speed) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.speed = speed;
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                this.y -= this.speed;
            }
        }

        const addFish = () => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 30 + 20;
            fishes.push(new Fish(x, y, color, size));
        };

        const addBubble = () => {
            const x = Math.random() * canvas.width;
            const y = canvas.height + bubbleSize;
            const size = Math.random() * bubbleSize + 2;
            const speed = Math.random() * bubbleSpeed + 1;
            bubbles.push(new Bubble(x, y, size, speed));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fishes.forEach(fish => fish.draw());
            bubbles.forEach(bubble => bubble.draw());
        };

        const update = () => {
            fishes.forEach(fish => fish.update());
            bubbles.forEach(bubble => bubble.update());
        };

        const loop = () => {
            draw();
            update();
            if (fishes.length < count && Math.random() < 0.03) {
                addFish();
            }
            if (bubbles.length < bubbleCount && Math.random() < 0.05) {
                addBubble();
            }
            requestAnimationFrame(loop);
        };

        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        for (let i = 0; i < count; i++) {
            addFish();
        }
        for (let i = 0; i < bubbleCount; i++) {
            addBubble();
        }

        loop();
    },
    betterParticles: (element, { color = '#0078d4', size = 2, speed = 50, range = 100, followSpeed = 0.1, maxParticles = 100 } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        let particles = [];

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = Math.random() * speed * 2 - speed;
                this.vy = Math.random() * speed * 2 - speed;
            }

            update(dt, mouseX, mouseY) {
                if (Math.abs(mouseX - this.x) <= range && Math.abs(mouseY - this.y) <= range) {
                    this.vx += (mouseX - this.x) * followSpeed;
                    this.vy += (mouseY - this.y) * followSpeed;
                }
                this.x += this.vx * dt;
                this.y += this.vy * dt;
                if (this.x < 0 || this.x > canvas.width) {
                    this.vx = -this.vx;
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.vy = -this.vy;
                }
            }

            draw() {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const addParticle = (x, y) => {
            if (particles.length >= maxParticles) return;
            particles.push(new Particle(x, y));
        };

        const update = (dt, mouseX, mouseY) => {
            particles.forEach(particle => particle.update(dt, mouseX, mouseY));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => particle.draw());
        };

        const loop = (t) => {
            requestAnimationFrame(loop);
            const dt = t - lastTime;
            lastTime = t;
            update(dt / 1000, mouseX, mouseY);
            draw();
        };

        let lastTime = 0;
        let mouseX = 0;
        let mouseY = 0;
        canvas.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        canvas.addEventListener('mouseleave', () => {
            mouseX = canvas.width / 2;
            mouseY = canvas.height / 2;
        });
        setInterval(() => addParticle(Math.random() * canvas.width, Math.random() * canvas.height), 1000 / 60);
        loop(0);
    },
    floatingShapes: (element, { shapes = ['circle', 'square', 'triangle'], transitionDuration = 2, transitionDelay = 0.5, shapeSize = 50, minSpeed = 1, maxSpeed = 5, shapeColor = '#ffffff', backgroundColor = '#000000' } = {}) => {
        const canvas = document.querySelector(element);
        if (!canvas || canvas.tagName !== 'CANVAS') {
            throw new Error('The selected element must be a canvas element');
        }
        const ctx = canvas.getContext('2d');
        let shapesList = [];

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        const createShape = () => {
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            const shapeX = Math.random() * canvas.width;
            const shapeY = Math.random() * canvas.height;
            const shapeSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed);
            const shapeAngle = Math.random() * 360;
            let shapeSize2 = 0;

            const transition = () => {
                const targetShapeType = shapes[Math.floor(Math.random() * shapes.length)];
                const targetShapeSize = Math.random() * shapeSize + shapeSize / 2;

                const transitionCanvas = document.createElement('canvas');
                transitionCanvas.width = shapeSize;
                transitionCanvas.height = shapeSize;
                const transitionCtx = transitionCanvas.getContext('2d');
                transitionCtx.fillStyle = backgroundColor;
                transitionCtx.fillRect(0, 0, shapeSize, shapeSize);

                const targetShape = createShapeObject(targetShapeType, targetShapeSize, shapeColor, shapeSize / 2, shapeSize / 2);
                targetShape.draw(transitionCtx);

                const imageData = transitionCtx.getImageData(0, 0, shapeSize, shapeSize);
                let i = 0;
                const intervalId = setInterval(() => {
                    shapeSize2 = shapeSize - i * shapeSize / (transitionDuration * 60);
                    const x = shapeX - shapeSize2 / 2;
                    const y = shapeY - shapeSize2 / 2;
                    ctx.putImageData(imageData, x, y);
                    if (i >= transitionDuration * 60) {
                        clearInterval(intervalId);
                        createShape();
                    }
                    i++;
                }, 16.67);
            }

            const shape = createShapeObject(shapeType, shapeSize2, shapeColor, shapeX, shapeY);
            shape.speed = shapeSpeed;
            shape.angle = shapeAngle;

            const update = () => {
                shapeX += shapeSpeed * Math.sin(shapeAngle * Math.PI / 180);
                shapeY -= shapeSpeed * Math.cos(shapeAngle * Math.PI / 180);
                if (shapeX < -shapeSize || shapeX > canvas.width || shapeY < -shapeSize || shapeY > canvas.height) {
                    transition();
                    return;
                }
                shape.x = shapeX;
                shape.y = shapeY;
                shapeSize2 = shapeSize;
                shape.size = shapeSize2;
                shape.draw(ctx);
            }

            return { update };
        }

        const createShapeObject = (type, size, color, x, y) => {
            if (type === 'circle') {
                return {
                    draw: (ctx) => {
                        ctx.beginPath();
                        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
                        ctx.fillStyle = color;
                        ctx.fill();
                    },
                    x,
                    y,
                    size
                };
            } else if (type === 'square') {
                return {
                    draw: (ctx) => {
                        ctx.beginPath();
                        ctx.rect(x - size / 2, y - size / 2, size, size);
                        ctx.fillStyle = color;
                        ctx.fill();
                    },
                    x,
                    y,
                    size
                };
            } else if (type === 'triangle') {
                return {
                    draw: (ctx) => {
                        const height = size * Math.sqrt(3) / 2;
                        ctx.beginPath();
                        ctx.moveTo(x, y - height / 2);
                        ctx.lineTo(x - size / 2, y + height / 2);
                        ctx.lineTo(x + size / 2, y + height / 2);
                        ctx.closePath();
                        ctx.fillStyle = color;
                        ctx.fill();
                    },
                    x,
                    y,
                    size
                };
            }
        }

        const init = () => {
            resizeCanvas();
            for (let i = 0; i < canvas.width * canvas.height / (shapeSize * shapeSize); i++) {
                shapesList.push(createShape());
            }
        }

        const update = () => {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            shapesList.forEach(shape => shape.update());
            requestAnimationFrame(update);
        }

        window.addEventListener('resize', resizeCanvas);

        init();
        update();
    }
}