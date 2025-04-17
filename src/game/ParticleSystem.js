export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.particles = [];
    }

    addExplosion(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x,
                y,
                radius: Math.random() * 5 + 2,
                speedX: (Math.random() - 0.5) * 5,
                speedY: (Math.random() - 0.5) * 5,
                life: 1000,
                created: Date.now()
            });
        }
    }

    update(deltaTime = 16.67) {
        const now = Date.now();
        this.particles = this.particles.filter(p => now - p.created < p.life);
        this.particles.forEach(p => {
            p.x += p.speedX * (deltaTime / 16.67);
            p.y += p.speedY * (deltaTime / 16.67);
        });
    }

    draw() {
        const image = this.game.assets.images['assets/images/explosion.png'] || new Image();
        this.particles.forEach(p => {
            this.ctx.drawImage(image, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        });
    }
}