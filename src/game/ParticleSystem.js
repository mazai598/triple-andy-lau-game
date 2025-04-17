export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.particles = [];
    }

    addExplosion(x, y) {
        const explosion = this.game.assets.images['assets/images/explosion.png'] || new Image();
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + Math.random() * 20 - 10,
                y: y + Math.random() * 20 - 10,
                width: 10,
                height: 10,
                speedX: (Math.random() - 0.5) * 5,
                speedY: (Math.random() - 0.5) * 5,
                alpha: 1,
                image: explosion,
                duration: 500
            });
        }
    }

    addTrail(x, y, width, height) {
        const trail = this.game.assets.images['assets/images/particle_trail.png'] || new Image();
        this.particles.push({
            x: x,
            y: y,
            width: width,
            height: height,
            speedX: 0,
            speedY: 2,
            alpha: 1,
            image: trail,
            duration: 300
        });
    }

    update(deltaTime = 16.67) {
        this.particles.forEach(p => {
            p.x += (p.speedX || 0) * (deltaTime / 16.67);
            p.y += (p.speedY || 0) * (deltaTime / 16.67);
            p.duration -= deltaTime;
            p.alpha = p.duration / 300;
            if (p.duration <= 0) p.alpha = 0;
        });
        this.particles = this.particles.filter(p => p.alpha > 0);
    }

    draw() {
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.alpha;
            if (!p.image || p.image.width === 0) {
                this.ctx.fillStyle = 'orange';
                this.ctx.fillRect(p.x, p.y, p.width, p.height);
            } else {
                this.ctx.drawImage(p.image, p.x, p.y, p.width, p.height);
            }
            this.ctx.globalAlpha = 1;
        });
    }
}