import NormalWeapon from './NormalWeapon.js';
import LaserWeapon from './LaserWeapon.js';
import WaveWeapon from './WaveWeapon.js';
import PentaWeapon from './PentaWeapon.js';
import LaserShot from './LaserShot.js';

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
            penta: new PentaWeapon(this),
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
            if (bullet.duration) {
                bullet.duration -= deltaTime;
                if (bullet.duration <= 0) bullet.active = false;
            } else if (bullet.speedX || bullet.offset) {
                bullet.x += (bullet.speedX || 0) * (deltaTime / 16.67);
                bullet.y += (bullet.speedY || bullet.speed || 0) * (deltaTime / 16.67);
                if (bullet.offset) {
                    bullet.offset += (deltaTime / 16.67) * 0.1;
                    bullet.x += Math.sin(bullet.offset) * 5;
                }
                if (bullet.y < -bullet.height || bullet.y > this.game.canvas.height) bullet.active = false;
            } else {
                bullet.y += bullet.speed * (deltaTime / 16.67);
                if (bullet.y < -bullet.height || bullet.y > this.game.canvas.height) bullet.active = false;
            }
        });
        this.bullets = this.bullets.filter(b => b.active);
    }

    draw() {
        this.bullets.forEach(bullet => {
            if (!bullet.active) return;
            const image = this.game.assets.images[bullet.image] || this.game.assets.images['assets/images/bullet.png'];
            if (!image || image.width === 0) {
                console.warn(`子弹图片 ${bullet.image} 未加载，使用默认渲染`);
                this.ctx.fillStyle = bullet.image === 'assets/images/laser.png' ? 'cyan' : 'red';
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            } else {
                this.ctx.drawImage(image, bullet.x, bullet.y, bullet.width, bullet.height);
            }
        });
    }

    setWeapon(type) {
        if (this.weapons[type]) {
            this.currentWeapon = type;
            console.log(`切换武器: ${type}`);
        } else {
            console.warn(`武器类型 ${type} 不存在`);
        }
    }
}