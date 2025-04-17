import LaserShot from './weapons/LaserShot.js';

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
        this.types = ['life', 'energy', 'laser', 'wave', 'penta'];
        this.type = type || this.types[Math.floor(Math.random() * this.types.length)];
        this.image = game.assets.images[`assets/images/powerup_${this.type}.png`] || game.assets.images['assets/images/powerup_life.png'] || new Image();
        console.log(`生成道具: ${this.type} at (${this.x.toFixed(2)}, ${this.y.toFixed(2)})`);
    }

    update(deltaTime = 16.67) {
        if (!this.active) return;
        this.y += this.speed * (deltaTime / 16.67);
        if (this.y > this.canvas.height) {
            this.active = false;
            console.log(`道具 ${this.type} 移出屏幕 at (${this.x.toFixed(2)}, ${this.y.toFixed(2)})`);
        }
    }

    draw() {
        if (!this.active) return;
        if (!this.image || this.image.width === 0) {
            console.warn(`道具 ${this.type} 图片未加载，使用默认渲染`);
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    applyEffect(player) {
        console.log(`应用道具效果: ${this.type}`);
        switch (this.type) {
            case 'life':
                player.health = Math.min(player.health + 50, 100);
                console.log('生命道具生效, 新生命:', player.health);
                break;
            case 'energy':
                player.laserCharges = (player.laserCharges || 0) + 1;
                console.log('能量道具生效, 激光次数:', player.laserCharges);
                break;
            case 'laser':
                const laserShot = new LaserShot(player.weaponSystem);
                laserShot.shoot();
                console.log('激光道具生效，直接发射');
                break;
            case 'wave':
                player.weaponSystem.setWeapon('wave');
                console.log('波形武器道具生效');
                break;
            case 'penta':
                player.weaponSystem.setWeapon('penta');
                console.log('五联武器道具生效');
                break;
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
        this.image = this.game.assets.images[`assets/images/powerup_${this.type}.png`] || this.game.assets.images['assets/images/powerup_life.png'] || new Image();
    }
}