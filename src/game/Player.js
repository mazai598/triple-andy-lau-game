export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = game.canvas.height - this.height - 20;
        this.speed = 5;
        this.health = 100;
        this.shield = 0;
        this.weaponSystem = { bullets: [], setWeapon: (type) => console.log(`武器切换至: ${type}`) };
    }

    update(keys) {
        if (keys.includes(settings.keyBindings.left[0]) || keys.includes('left')) this.x -= this.speed;
        if (keys.includes(settings.keyBindings.right[0]) || keys.includes('right')) this.x += this.speed;
        if (keys.includes(settings.keyBindings.up[0]) || keys.includes('up')) this.y -= this.speed;
        if (keys.includes(settings.keyBindings.down[0]) || keys.includes('down')) this.y += this.speed;
        if (keys.includes(settings.keyBindings.shoot[0]) || keys.includes('shoot')) this.shoot();

        this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));
    }

    draw() {
        this.game.ctx.fillStyle = '#00ffcc';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    shoot() {
        this.weaponSystem.bullets.push({ x: this.x + this.width / 2, y: this.y, active: true });
    }

    resize(width, height) {
        this.width = 50 * (width / 1920);
        this.height = 50 * (height / 1440);
        this.x = Math.max(0, Math.min(this.x, width - this.width));
        this.y = Math.max(0, Math.min(this.y, height - this.height));
    }

    saveState() {
        return { x: this.x, y: this.y, health: this.health, shield: this.shield };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.shield = state.shield || 0;
    }
}