import Enemy from './Enemy.js';

export default class BossEnemy extends Enemy {
    constructor(game, wave) {
        super(game, wave, true, 'boss');
        this.width = 80;
        this.height = 80;
        this.health = 300 + wave * 50;
        this.speed = 1 + wave * 0.2;
        this.pattern = 0;
        this.image = game.images['assets/images/boss_final.png'] || null;
    }

    update(player) {
        try {
            this.y += this.speed;
            this.pattern = (this.pattern + 1) % 300;
            this.x = player.x + Math.sin(this.pattern * 0.05) * 200;
            if (this.y > 100) this.shoot(player);
            if (this.y > this.game.canvas.height) this.active = false;
            this.bullets.forEach(bullet => {
                const dx = bullet.targetX - bullet.x;
                const dy = bullet.targetY - bullet.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 1) {
                    bullet.x += (dx / dist) * bullet.speed;
                    bullet.y += (dy / dist) * bullet.speed;
                }
                if (bullet.y > this.game.canvas.height) bullet.active = false;
            });
            this.bullets = this.bullets.filter(b => b.active);
        } catch (error) {
            console.error('Boss更新失败:', error);
            this.active = false;
        }
    }

    shoot(player) {
        if (Math.random() < 0.02 * this.game.difficulty) {
            this.bullets.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                width: 4,
                height: 15,
                active: true,
                speed: 6,
                targetX: player.x,
                targetY: player.y,
                imagePath: 'assets/images/enemy_bullet.png'
            });
        }
    }

    draw() {
        try {
            if (this.image) {
                this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                this.game.ctx.fillStyle = '#ff0000';
                this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            this.game.ctx.fillStyle = '#ffcc00';
            this.game.ctx.fillRect(this.x, this.y - 10, this.width * (this.health / (300 + this.game.wave * 50)), 5);
            this.bullets.forEach(bullet => {
                if (bullet.active) {
                    const bulletImage = this.game.images[bullet.imagePath];
                    if (bulletImage) {
                        this.game.ctx.drawImage(bulletImage, bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
                    } else {
                        this.game.ctx.fillStyle = '#ff0000';
                        this.game.ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width || 4, bullet.height || 15);
                    }
                }
            });
        } catch (error) {
            console.error('Boss绘制失败:', error);
        }
    }
}