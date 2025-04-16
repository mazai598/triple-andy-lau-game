export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
    }

    addExplosion(x, y) {
        const count = this.game.quality === 'high' ? 20 : 10;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                radius: Math.random() * 5 + 2,
                speedX: (Math.random() - 0.5) * 6,
                speedY: (Math.random() - 0.5) * 6,
                life: Math.random() * 30 + 20,
                type: 'explosion',
                color: `hsl(${Math.random() * 60 + 360}, 100%, 50%)`
            });
        }
    }

    addTrail(x, y) {
        if (this.game.quality === 'low') return;
        this.particles.push({
            x,
            y,
            radius: Math.random() * 3 + 1,
            speedX: 0,
            speedY: Math.random() * 2 + 1,
            life: Math.random() * 10 + 5,
            type: 'trail',
            color: '#00d4ff'
        });
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life--;
            if (particle.life <= 0) {
                particle.active = false;
            }
        });
        this.particles = this.particles.filter(p => !p.active && p.life > 0);
        this.particles.forEach(p => {
            this.game.dirtyRegions.push({
                x: p.x - p.radius - 10,
                y: p.y - p.radius - 10,
                w: p.radius * 2 + 20,
                h: p.radius * 2 + 20
            });
        });
    }

    draw() {
        const ctx = this.game.ctx;
        this.particles.forEach(p => {
            const img = this.game.images[p.type === 'explosion' ? 'assets/images/explosion.png' : 'assets/images/particle_trail.png'];
            if (img && img.complete && this.game.quality === 'high') {
                ctx.drawImage(img, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                if (this.game.quality === 'high') {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = p.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        });
    }
}