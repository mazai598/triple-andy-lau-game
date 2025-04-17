export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
    }

    addExplosion(x, y) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({ x, y, vx: Math.random() * 6 - 3, vy: Math.random() * 6 - 3, life: 30 });
        }
    }

    addBurst(x, y) {
        for (let i = 0; i < 50; i++) {
            this.particles.push({ x, y, vx: Math.random() * 10 - 5, vy: Math.random() * 10 - 5, life: 60, color: `#${Math.floor(Math.random()*16777215).toString(16)}` });
        }
    }

    update() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            return p.life > 0;
        });
    }

    draw() {
        this.particles.forEach(p => {
            this.game.ctx.fillStyle = p.color || '#ffcc00';
            this.game.ctx.globalAlpha = p.life / 30;
            this.game.ctx.fillRect(p.x, p.y, 2, 2);
            this.game.ctx.globalAlpha = 1;
        });
    }
}