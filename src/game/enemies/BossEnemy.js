import Enemy from './Enemy.js';

export default class BossEnemy extends Enemy {
    constructor(game, wave) {
        super(game, wave, true, 'boss');
        this.health = 300 + wave * 50;
        this.speed = 1 + wave * 0.2;
        this.pattern = 0;
    }

    update(player) {
        this.y += this.speed;
        this.pattern = (this.pattern + 1) % 300;
        this.x = player.x + Math.sin(this.pattern * 0.05) * 200; // 超级代码：追踪路径
        if (this.y > 100) this.shoot(player);
        if (this.y > this.game.canvas.height) this.active = false;
    }

    shoot(player) {
        if (Math.random() < 0.02 * this.game.difficulty) {
            this.bullets.push({ x: this.x + this.width / 2, y: this.y + this.height, active: true, speed: 6, targetX: player.x, targetY: player.y });
        }
    }

    draw() {
        this.game.ctx.fillStyle = '#ff0000';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.game.ctx.fillStyle = '#ffcc00';
        this.game.ctx.fillRect(this.x, this.y - 10, this.width * (this.health / (300 + this.game.wave * 50)), 5);
    }
}