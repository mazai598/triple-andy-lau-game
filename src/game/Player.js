export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = game.canvas.height - this.height - 20;
        this.speed = 5;
        this.health = 100;
        this.shield = 0;
        this.currentWeapon = 'default';
        this.shootCooldown = 0;
        this.weaponSystem = {
            bullets: [],
            setWeapon: (type) => {
                this.currentWeapon = type;
                console.log(`玩家武器切换至: ${type}`);
            }
        };
    }

    update(keys) {
        try {
            if (keys.includes('KeyA') || keys.includes('ArrowLeft') || keys.includes('left')) this.x -= this.speed;
            if (keys.includes('KeyD') || keys.includes('ArrowRight') || keys.includes('right')) this.x += this.speed;
            if (keys.includes('KeyW') || keys.includes('ArrowUp') || keys.includes('up')) this.y -= this.speed;
            if (keys.includes('KeyS') || keys.includes('ArrowDown') || keys.includes('down')) this.y += this.speed;
            if (keys.includes('Space') || keys.includes('shoot')) this.shoot();

            this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
            this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));

            this.shootCooldown--;
            this.weaponSystem.bullets.forEach(bullet => {
                bullet.y -= bullet.speed || 10;
                if (bullet.y < 0) bullet.active = false;
            });
        } catch (error) {
            console.error('玩家更新失败:', error);
        }
    }

    shoot() {
        if (this.shootCooldown > 0) return;
        try {
            if (this.currentWeapon === 'laser') {
                this.weaponSystem.bullets.push({ x: this.x + this.width / 2 - 2, y: this.y, width: 4, height: 20, speed: 15, damage: 20, active: true });
            } else if (this.currentWeapon === 'penta') {
                for (let i = -2; i <= 2; i++) {
                    this.weaponSystem.bullets.push({ x: this.x + this.width / 2 + i * 10, y: this.y, width: 2, height: 10, speed: 10, damage: 10, active: true });
                }
            } else if (this.currentWeapon === 'wave') {
                this.weaponSystem.bullets.push({ x: this.x + this.width / 2 - 5, y: this.y, width: 10, height: 15, speed: 12, damage: 15, active: true });
            } else {
                this.weaponSystem.bullets.push({ x: this.x + this.width / 2 - 1, y: this.y, width: 2, height: 10, speed: 10, damage: 10, active: true });
            }
            this.shootCooldown = 10;
        } catch (error) {
            console.error('玩家射击失败:', error);
        }
    }

    draw() {
        try {
            this.game.ctx.fillStyle = '#00ffcc';
            this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
            this.game.ctx.fillStyle = '#ff0000';
            this.weaponSystem.bullets.forEach(bullet => {
                if (bullet.active) {
                    this.game.ctx.fillRect(bullet.x, bullet.y, bullet.width || 2, bullet.height || 10);
                }
            });
        } catch (error) {
            console.error('玩家绘制失败:', error);
        }
    }

    resize(width, height) {
        try {
            this.width = 50 * (width / 1920);
            this.height = 50 * (height / 1440);
            this.x = Math.max(0, Math.min(this.x, width - this.width));
            this.y = Math.max(0, Math.min(this.y, height - this.height));
        } catch (error) {
            console.error('玩家调整大小失败:', error);
        }
    }

    saveState() {
        return { x: this.x, y: this.y, health: this.health, shield: this.shield, currentWeapon: this.currentWeapon };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.shield = state.shield || 0;
        this.currentWeapon = state.currentWeapon || 'default';
    }
}