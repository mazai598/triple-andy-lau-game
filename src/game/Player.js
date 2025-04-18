import WeaponSystem from './weapons/WeaponSystem.js';
import AudioEngine from '../utils/AudioEngine.js';
import LaserShot from './weapons/LaserShot.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.width = 64; // 显示尺寸（缩放后）
        this.height = 64;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = this.canvas.height - this.height - 20;
        this.speed = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.laserCharges = 0;
        this.weaponSystem = new WeaponSystem(this);
        this.audioEngine = new AudioEngine(game.assets);
        this.audioEngine.setVolume(game.settings.soundVolume);
        // 三帧动画 (384x128, 每帧 128x128)
        this.frame = 0; // 0: 静止, 1: 左倾, 2: 右倾
        this.frameWidth = 128; // 原始帧宽
        this.frameHeight = 128; // 原始帧高
        this.image = game.assets.images['assets/images/player_sheet.png'] || new Image();
        if (!this.image || this.image.width === 0) {
            console.warn('玩家战机图片 player_sheet.png 未加载');
        } else {
            console.log('玩家战机图片加载成功，尺寸:', this.image.width, 'x', this.image.height);
        }
        // 尾焰粒子
        this.trailTimer = 0;
        this.trailInterval = 100;
    }

    update(keys, deltaTime = 16.67) {
        let moveX = 0;
        if (keys.left) moveX -= this.speed;
        if (keys.right) moveX += this.speed;
        if (keys.up) this.y -= this.speed;
        if (keys.down) this.y += this.speed;
        if (keys.shoot) this.weaponSystem.shoot();
        if (keys.laser && this.laserCharges > 0) {
            const laserShot = new LaserShot(this.weaponSystem);
            laserShot.shoot();
            this.laserCharges--;
            console.log('玩家触发激光, 剩余次数:', this.laserCharges);
        }

        this.frame = moveX < 0 ? 1 : moveX > 0 ? 2 : 0;

        this.x += moveX * (deltaTime / 16.67);
        this.x = Math.max(0, Math.min(this.x, this.canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.canvas.height - this.height));

        this.weaponSystem.update(deltaTime);

        // 尾焰粒子效果
        this.trailTimer += deltaTime;
        if (this.trailTimer >= this.trailInterval) {
            this.game.particles.addTrail(this.x + this.width / 2 - 5, this.y + this.height, 10, 10);
            this.trailTimer = 0;
        }
    }

    draw() {
        if (!this.image || this.image.width === 0) {
            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            this.ctx.drawImage(
                this.image,
                this.frame * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                this.x, this.y,
                this.width, this.height
            );
        }
        this.weaponSystem.draw();
    }

    resize(width, height) {
        this.x = width / 2 - this.width / 2;
        this.y = height - this.height - 20;
    }

    saveState() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            laserCharges: this.laserCharges,
            weapon: this.weaponSystem.currentWeapon
        };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.laserCharges = state.laserCharges;
        this.weaponSystem.setWeapon(state.weapon);
    }
}