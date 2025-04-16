export default class Powerup {
    constructor(game) {
        this.game = game;
        this.width = 32;
        this.height = 32;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2;
        this.active = true;
        this.type = ['life', 'energy', 'laser', 'penta', 'wave'][Math.floor(Math.random() * 5)];
        this.image = game.images[`assets/images/powerup_${this.type}.png`] || null;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) {
            this.active = false;
        }
    }

    draw() {
        if (this.image) {
            this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            this.game.ctx.fillStyle = '#ff0';
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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