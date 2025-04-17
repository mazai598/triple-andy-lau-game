export default class Powerup {
    constructor(game, type = null) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.width = 32;
        this.height = 32;
        this.x = Math.random() * (this.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2;
        this.active = true;
        this.types = ['life', 'energy', 'laser', 'wave'];
        this.type = type || this.types[Math.floor(Math.random() * this.types.length)];
        this.image = game.assets.images[`assets/images/powerup_${this.type}.png`] || new Image();
    }

    update(deltaTime = 16.67) {
        if (!this.active) return;
        this.y += this.speed * (deltaTime / 16.67);
        if (this.y > this.canvas.height) this.active = false;
    }

    draw() {
        if (!this.active) return;
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    applyEffect(player) {
        if (this.type === 'life') {
            player.health = Math.min(player.health + 50, 100);
            console.log('生命道具生效, 新生命:', player.health);
        } else if (this.type === 'energy') {
            player.health += 30;
            console.log('能量道具生效, 新生命:', player.health);
        } else if (this.type === 'laser') {
            player.weaponSystem.setWeapon('laser');
            console.log('激光武器道具生效');
        } else if (this.type === 'wave') {
            player.weaponSystem.setWeapon('wave');
            console.log('波形武器道具生效');
        }
    }

    saveState() {
        return {
            x: this.x,
            y: this.y,
            type: this.type,
            active: this.active
        };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.type = state.type;
        this.active = state.active;
        this.image = this.game.assets.images[`assets/images/powerup_${this.type}.png`] || new Image();
    }
}