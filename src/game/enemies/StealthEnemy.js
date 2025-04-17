import Enemy from './Enemy.js';

export default class StealthEnemy extends Enemy {
    constructor(game, wave) {
        super(game, wave, false, 'stealth');
        this.isStealth = true;
        this.isCloaked = true;
        this.cloakTimer = 0;
    }

    update(player) {
        super.update(player);
        this.cloakTimer++;
        if (this.cloakTimer > 120) {
            this.isCloaked = !this.isCloaked;
            this.cloakTimer = 0;
        }
    }

    draw() {
        if (!this.isCloaked) {
            if (this.image) {
                this.game.ctx.globalAlpha = 0.5;
                this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                this.game.ctx.globalAlpha = 1;
            } else {
                this.game.ctx.fillStyle = '#00ccff';
                this.game.ctx.globalAlpha = 0.5;
                this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
                this.game.ctx.globalAlpha = 1;
            }
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
    }
}