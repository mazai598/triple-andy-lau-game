export default class HUD {
    constructor(game) {
        this.game = game;
        this.hudElement = document.getElementById('hud');
    }

    draw() {
        this.hudElement.innerHTML = `生命: ${Math.max(0, this.game.player.health)} | 得分: ${this.game.score} | 波次: ${this.game.wave} | 难度: ${this.game.difficulty.toFixed(1)}x`;
    }

    showGameOver() {
        this.hudElement.innerHTML = '';
        document.getElementById('game-over').style.display = 'block';
    }

    updateLanguage() {
        this.draw();
    }
}