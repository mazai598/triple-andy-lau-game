export default class Enemy {
    constructor(game, wave, isBoss, type = 'small') {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2 + wave * 0.5;
        this.health = { small: 20, medium: 40, large: 80, boss: 300 }[type] || 20;
        this.active = true;
        this.type = type;
        this.isBoss = isBoss;
        this.bullets = [];
        this.shootCooldown = 0;
    }

    update(player) {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.active = false;
        this.shootCooldown--;
        if (this.shootCooldown <= 0 && Math.random() < 0.01 * this.game.difficulty) {
            this.bullets.push({ x: this.x + this.width / 2, y: this.y + this.height, active: true, speed: 5 });
            this.shootCooldown = 60;
        }
    }

    draw() {
        this.game.ctx.fillStyle = this.isBoss ? '#ff0000' : '#ffcc00';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    resize(width, height) {
        this.width = 40 * (width / 1920);
        this.height = 40 * (height / 1440);
        this.x = Math.max(0, Math.min(this.x, width - this.width));
        this.y = Math.max(-this.height, Math.min(this.y, height));
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