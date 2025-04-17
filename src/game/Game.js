import Player from './Player.js';
import Enemy from './Enemy.js';
import StealthEnemy from './enemies/StealthEnemy.js';
import BossEnemy from './enemies/BossEnemy.js';
import Powerup from './Powerup.js';
import HUD from '../ui/HUD.js';
import ParticleSystem from './ParticleSystem.js';
import InputHandler from '../utils/InputHandler.js';

export default class Game {
    constructor(canvas, settings, images) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.settings = settings;
        this.images = images || {};
        this.player = new Player(this);
        this.enemies = [];
        this.powerups = [];
        this.particles = new ParticleSystem(this);
        this.hud = new HUD(this);
        this.input = new InputHandler(this);
        this.score = 0;
        this.wave = 1;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.bossActive = false;
        this.bulletsFired = 0;
        this.bulletsHit = 0;
        this.scoreMultiplier = 1;
        this.consecutiveHits = 0;
        this.difficulty = 1.0;

        this.audioEngine = {
            bgm: new Audio('assets/sounds/bgm.mp3'),
            effects: {
                explosion: new Audio('assets/sounds/explosion.mp3'),
                laser: new Audio('assets/sounds/laser.mp3'),
                powerup: new Audio('assets/sounds/powerup.mp3'),
                boss: new Audio('assets/sounds/boss_warning.mp3')
            }
        };
        this.audioEngine.bgm.loop = true;
        this.audioEngine.bgm.volume = settings.soundVolume;
        Object.values(this.audioEngine.effects).forEach(sound => {
            sound.volume = settings.soundVolume;
            sound.onerror = () => console.warn(`音效加载失败: ${sound.src}`);
        });

