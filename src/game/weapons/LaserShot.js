export default class LaserShot {
    constructor(weaponSystem) {
        this.weaponSystem = weaponSystem;
        this.game = weaponSystem.game;
        this.image = 'assets/images/laser.png';
    }

    shoot() {
        if (!this.weaponSystem.owner) {
            console.warn('LaserShot: owner 未定义，跳过射击');
            return;
        }
        const centerX = this.weaponSystem.owner.x + this.weaponSystem.owner.width / 2;
        const y = this.weaponSystem.owner.y;
        // 脉冲激光（细长变粗）
        const laser = {
            x: centerX - 10,
            y: y - this.game.canvas.height,
            width: 20,
            height: this.game.canvas.height,
            speed: -10,
            damage: 50,
            active: true,
            image: this.image
        };
        // 火花效果
        const flash = {
            x: centerX - 10,
            y: y - 10,
            width: 20,
            height: 20,
            active: true,
            image: 'assets/images/muzzle_flash.png',
            duration: 100
        };
        this.weaponSystem.bullets.push(laser, flash);
        this.game.player.audioEngine.play('laser');
    }
}