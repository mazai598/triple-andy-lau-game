import WeaponSystem from '../weapons/WeaponSystem.js';

export default class StealthEnemy {
    constructor(game, wave) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.type = 'stealth';
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (this.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 4;
        this.health = 30;
        this.active = true;
        this.weaponSystem = new WeaponSystem(this, 'enemy');
        this.image = game.assets.images['assets/images/enemy_stealth.png'] || new Image();
        this.alpha = 0.5;
    }

    update(player, deltaTime = 16.67) {
        if (!this.active) return;
        const speed = this.speed * (deltaTime / 16.67);
        this.y += speed;
        if (this.y > this.canvas.height) this.active = false;
        if (Math.random() < 0.015) this.weaponSystem.shoot();
        this.weaponSystem.update(deltaTime);
    }

    draw() {
        if (!this.active) return;
        this.ctx.globalAlpha = this.alpha;
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.globalAlpha = 1;
        this.weaponSystem.draw();
    }

    saveState() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            type: this.type,
            active: this.active
        };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.type = state.type;
        this.active = state.active;
        this.image = this.game.assets.images['assets/images/enemy_stealth.png'] || new Image();
    }
}