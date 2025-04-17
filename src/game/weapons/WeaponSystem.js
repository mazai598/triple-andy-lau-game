import NormalWeapon from './NormalWeapon.js';
import LaserWeapon from './LaserWeapon.js';
import WaveWeapon from './WaveWeapon.js';

export default class WeaponSystem {
    constructor(owner, type = 'player') {
        this.owner = owner;
        this.game = owner.game;
        this.ctx = owner.ctx;
        this.bullets = [];
        this.currentWeapon = type === 'player' ? 'normal' : 'enemy';
        this.weapons = {
            normal: new NormalWeapon(this),
            laser: new LaserWeapon(this),
            wave: new WaveWeapon(this),
            enemy: new NormalWeapon(this, 'enemy'),
            boss: new NormalWeapon(this, 'boss')
        };
        this.lastShot = 0;
    }

    shoot() {
        if (!this.owner) {
            console.warn('WeaponSystem: owner 未定义，跳过射击');
            return;
        }
        const now = Date.now();
        const weapon = this.weapons[this.currentWeapon];
        if (!weapon) {
            console.warn(`WeaponSystem: 武器 ${this.currentWeapon} 不存在`);
            return;
        }
        if (now - this.lastShot < weapon.interval) return;
        this.lastShot = now;
        weapon.shoot();
    }

    update(deltaTime = 16.67) {
        this.bullets.forEach(bullet => {
            if (!bullet.active) return;
            bullet.y += bullet.speed * (deltaTime / 16.67);
            if (bullet.y < 0 || bullet.y > this.game.canvas.height) bullet.active = false;
        });
        this.bullets = this.bullets.filter(b => b.active);
    }

    draw() {
        this.bullets.forEach(bullet => {
            if (!bullet.active) return;
            const image = this.game.assets.images[bullet.image] || this.game.assets.images['assets/images/bullet.png'];
            this.ctx.drawImage(image, bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    setWeapon(type) {
        if (this.weapons[type]) this.currentWeapon = type;
    }
}