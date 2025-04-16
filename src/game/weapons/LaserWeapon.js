export default class LaserWeapon {
    constructor() {
        this.shootDelay = 0.1;
        this.lastShot = 0;
    }

    shoot(x, y, bullets) {
        const now = Date.now() / 1000;
        if (now - this.lastShot < this.shootDelay) return;
        this.lastShot = now;
        bullets.push({
            x: x - 3,
            y,
            width: 6,
            height: 30,
            speed: 15,
            damage: 30,
            active: true,
            color: '#00ff00',
            type: 'laser'
        });
    }
}