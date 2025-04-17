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
            this.game.ctx.fillStyle = '#00ccff';
            this.game.ctx.globalAlpha = 0.5;
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
            this.game.ctx.globalAlpha = 1;
        }
    }
}