export default class Enemy {
    constructor(game, wave, isBoss, type = 'small') {
        this.game = game;
        this.width = { small: 30, medium: 40, large: 50, boss: 80 }[type] || 30;
        this.height = { small: 30, medium: 40, large: 50, boss: 80 }[type] || 30;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2 + wave * 0.5;
        this.health = { small: 20, medium: 40, large: 80, boss: 300 }[type] || 20;
        this.active = true;
        this.type = type;
        this.isBoss = isBoss;
        this.bullets = [];
        this.shootCooldown = 0;
        this.image = game.images[`assets/images/enemy_${type}.png`] || null;
    }

    update(player) {
        try {
            this.y += this.speed;
            if (this.y > this.game.canvas.height) this.active = false;
            this.shootCooldown--;
            if (this.shootCooldown <= 0 && Math.random() < 0.01 * this.game.difficulty) {
                this.bullets.push({ x: this.x + this.width / 2, y: this.y + this.height, width: 2, height: 10, speed: 5, active: true, imagePath: 'assets/images/enemy_bullet.png' });
                this.shootCooldown = 60;
            }
            this.bullets.forEach(bullet => {
                bullet.y += bullet.speed;
                if (bullet.y > this.game.canvas.height) bullet.active = false;
            });
            this.bullets = this.bullets.filter(b => b.active);
        } catch (error) {
            console.error('敌人更新失败:', error);
            this.active = false;
        }
    }

    draw() {
        try {
            if (this.image) {
                this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                this.game.ctx.fillStyle = this.isBoss ? '#ff0000' : '#ffcc00';
                this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            this.bullets.forEach(bullet => {
                if (bullet.active) {
                    const bulletImage = this.game.images[bullet.imagePath];
                    if (bulletImage) {
                        this.game.ctx.drawImage(bulletImage, bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
                    } else {
                        this.game.ctx.fillStyle = '#ff0000';
                        this.game.ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width || 2, bullet.height || 10);
                    }
                }
            });
        } catch (error) {
            console.error('敌人绘制失败:', error);
        }
    }

    resize(width, height) {
        try {
            const scale = width / 1920;
            this.width *= scale;
            this.height *= scale;
            this.x = Math.max(0, Math.min(this.x, width - this.width));
            this.y = Math.max(-this.height, Math.min(this.y, height));
        } catch (error) {
            console.error('敌人调整大小失败:', error);
        }
    }

    saveState() {
        return { x: this.x, y: this.y, health: this.health, active: this.active, type: this.type, isBoss: this.isBoss, bullets: this.bullets };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.active = state.active;
        this.type = state.type;
        this.isBoss = state.isBoss;
        this.bullets = state.bullets;
    }
}