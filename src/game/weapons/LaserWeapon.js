export default class LaserWeapon {
    constructor(weaponSystem) {
        this.weaponSystem = weaponSystem;
        this.game = weaponSystem.game;
        this.interval = 150;
        this.image = 'assets/images/bullet_laser.png';
    }

    shoot() {
        const bullet = {
            x: this.weaponSystem.owner.x + this.weaponSystem.owner.width / 2 - 5,
            y: this.weaponSystem.owner.y,
            width: 10,
            height: 30,
            speed: -12,
            damage: 20,
            active: true,
            image: this.image
        };
        this.weaponSystem.bullets.push(bullet);
        this.game.player.audioEngine.play('laser');
    }
}