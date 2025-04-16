export default class NormalWeapon {
    constructor() {
        this.shootDelay = 0.2;
        this.lastShot = 0;
    }

    shoot(x, y, bullets) {
        const now = Date.now() / 1000;
        if (now - this.lastShot < this.shootDelay) return;
        this.lastShot = now;
        bullets.push({
            x: x - 5,
            y,
            width: 10,
            height: 20,
            speed: 10,
            damage: 20,
            active: true,
            color: '#fff'
        });
    }
}