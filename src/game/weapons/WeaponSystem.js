import NormalWeapon from './NormalWeapon.js';
import LaserWeapon from './LaserWeapon.js';
import WaveWeapon from './WaveWeapon.js';

export default class WeaponSystem {
    constructor(player) {
        this.player = player;
        this.game = player.game;
        this.bullets = [];
        this.currentWeapon = 'normal';
        this.weapons = {
            normal: new NormalWeapon(this.game),
            laser: new LaserWeapon(this.game),
            wave: new WaveWeapon(this.game)
        };
        this.shootCooldown = 0;
    }

    setWeapon(type) {
        if (this.weapons[type]) {
            this.currentWeapon = type;
            console.log(`玩家切换武器至: ${type}`);
        }
    }

    shoot() {
        if (this.shootCooldown > 0) return;
        try {
            this.weapons[this.currentWeapon].shoot(this.player.x + this.player.width / 2, this.player.y);
            this.shootCooldown = this.weapons[this.currentWeapon].cooldown;
        } catch (error) {
            console.error('武器射击失败:', error);
        }
    }

    update() {
        this.shootCooldown--;
        this.bullets = this.bullets.filter(bullet => bullet.active);
        this.bullets.forEach(bullet => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) bullet.active = false;
        });
    }

    draw() {
        try {
            this.bullets.forEach(bullet => {
                if (bullet.active) {
                    const bulletImage = this.game.images[bullet.imagePath];
                    if (bulletImage) {
                        this.game.ctx.drawImage(bulletImage, bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
                    } else {
                        this.game.ctx.fillStyle = bullet.color || '#ff0000';
                        this.game.ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
                    }
                }
            });
        } catch (error) {
            console.error('武器绘制失败:', error);
        }
    }
}