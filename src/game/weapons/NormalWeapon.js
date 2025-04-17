export default class NormalWeapon {
    constructor(game) {
        this.game = game;
        this.cooldown = 10;
    }

    shoot(x, y) {
        this.game.player.weaponSystem.bullets.push({
            x: x,
            y: y,
            width: 2,
            height: 10,
            speed: 10,
            damage: 10,
            active: true,
            imagePath: 'assets/images/bullet.png',
            color: '#ff0000'
        });
        if (this.game.audioEngine.effects.shoot) this.game.audioEngine.effects.shoot.play();
    }
}