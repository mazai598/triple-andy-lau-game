export default class PentaWeapon {
    constructor(weaponSystem) {
        this.weaponSystem = weaponSystem;
        this.game = weaponSystem.game;
        this.interval = 400;
        this.image = 'assets/images/bullet_penta.png';
    }

    shoot() {
        if (!this.weaponSystem.owner) {
            console.warn('PentaWeapon: owner 未定义，跳过射击');
            return;
        }
        const centerX = this.weaponSystem.owner.x + this.weaponSystem.owner.width / 2;
        const y = this.weaponSystem.owner.y;
        // 发射五发直线子弹，水平间隔
        const offsets = [-40, -20, 0, 20, 40];
        offsets.forEach(offset => {
            const bullet = {
                x: centerX + offset - 7.5,
                y: y,
                width: 15,
                height: 30,
                speed: -8,
                damage: 15,
                active: true,
                image: this.image
            };
            this.weaponSystem.bullets.push(bullet);
        });
        this.game.player.audioEngine.play('penta');
    }
}