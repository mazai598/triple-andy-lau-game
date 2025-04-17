export default class NormalWeapon {
    constructor(weaponSystem, type = 'player') {
        this.weaponSystem = weaponSystem;
        this.game = weaponSystem.game;
        this.interval = type === 'player' ? 200 : type === 'boss' ? 300 : 500;
        this.image = type === 'player' ? 'assets/images/bullet.png' : 'assets/images/enemy_bullet.png';
    }

    shoot() {
        if (!this.weaponSystem.owner) {
            console.warn('NormalWeapon: owner 未定义，跳过射击');
            return;
        }
        const bullet = {
            x: this.weaponSystem.owner.x + this.weaponSystem.owner.width / 2 - 5,
            y: this.weaponSystem.owner.y,
            width: 10,
            height: 20,
            speed: this.weaponSystem.owner === this.game.player ? -10 : 5,
            damage: this.weaponSystem.owner === this.game.player ? 10 : 15,
            active: true,
            image: this.image
        };
        this.weaponSystem.bullets.push(bullet);
        this.game.player.audioEngine.play('shoot');
    }
}