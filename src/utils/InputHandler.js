import { translations } from './Translations.js';

export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.touch = { x: 0, y: 0, active: false };
        this.mobileKeys = {};
        this.keyBindings = this.game.settings.keyBindings;

        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (e.code === 'KeyP' && !this.game.gameOver) {
                this.game.togglePause();
            }
        });
        window.addEventListener('keyup', e => this.keys[e.code] = false);

        this.game.canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touch.x = touch.clientX;
            this.touch.y = touch.clientY;
            this.touch.active = true;
        });
        this.game.canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touch.x = touch.clientX;
            this.touch.y = touch.clientY;
        });
        this.game.canvas.addEventListener('touchend', e => {
            e.preventDefault();
            this.touch.active = false;
        });
    }

    updateKeyBindings(keyBindings) {
        this.keyBindings = keyBindings;
    }

    getPlayerInput() {
        const input = { x: 0, y: 0, shoot: false };
        if (this.keyBindings.up.some(key => this.keys[key]) || this.mobileKeys['up']) input.y = -1;
        if (this.keyBindings.down.some(key => this.keys[key]) || this.mobileKeys['down']) input.y = 1;
        if (this.keyBindings.left.some(key => this.keys[key]) || this.mobileKeys['left']) input.x = -1;
        if (this.keyBindings.right.some(key => this.keys[key]) || this.mobileKeys['right']) input.x = 1;
        if (this.keyBindings.shoot.some(key => this.keys[key]) || this.mobileKeys['shoot']) input.shoot = true;
        if (this.touch.active && !Object.values(this.mobileKeys).some(v => v)) {
            input.touchX = this.touch.x;
            input.touchY = this.touch.y;
            input.shoot = true;
        }
        return input;
    }

    addRestartListener() {
        const handler = e => {
            if (e.code === 'KeyR' && this.game.gameOver) {
                this.game.gameOver = false;
                this.game.hud.gameOverVisible = false;
                this.game.score = 0;
                this.game.wave = 1;
                this.game.bulletsFired = 0;
                this.game.bulletsHit = 0;
                this.game.scoreMultiplier = 1;
                this.game.consecutiveHits = 0;
                this.game.player.health = 100;
                this.game.enemies = [];
                this.game.powerups = [];
                this.game.particles.particles = [];
                this.game.player.weaponSystem.setWeapon('normal');
                this.game.spawnWave();
                this.game.animate();
            } else if (e.code === 'KeyM' && (this.game.gameOver || this.game.paused)) {
                this.game.gameOver = false;
                this.game.paused = false;
                this.game.hud.gameOverVisible = false;
                this.game.hud.pauseMenuVisible = false;
                document.getElementById('game-canvas').style.display = 'none';
                document.querySelector('.menu-container').style.display = 'block';
                document.querySelector('.mobile-controls').style.display = 'none';
                this.game.stop();
                this.game = null;
            }
        };
        window.removeEventListener('keydown', this.restartHandler);
        this.restartHandler = handler;
        window.addEventListener('keydown', handler);
    }

    setMobileKeys(keys) {
        this.mobileKeys = keys;
    }
}