import WeaponSystem from '../weapons/WeaponSystem.js';

export default class Enemy {
    constructor(game, wave, type = 'small') {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.type = type;
        this.width = { small: 32, medium: 48, large: 64 }[type] || 32;
        this.height = this.width;
        this.x = Math.random() * (this.canvas.width - this.width);
        this.y = -this.height;
        this.speed = { small: 3, medium: 2, large: 1.5 }[type] || 3;
        this.health = { small: 20, medium: 40, large: 60 }[type] || 20;
        this.active = true;
        this.weaponSystem = new WeaponSystem(this, 'enemy');
        this.image = game.assets.images[`assets/images/enemy_${type}.png`] || new Image();
    }

    update(player, deltaTime = 16.67) {
        if (!this.active) return;
        const speed = this.speed * (deltaTime / 16.67);
        this.y += speed;
        if (this.y > this.canvas.height) this.active = false;
        if (Math.random() < 0.01) this.weaponSystem.shoot();
        this.weaponSystem.update(deltaTime);
    }

    draw() {
        if (!this.active) return;
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
        this.image = this.game.assets.images[`assets/images/enemy_${this.type}.png`] || new Image();
    }
}