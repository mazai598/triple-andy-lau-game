export default class Enemy {
    constructor(game, wave, isBoss = false, type = 'small') {
        this.game = game;
        this.isBoss = isBoss;
        this.type = type;
        this.width = isBoss ? 100 : type === 'large' ? 60 : type === 'medium' ? 50 : 40;
        this.height = isBoss ? 100 : type === 'large' ? 60 : type === 'medium' ? 50 : 40;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = isBoss ? 2 : 3 + wave * 0.2;
        this.health = isBoss ? 200 : type === 'large' ? 100 : type === 'medium' ? 75 : 50;
        this.bullets = [];
        this.shootTimer = 0;
        this.active = true;
        this.angle = 0;
    }

    update() {
        this.y += this.speed;
        if (!this.isBoss) {
            this.angle += 0.05;
            this.x += Math.sin(this.angle) * 2;
        }
        if (this.y > this.game.canvas.height || this.x < -this.width || this.x > this.game.canvas.width) {
            this.active = false;
        }

        this.shootTimer += 0.1;
        if (this.shootTimer > (this.isBoss ? 0.5 : 2)) {
            this.bullets.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                width: 5,
                height: 10,
                speed: 7,
                active: true
            });
            this.game.sounds.missile.play();
            this.shootTimer = 0;
        }

        this.bullets.forEach(bullet => {
            if (bullet.active) {
                bullet.y += bullet.speed;
                if (bullet.y > this.game.canvas.height) bullet.active = false;
            }
        });
        this.bullets = this.bullets.filter(b => b.active);

        this.game.dirtyRegions.push({
            x: this.x - 10,
            y: this.y - 10,
            w: this.width + 20,
            h: this.height + 20
        });
    }

    draw() {
        const ctx = this.game.ctx;
        const img = this.game.images[this.isBoss ? 'assets/images/boss_final.png' : `assets/images/enemy_${this.type}.png`];
        if (img && img.complete) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            const colors = { small: '#ff5555', medium: '#ffaaaa', large: '#ff0000', boss: '#ff0000' };
            ctx.fillStyle = colors[this.isBoss ? 'boss' : this.type];
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            if (this.game.quality === 'high') {
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors[this.isBoss ? 'boss' : this.type];
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        this.bullets.forEach(bullet => {
            const bulletImg = this.game.images['assets/images/enemy_bullet.png'];
            if (bulletImg && bulletImg.complete) {
                ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
            } else {
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            }
        });
    }

    saveState() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            isBoss: this.isBoss,
            type: this.type,
            active: this.active,
            bullets: this.bullets,
            angle: this.angle
        };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.isBoss = state.isBoss;
        this.type = state.type;
        this.active = state.active;
        this.bullets = state.bullets;
        this.angle = state.angle || 0;
    }
}