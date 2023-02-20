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
            throw new Error(`The element \`${el.outerHTML}\` must be the <img> element`);
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
    }
}