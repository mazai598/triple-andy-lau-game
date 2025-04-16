export default class StealthEnemy {
    constructor(game, wave) {
        this.game = game;
        this.isBoss = false;
        this.type = 'stealth';
        this.width = 45;
        this.height = 45;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 4 + wave * 0.3;
        this.health = 60;
        this.bullets = [];
        this.shootTimer = 0;
        this.active = true;
        this.cloakTimer = 0;
        this.isCloaked = false;
        this.velocityX = (Math.random() - 0.5) * 4;
    }

    update() {
        this.y += this.speed;
        this.x += this.velocityX;
        if (Math.random() < 0.02) {
            this.velocityX = (Math.random() - 0.5) * 4;
        }
        if (this.x < 0 || this.x > this.game.canvas.width - this.width) {
            this.velocityX = -this.velocityX;
        }
        if (this.y > this.game.canvas.height) this.active = false;

        this.cloakTimer += 0.1;
        if (this.cloakTimer > 3) {
            this.isCloaked = !this.isCloaked;
            this.cloakTimer = 0;
        }

        this.shootTimer += 0.1;
        if (this.shootTimer > 1.5 && !this.isCloaked) {
            this.bullets.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                width: 10,
                height: 20,
                speed: 8,
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
    }

    draw() {
        const ctx = this.game.ctx;
        const img = this.game.images['assets/images/enemy_stealth.png'];
        ctx.globalAlpha = this.isCloaked ? 0.3 : 1;
        if (img) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#8888ff';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        this.bullets.forEach(bullet => {
            const bulletImg = this.game.images['assets/images/enemy_bullet.png'];
            if (bulletImg) {
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
            cloakTimer: this.cloakTimer,
            isCloaked: this.isCloaked,
            velocityX: this.velocityX
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
        this.cloakTimer = state.cloakTimer || 0;
        this.isCloaked = state.isCloaked || false;
        this.velocityX = state.velocityX || 0;
    }
}