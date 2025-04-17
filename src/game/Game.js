import Player from './Player.js';
import Enemy from './enemies/Enemy.js';
import BossEnemy from './enemies/BossEnemy.js';
import StealthEnemy from './enemies/StealthEnemy.js';
import Powerup from './Powerup.js';
import InputHandler from '../utils/InputHandler.js';
import HUD from '../ui/HUD.js';
import ParticleSystem from './ParticleSystem.js';

export default class Game {
    constructor(canvas, settings, assets) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.settings = settings;
        this.assets = assets;
        this.width = canvas.width;
        this.height = canvas.height;
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.hud = new HUD(this);
        this.particles = new ParticleSystem(this);
        this.enemies = [];
        this.powerups = [];
        this.wave = 1;
        this.score = 0;
        this.difficulty = 1;
        this.paused = false;
        this.gameOver = false;
        this.lastTimestamp = 0;
        this.gameOverElement = document.getElementById('game-over');
        this.pauseMenuElement = document.getElementById('pause-menu');
    }

    start() {
        this.player.audioEngine.play('bgm', true);
        this.spawnWave();
        this.animate(0);
    }

    stop() {
        this.player.audioEngine.stopAll();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.player.resize(width, height);
    }

    togglePause() {
        this.paused = !this.paused;
        this.pauseMenuElement.style.display = this.paused ? 'block' : 'none';
        if (!this.paused) {
            this.player.audioEngine.resume('bgm');
            this.animate(this.lastTimestamp);
        } else {
            this.player.audioEngine.pause('bgm');
        }
    }

    spawnWave() {
        try {
            const enemyCount = Math.round(5 + this.wave * 2 * this.difficulty);
            const canSpawnBoss = this.wave % 5 === 0 && this.wave >= 5;
            const enemyTypes = ['small', 'medium', 'large', 'stealth'].concat(canSpawnBoss ? ['boss'] : []);

            for (let i = 0; i < enemyCount; i++) {
                const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                if (type === 'boss') {
                    this.enemies.push(new BossEnemy(this, this.wave));
                } else if (type === 'stealth') {
                    this.enemies.push(new StealthEnemy(this, this.wave));
                } else {
                    this.enemies.push(new Enemy(this, this.wave, type));
                }
            }
            for (let i = 0; i < Math.floor(this.wave / 3); i++) {
                if (Math.random() < 0.3) this.powerups.push(new Powerup(this));
            }
            console.log(`波次 ${this.wave} 生成: ${enemyCount} 敌人, ${this.powerups.length} 道具`);
        } catch (error) {
            console.error('生成波次失败:', error);
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    isColliding(obj1, obj2) {
        if (!obj1 || !obj2) return false;
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    handleCollisions() {
        try {
            const validateObject = (obj) => obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.width === 'number' && typeof obj.height === 'number';

            this.enemies.forEach(enemy => {
                if (!validateObject(enemy)) return;
                enemy.weaponSystem.bullets.forEach(bullet => {
                    if (!validateObject(bullet) || !validateObject(this.player)) return;
                    if (this.isColliding(this.player, bullet)) {
                        this.player.health -= bullet.damage * this.difficulty;
                        bullet.active = false;
                        this.particles.addExplosion(bullet.x, bullet.y);
                        this.player.audioEngine.play('explosion');
                        console.log('玩家被击中, 生命:', this.player.health);
                    }
                });
                if (this.isColliding(this.player, enemy)) {
                    this.player.health -= 20 * this.difficulty;
                    enemy.health -= 20 * this.difficulty;
                    this.particles.addExplosion(enemy.x, enemy.y);
                    this.player.audioEngine.play('explosion');
                    console.log('玩家与敌人碰撞, 生命:', this.player.health);
                }
            });

            this.player.weaponSystem.bullets.forEach(bullet => {
                if (!validateObject(bullet)) return;
                this.enemies.forEach(enemy => {
                    if (!validateObject(enemy)) return;
                    if (this.isColliding(bullet, enemy)) {
                        enemy.health -= bullet.damage * this.difficulty;
                        bullet.active = false;
                        this.particles.addExplosion(bullet.x, bullet.y);
                        if (enemy.health <= 0) {
                            const score = enemy instanceof BossEnemy ? 200 : enemy instanceof StealthEnemy ? 100 : { large: 60, medium: 40, small: 20 }[enemy.type] || 20;
                            this.score += score;
                            enemy.active = false;
                            this.player.audioEngine.play('explosion');
                            console.log('敌人被击败, 得分:', this.score);
                        }
                    }
                });
            });

            this.powerups.forEach(powerup => {
                if (!validateObject(powerup) || !validateObject(this.player)) return;
                if (this.isColliding(this.player, powerup)) {
                    console.log('玩家拾取道具:', powerup.type);
                    powerup.applyEffect(this.player);
                    powerup.active = false;
                    this.player.audioEngine.play('powerup');
                }
            });

            this.enemies = this.enemies.filter(e => e.active);
            this.powerups = this.powerups.filter(p => p.active);
            this.player.weaponSystem.bullets = this.player.weaponSystem.bullets.filter(b => b.active);

            if (this.player.health <= 0) {
                this.gameOver = true;
                this.hud.showGameOver();
                this.gameOverElement.style.display = 'block';
                console.log('游戏结束，玩家生命值为 0');
            }
        } catch (error) {
            console.error('碰撞检测失败:', error);
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    renderBackground() {
        const bg = this.assets.images['assets/images/background.png'] || new Image();
        this.ctx.drawImage(bg, 0, 0, this.width, this.height);
    }

    animate(timestamp) {
        if (this.paused || this.gameOver) return;
        try {
            const deltaTime = timestamp - (this.lastTimestamp || timestamp);
            this.lastTimestamp = timestamp;

            this.ctx.clearRect(0, 0, this.width, this.height);
            this.renderBackground();

            const keys = this.input.getKeys();
            this.player.update(keys, deltaTime);
            this.player.draw();
            this.enemies.forEach(enemy => {
                enemy.update(this.player, deltaTime);
                enemy.draw();
            });
            this.powerups.forEach(powerup => {
                powerup.update(deltaTime);
                powerup.draw();
            });
            this.particles.update(deltaTime);
            this.particles.draw();
            this.handleCollisions();
            this.hud.draw();

            if (this.enemies.length === 0) {
                this.wave++;
                this.difficulty = Math.min(2.5, this.difficulty + 0.1);
                this.spawnWave();
            }

            requestAnimationFrame((ts) => this.animate(ts));
        } catch (error) {
            console.error('动画循环失败:', error);
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    updateSettings(newSettings) {
        this.settings = newSettings;
        this.player.audioEngine.setVolume(newSettings.soundVolume);
        this.input.updateKeyBindings(newSettings.keyBindings);
    }

    saveState() {
        return {
            player: this.player.saveState(),
            enemies: this.enemies.map(e => e.saveState()),
            powerups: this.powerups.map(p => p.saveState()),
            wave: this.wave,
            score: this.score,
            difficulty: this.difficulty
        };
    }

    loadState(state) {
        this.player.loadState(state.player);
        this.enemies = state.enemies.map(e => {
            let enemy;
            if (e.type === 'boss') {
                enemy = new BossEnemy(this, e.wave);
            } else if (e.type === 'stealth') {
                enemy = new StealthEnemy(this, e.wave);
            } else {
                enemy = new Enemy(this, e.wave, e.type);
            }
            enemy.loadState(e);
            return enemy;
        });
        this.powerups = state.powerups.map(p => {
            const powerup = new Powerup(this, p.type);
            powerup.loadState(p);
            return powerup;
        });
        this.wave = state.wave;
        this.score = state.score;
        this.difficulty = state.difficulty;
    }
}