import WeaponSystem from '../weapons/WeaponSystem.js';

export default class BossEnemy {
    constructor(game, wave) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.type = 'boss';
        this.width = 128;
        this.height = 128;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = -this.height;
        this.speed = 1;
        this.health = 500 + wave * 50;
        this.active = true;
        this.weaponSystem = new WeaponSystem(this, 'boss');
        this.image = game.assets.images['assets/images/boss_mini.png'] || new Image();
    }

    update(player, deltaTime = 16.67) {
        if (!this.active) return;
        const speed = this.speed * (deltaTime / 16.67);
        if (this.y < 50) this.y += speed;
        if (Math.random() < 0.03) this.weaponSystem.shoot();
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
        this.image = this.game.assets.images['assets/images/boss_mini.png'] || new Image();
    }
}