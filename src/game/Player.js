import WeaponSystem from './weapons/WeaponSystem.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 64;
        this.height = 64;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = game.canvas.height - this.height - 10;
        this.speed = 5;
        this.health = 100;
        this.weaponSystem = new WeaponSystem(this); // 正确实例化
        this.frameX = 0;
        this.frameY = 0;
        this.frameCount = 6;
        this.spriteWidth = 64;
        this.spriteHeight = 64;
    }

    resize(width, height) {
        this.x = width / 2 - this.width / 2;
        this.y = height - this.height - 10;
    }

    update() {
        const input = this.game.input;
        if (input.keys.includes('ArrowLeft') || input.keys.includes('KeyA')) this.x -= this.speed;
        if (input.keys.includes('ArrowRight') || input.keys.includes('KeyD')) this.x += this.speed;
        if (input.keys.includes('ArrowUp') || input.keys.includes('KeyW')) this.y -= this.speed;
        if (input.keys.includes('ArrowDown') || input.keys.includes('KeyS')) this.y += this.speed;
        if (input.keys.includes('Space')) this.shoot();

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.canvas.width - this.width) this.x = this.game.canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.canvas.height - this.height) this.y = this.game.canvas.height - this.height;

        this.frameX = (this.frameX + 1) % this.frameCount;
    }

    draw() {
        const playerSheet = this.game.images['assets/images/player_sheet.png'];
        if (playerSheet) {
            this.game.ctx.drawImage(
                playerSheet,
                this.frameX * this.spriteWidth, 0,
                this.spriteWidth, this.spriteHeight,
                this.x, this.y,
                this.width, this.height
            );
        } else {
            this.game.ctx.fillStyle = '#00d4ff';
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    shoot() {
        if (this.weaponSystem) this.weaponSystem.shoot();
    }

    saveState() {
        return { x: this.x, y: this.y, health: this.health };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
    }
}