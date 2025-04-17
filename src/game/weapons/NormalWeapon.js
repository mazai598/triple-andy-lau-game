export default class NormalWeapon {
    constructor(weaponSystem, type = 'player') {
        this.weaponSystem = weaponSystem;
        this.game = weaponSystem.game;
        this.interval = type === 'player' ? 200 : type === 'boss' ? 300 : 500;
        this.image = type === 'player' ? 'assets/images/bullet.png' : 'assets/images/enemy_bullet.png';
    }

    shoot() {
        const bullet = {
            x: this.weaponSystem.owner.x + this.weaponSystem.owner.width / 2 - 5,
            y: this.weaponSystem.owner.y,
            width: 10,
            height: 20,
            speed: self.weaponSystem.owner === this.game.player ? -10 : 5,
            damage: this.weaponSystem.owner === this.game.player ? 10 : 15,
            active: true,
            image: this.image
        };
        this.weaponSystem.bullets.push(bullet);
        this.game.player.audioEngine.play('shoot');
    }
}