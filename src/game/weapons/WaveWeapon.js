export default class WaveWeapon {
    constructor(weaponSystem) {
        this.weaponSystem = weaponSystem;
        this.game = weaponSystem.game;
        this.interval = 300;
        this.image = 'assets/images/bullet_wave.png';
    }

    shoot() {
        if (!this.weaponSystem.owner) {
            console.warn('WaveWeapon: owner 未定义，跳过射击');
            return;
        }
        const centerX = this.weaponSystem.owner.x + this.weaponSystem.owner.width / 2;
        const y = this.weaponSystem.owner.y;
        // 发射三道波形射线
        const offsets = [-15, 0, 15];
        offsets.forEach(offset => {
            const bullet = {
                x: centerX + offset - 10,
                y: y,
                width: 20,
                height: 20,
                speed: -6,
                damage: 25,
                active: true,
                image: this.image,
                offset: 0 // 用于正弦波动
            };
            this.weaponSystem.bullets.push(bullet);
        });
        this.game.player.audioEngine.play('wave');
    }
}