        this.quality = settings.graphicsQuality;
        this.gameOverElement = document.getElementById('game-over');
        this.pauseMenuElement = document.getElementById('pause-menu');
    }

    start() {
        console.log('游戏启动...');
        try {
            this.audioEngine.bgm.play().catch(e => console.warn('背景音乐播放失败:', e));
            this.spawnWave();
            this.animate();
        } catch (error) {
            console.error('游戏启动失败:', error);
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    stop() {
        try {
            this.audioEngine.bgm.pause();
            console.log('背景音乐已暂停');
        } catch (error) {
            console.warn('停止背景音乐失败:', error);
        }
    }

    updateSettings(settings) {
        this.settings = settings;
        try {
            this.audioEngine.bgm.volume = settings.soundVolume;
            Object.values(this.audioEngine.effects).forEach(sound => sound.volume = settings.soundVolume);
            this.quality = settings.graphicsQuality;
            this.hud.updateLanguage();
            this.input.updateKeyBindings(settings.keyBindings);
            console.log('游戏设置更新成功');
        } catch (error) {
            console.warn('更新设置失败:', error);
        }
    }

    resize(width, height) {
        try {
            this.canvas.width = width;
            this.canvas.height = height;
            this.player.resize(width, height);
            this.hud.resize(width, height);
            this.enemies.forEach(enemy => enemy.resize(width, height));
            this.powerups.forEach(powerup => powerup.resize(width, height));
            console.log(`画布调整大小: ${width}x${height}`);
        } catch (error) {
            console.error('调整画布大小失败:', error);
        }
    }

    spawnWave() {
        try {
            const enemyCount = 15 + this.wave * 5 * this.difficulty;
            for (let i = 0; i < enemyCount; i++) {
                const type = ['small', 'medium', 'large', 'stealth', 'boss'][Math.floor(Math.random() * (this.wave > 5 ? 5 : 4))];
                if (type === 'stealth') {
                    this.enemies.push(new StealthEnemy(this, this.wave));
                } else if (type === 'boss' && !this.bossActive && this.wave % 5 === 0) {
                    this.enemies.push(new BossEnemy(this, this.wave));
                    this.bossActive = true;
                    if (this.audioEngine.effects.boss) this.audioEngine.effects.boss.play();
                } else {
                    this.enemies.push(new Enemy(this, this.wave, false, type));
                }
            }
            for (let i = 0; i < Math.floor(this.wave / 2); i++) {
                if (Math.random() < 0.5) this.powerups.push(new Powerup(this));
            }
            console.log(`波次 ${this.wave} 生成: ${enemyCount} 敌人, ${this.powerups.length} 道具`);
        } catch (error) {
            console.error('生成波次失败:', error);
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    animate() {
        if (this.paused || this.gameOver) return;
        try {
            console.log('动画帧运行...');
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderBackground();

            const keys = this.input.getKeys();
            this.player.update(keys);
            this.player.draw();
            this.enemies.forEach(enemy => {
                enemy.update(this.player);
                enemy.draw();
            });
            this.powerups.forEach(powerup => {
                powerup.update();
                powerup.draw();
            });
            this.particles.update();
            this.particles.draw();
            this.handleCollisions();
            this.hud.draw();

            if (this.enemies.length === 0) {
                if (this.bossActive) {
                    this.level++;
                    this.bossActive = false;
                    console.log(`关卡 ${this.level} 完成`);
                }
                this.wave++;
                this.difficulty = Math.min(2.5, this.difficulty + 0.1);
                this.spawnWave();
            }

            if (this.bossActive) {
                this.ctx.filter = 'hue-rotate(90deg) brightness(110%)';
                this.particles.addBurst(this.canvas.width / 2, this.canvas.height / 2);
            } else {
                this.ctx.filter = 'none';
            }

            requestAnimationFrame(() => this.animate());
        } catch (error) {
            console.error('动画循环失败:', error);
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    renderBackground() {
        try {
            const bgImage = this.images['assets/images/background.png'];
            if (bgImage) {
                const scaleX = this.canvas.width / 1920;
                const scaleY = this.canvas.height / 1440;
                const scale = Math.max(scaleX, scaleY);
                const x = (this.canvas.width - 1920 * scale) / 2;
                const y = (this.canvas.height - 1440 * scale) / 2;
                this.ctx.save();
                this.ctx.filter = 'brightness(120%) contrast(110%)';
                this.ctx.drawImage(bgImage, x, y, 1920 * scale, 1440 * scale);
                this.ctx.restore();
            } else {
                this.ctx.fillStyle = 'rgba(10, 10, 42, 0.8)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                for (let i = 0; i < 200; i++) {
                    this.ctx.fillStyle = `rgba(0, 255, 204, ${Math.random() * 0.5 + 0.3})`;
                    this.ctx.beginPath();
                    this.ctx.arc(Math.random() * this.canvas.width, Math.random() * this.canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        } catch (error) {
            console.error('渲染背景失败:', error);
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    handleCollisions() {
        try {
            this.enemies.forEach(enemy => {
                enemy.bullets.forEach(bullet => {
                    if (this.isColliding(this.player, bullet)) {
                        this.player.health -= 15 * this.difficulty;
                        bullet.active = false;
                        this.particles.addExplosion(bullet.x, bullet.y);
                        if (this.audioEngine.effects.explosion) this.audioEngine.effects.explosion.play();
                        this.consecutiveHits = 0;
                        this.scoreMultiplier = 1;
                        console.log('玩家被击中, 生命:', this.player.health);
                    }
                });
                if (this.isColliding(this.player, enemy)) {
                    this.player.health -= 30 * this.difficulty;
                    enemy.active = false;
                    this.particles.addExplosion(enemy.x, enemy.y);
                    if (this.audioEngine.effects.explosion) this.audioEngine.effects.explosion.play();
                    console.log('玩家与敌人碰撞, 生命:', this.player.health);
                }
            });

            this.player.weaponSystem.bullets.forEach(bullet => {
                this.enemies.forEach(enemy => {
                    if (this.isColliding(bullet, enemy) && (!enemy.isStealth || !enemy.isCloaked)) {
                        enemy.health -= bullet.damage * this.difficulty;
                        bullet.active = false;
                        this.bulletsHit++;
                        this.consecutiveHits++;
                        if (this.consecutiveHits >= 5) this.scoreMultiplier = Math.min(this.scoreMultiplier + 0.2, 3);
                        this.particles.addExplosion(bullet.x, bullet.y);
                        if (enemy.health <= 0) {
                            const score = enemy.isBoss ? 200 : { stealth: 100, large: 60, medium: 40, small: 20 }[enemy.type] || 20;
                            this.score += Math.round(score * this.scoreMultiplier);
                            enemy.active = false;
                            if (this.audioEngine.effects.explosion) this.audioEngine.effects.explosion.play();
                            console.log('敌人被击败, 得分:', this.score);
                        }
                    }
                });
            });

            this.powerups.forEach(powerup => {
                if (this.isColliding(this.player, powerup)) {
                    console.log('玩家拾取道具:', powerup.type);
                    if (powerup.type === 'life') {
                        this.player.health = Math.min(this.player.health + 50, 200);
                        console.log('生命道具生效, 新生命:', this.player.health);
                    } else if (powerup.type === 'energy') {
                        this.player.health += 30;
                        console.log('能量道具生效, 新生命:', this.player.health);
                    } else if (powerup.type === 'laser') {
                        this.player.weaponSystem.setWeapon('laser');
                        console.log('激光武器道具生效');
                    } else if (powerup.type === 'penta') {
                        this.player.weaponSystem.setWeapon('penta');
                        console.log('五向武器道具生效');
                    } else if (powerup.type === 'wave') {
                        this.player.weaponSystem.setWeapon('wave');
                        console.log('波形武器道具生效');
                    }
                    powerup.active = false;
                    if (this.audioEngine.effects.powerup) this.audioEngine.effects.powerup.play();
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

    isColliding(a, b) {
        try {
            if (!a || !b) return false;
            return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
        } catch (error) {
            console.error('碰撞检测计算失败:', error);
            return false;
        }
    }

    saveState() {
        try {
            return {
                score: this.score,
                wave: this.wave,
                level: this.level,
                bulletsFired: this.bulletsFired,
                bulletsHit: this.bulletsHit,
                player: this.player.saveState(),
                enemies: this.enemies.map(e => e.saveState()),
                powerups: this.powerups.map(p => p.saveState()),
                scoreMultiplier: this.scoreMultiplier,
                consecutiveHits: this.consecutiveHits,
                difficulty: this.difficulty,
                bossActive: this.bossActive
            };
        } catch (error) {
            console.error('保存游戏状态失败:', error);
            return {};
        }
    }

    loadState(state) {
        try {
            this.score = state.score;
            this.wave = state.wave;
            this.level = state.level;
            this.bulletsFired = state.bulletsFired;
            this.bulletsHit = state.bulletsHit;
            this.scoreMultiplier = state.scoreMultiplier;
            this.consecutiveHits = state.consecutiveHits;
            this.difficulty = state.difficulty || 1.0;
            this.bossActive = state.bossActive || false;
            this.player.loadState(state.player);
            this.enemies = state.enemies.map(data => {
                const enemy = data.type === 'stealth' ? new StealthEnemy(this, this.wave) : data.type === 'boss' ? new BossEnemy(this, this.wave) : new Enemy(this, this.wave, data.isBoss, data.type);
                enemy.loadState(data);
                return enemy;
            });
            this.powerups = state.powerups.map(data => {
                const powerup = new Powerup(this);
                powerup.loadState(data);
                return powerup;
            });
            console.log('加载游戏状态成功');
        } catch (error) {
            console.error('加载游戏状态失败:', error);
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    togglePause() {
        try {
            this.paused = !this.paused;
            if (this.paused) {
                this.audioEngine.bgm.pause();
                this.pauseMenuElement.style.display = 'block';
            } else {
                this.audioEngine.bgm.play().catch(e => console.warn('背景音乐播放失败:', e));
                this.pauseMenuElement.style.display = 'none';
                this.animate();
            }
            console.log(`游戏${this.paused ? '暂停' : '恢复'}`);
        } catch (error) {
            console.error('暂停/恢复游戏失败:', error);
        }
    }
}