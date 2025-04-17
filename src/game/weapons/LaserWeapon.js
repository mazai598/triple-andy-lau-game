export default class LaserWeapon {
    constructor(game) {
        this.game = game;
        this.cooldown = 15;
    }

    shoot(x, y) {
        this.game.player.weaponSystem.bullets.push({
            x: x,
            y: y,
            width: 4,
            height: 20,
            speed: 15,
            damage: 20,
            active: true,
            imagePath: 'assets/images/bullet_laser.png',
            color: '#00ffcc'
        });
        if (this.game.audioEngine.effects.laser) this.game.audioEngine.effects.laser.play();
    }
}