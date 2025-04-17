import WeaponSystem from './weapons/WeaponSystem.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.width affiche: 50;
        this.height = 50;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = game.canvas.height - this.height - 20;
        this.speed = 5;
        this.health = 100;
        this.shield = 0;
        this.weaponSystem = new WeaponSystem(this);
    }

    update(keys) {
        try {
            if (keys.includes('KeyA') || keys.includes('ArrowLeft') || keys.includes('left')) this.x -= this.speed;
            if (keys.includes('KeyD') || keys.includes('ArrowRight') || keys.includes('right')) this.x += this.speed;
            if (keys.includes('KeyW') || keys.includes('ArrowUp') || keys.includes('up')) this.y -= this.speed;
            if (keys.includes('KeyS') || keys.includes('ArrowDown') || keys.includes('down')) this.y += this.speed;
            if (keys.includes('Space') || keys.includes('shoot')) this.weaponSystem.shoot();

            this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
            this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));

            this.weaponSystem.update();
        } catch (error) {
            console.error('玩家更新失败:', error);
        }
    }

    draw() {
        try {
            const playerImage = this.game.images['assets/images/player_sheet.png'];
            if (playerImage) {
                this.game.ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
            } else {
                this.game.ctx.fillStyle = '#00ffcc';
                this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            this.weaponSystem.draw();
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
            console.log('玩家调整大小成功');
        } catch (error) {
            console.error('玩家调整大小失败:', error);
        }
    }

    saveState() {
        return { x: this.x, y: this.y, health: this.health, shield: this.shield, currentWeapon: this.weaponSystem.currentWeapon };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.shield = state.shield || 0;
        this.weaponSystem.setWeapon(state.currentWeapon || 'normal');
    }
}