export default class WaveWeapon {
    constructor() {
        this.shootDelay = 0.3;
        this.lastShot = 0;
    }

    shoot(x, y, bullets) {
        const now = Date.now() / 1000;
        if (now - this.lastShot < this.shootDelay) return;
        this.lastShot = now;
        for (let i = -2; i <= 2; i++) {
            bullets.push({
                x: x - 5 + i * 10,
                y,
                width: 10,
                height: 20,
                speed: 8,
                dx: i * 0.5,
                damage: 15,
                active: true,
                color: '#00d4ff',
                type: 'wave'
            });
        }
    }
}