export default class Powerup {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 3 + game.difficulty;
        this.active = true;
        this.type = ['life', 'energy', 'laser', 'penta', 'shield'][Math.floor(Math.random() * 5)];
        this.image = game.images[`assets/images/powerup_${this.type}.png`] || null;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.active = false;
    }

    draw() {
        if (this.image) {
            this.game.ctx.save();
            this.game.ctx.filter = 'drop-shadow(0 0 10px #00ffcc)';
            this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            this.game.ctx.restore();
        } else {
            this.game.ctx.fillStyle = '#00ffcc';
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    resize(width, height) {
        this.width = 40 * (width / 1920);
        this.height = 40 * (height / 1440);
        this.x = Math.max(0, Math.min(this.x, width - this.width));
        this.y = Math.max(-this.height, Math.min(this.y, height));
    }

    saveState() {
        return { x: this.x, y: this.y, active: this.active, type: this.type };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.active = state.active;
        this.type = state.type;
    }
}