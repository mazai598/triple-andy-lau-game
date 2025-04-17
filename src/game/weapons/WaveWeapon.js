export default class WaveWeapon {
    constructor(game) {
        this.game = game;
        this.cooldown = 20;
    }

    shoot(x, y) {
        this.game.player.weaponSystem.bullets.push({
            x: x,
            y: y,
            width: 10,
            height: 15,
            speed: 12,
            damage: 15,
            active: true,
            imagePath: 'assets/images/bullet_wave.png',
            color: '#ffcc00'
        });
        if (this.game.audioEngine.effects.wave) this.game.audioEngine.effects.wave.play();
    }
}