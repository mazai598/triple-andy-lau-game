export default class HUD {
    constructor(game) {
        this.game = game;
        this.fontSize = 24;
        this.fontFamily = 'PixelFont, sans-serif';
        this.ctx = game.ctx;
        this.width = game.canvas.width;
        this.height = game.canvas.height;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    updateLanguage() {
        // 语言更新逻辑由主程序处理，此处仅准备数据
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 200);
        this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.ctx.fillStyle = '#00ff00';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        const translations = {
            zh: {
                score: `分数: ${this.game.score.toLocaleString()}`,
                wave: `波次: ${this.game.wave}`,
                health: `生命值: ${this.game.player.health}`,
                bulletsFired: `发射子弹: ${this.game.bulletsFired.toLocaleString()}`,
                bulletsHit: `命中子弹: ${this.game.bulletsHit.toLocaleString()}`,
                accuracy: `命中率: ${(this.game.bulletsFired > 0 ? (this.game.bulletsHit / this.game.bulletsFired * 100).toFixed(1) : 0)}%`,
                multiplier: `倍数: x${this.game.scoreMultiplier.toFixed(1)}`,
                enemiesLeft: `剩余敌人: ${this.game.enemies.length}`
            },
            en: {
                score: `Score: ${this.game.score.toLocaleString()}`,
                wave: `Wave: ${this.game.wave}`,
                health: `Health: ${this.game.player.health}`,
                bulletsFired: `Bullets Fired: ${this.game.bulletsFired.toLocaleString()}`,
                bulletsHit: `Bullets Hit: ${this.game.bulletsHit.toLocaleString()}`,
                accuracy: `Accuracy: ${(this.game.bulletsFired > 0 ? (this.game.bulletsHit / this.game.bulletsFired * 100).toFixed(1) : 0)}%`,
                multiplier: `Multiplier: x${this.game.scoreMultiplier.toFixed(1)}`,
                enemiesLeft: `Enemies Left: ${this.game.enemies.length}`
            }
        };

        const lang = this.game.settings.language || 'zh';
        const stats = translations[lang];
        let y = 20;
        for (const [key, value] of Object.entries(stats)) {
            this.ctx.fillText(value, 20, y);
            y += this.fontSize + 5;
        }

        this.ctx.restore();
    }

    showGameOver() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(this.width / 4, this.height / 4, this.width / 2, this.height / 2);
        this.ctx.font = `${this.fontSize * 2}px ${this.fontFamily}`;
        this.ctx.fillStyle = '#ff0000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.game.settings.language === 'zh' ? '游戏结束' : 'Game Over', this.width / 2, this.height / 2 - 50);
        this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.ctx.fillText(this.game.settings.language === 'zh' ? '按 R 重新开始' : 'Press R to Restart', this.width / 2, this.height / 2);
        this.ctx.restore();
    }

    showPauseMenu() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(this.width / 4, this.height / 4, this.width / 2, this.height / 2);
        this.ctx.font = `${this.fontSize * 2}px ${this.fontFamily}`;
        this.ctx.fillStyle = '#ffff00';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.game.settings.language === 'zh' ? '暂停' : 'Paused', this.width / 2, this.height / 2 - 50);
        this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.ctx.fillText(this.game.settings.language === 'zh' ? '按 P 继续' : 'Press P to Resume', this.width / 2, this.height / 2);
        this.ctx.fillText(this.game.settings.language === 'zh' ? '按 M 返回主菜单' : 'Press M for Main Menu', this.width / 2, this.height / 2 + 50);
        this.ctx.restore();
    }
}