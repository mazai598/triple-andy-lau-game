export default class WaveWeapon {
    constructor(weaponSystem) {
        this.weaponSystem = weaponSystem;
        this.game = weaponSystem.game;
        this.interval = 300;
        this.image = 'assets/images/bullet_wave.png';
    }

    shoot() {
        const bullet = {
            x: this.weaponSystem.owner.x + this.weaponSystem.owner.width / 2 - 5,
            y: this.weaponSystem.owner.y,
            width: 15,
            height: 25,
            speed: -8,
            damage: 25,
            active: true,
            image: this.image
        };
        this.weaponSystem.bullets.push(bullet);
        this.game.player.audioEngine.play('wave');
    }
}