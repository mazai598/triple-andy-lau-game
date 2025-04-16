export default class WeaponSystem {
    constructor(player) {
        this.player = player;
        this.game = player.game;
        this.bullets = [];
        this.currentWeapon = 'normal';
        this.shootTimer = 0;
        this.weaponConfig = {
            normal: { speed: 10, damage: 20, rate: 0.2, sound: 'shoot', img: 'bullet', width: 10, height: 20 },
            laser: { speed: 15, damage: 30, rate: 0.3, sound: 'laser', img: 'bullet_laser', width: 5, height: 10 },
            penta: { speed: 8, damage: 15, rate: 0.5, sound: 'penta', img: 'bullet_penta', width: 12, height: 24 },
            wave: { speed: 12, damage: 25, rate: 0.4, sound: 'wave', img: 'bullet_wave', width: 12, height: 20 }
        };
    }

    setWeapon(type) {
        if (['normal', 'laser', 'penta', 'wave'].includes(type)) {
            this.currentWeapon = type;
        }
    }

    shoot() {
        this.shootTimer += 0.1;
        const config = this.weaponConfig[this.currentWeapon];
        if (this.shootTimer >= config.rate) {
            this.game.bulletsFired++;
            if (this.currentWeapon === 'penta') {
                for (let i = -2; i <= 2; i++) {
                    this.bullets.push({
                        x: this.player.x + this.player.width / 2,
                        y: this.player.y,
                        width: config.width,
                        height: config.height,
                        speed: config.speed,
                        damage: config.damage,
                        angle: i * 0.2,
                        active: true
                    });
                }
            } else {
                this.bullets.push({
                    x: this.player.x + this.player.width / 2 - config.width / 2,
                    y: this.player.y,
                    width: config.width,
                    height: config.height,
                    speed: config.speed,
                    damage: config.damage,
                    angle: 0,
                    active: true
                });
            }
            if (this.game.sounds && this.game.sounds[config.sound]) this.game.sounds[config.sound].play();
            this.shootTimer = 0;
        }
    }

    update() {
        this.bullets.forEach(bullet => {
            if (bullet.active) {
                bullet.x += Math.sin(bullet.angle) * bullet.speed;
                bullet.y -= bullet.speed * Math.cos(bullet.angle);
                if (bullet.y < -bullet.height || bullet.x < -bullet.width || bullet.x > this.game.canvas.width) {
                    bullet.active = false;
                }
            }
        });
        this.bullets = this.bullets.filter(b => b.active);
    }

    draw() {
        const ctx = this.game.ctx;
        this.bullets.forEach(bullet => {
            const img = this.game.images[`assets/images/${this.weaponConfig[this.currentWeapon].img}.png`];
            if (img) {
                ctx.drawImage(img, bullet.x, bullet.y, bullet.width, bullet.height);
            } else {
                ctx.fillStyle = this.currentWeapon === 'laser' ? '#00ff00' : '#ff0000';
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            }
        });
    }
}