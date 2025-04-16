export default class Powerup {
    constructor(game) {
        this.game = game;
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 3;
        this.type = ['laser', 'penta', 'wave', 'life', 'energy'][Math.floor(Math.random() * 5)];
        this.active = true;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.active = false;
        this.game.dirtyRegions.push({
            x: this.x - 10,
            y: this.y - 10,
            w: this.width + 20,
            h: this.height + 20
        });
    }

    draw() {
        const ctx = this.game.ctx;
        const img = this.game.images[`assets/images/powerup_${this.type}.png`];
        if (img && img.complete) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            const colors = {
                laser: '#00ff00',
                penta: '#ff00ff',
                wave: '#00d4ff',
                life: '#ff5555',
                energy: '#ffff00'
            };
            ctx.fillStyle = colors[this.type];
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            if (this.game.quality === 'high') {
                ctx.shadowBlur = 10;
                ctx.shadowColor = colors[this.type];
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    saveState() {
        return { x: this.x, y: this.y, type: this.type, active: this.active };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.type = state.type;
        this.active = state.active;
    }
}