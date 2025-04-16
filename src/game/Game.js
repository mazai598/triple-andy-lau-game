import Player from './Player.js';
import Enemy from './Enemy.js';
import StealthEnemy from './enemies/StealthEnemy.js';
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
        this.gameOver = false;
        this.paused = false;
        this.bossActive = false;
        this.bulletsFired = 0;
        this.bulletsHit = 0;
        this.scoreMultiplier = 1;
        this.consecutiveHits = 0;

        // 加载音频
        this.bgm = new Audio('assets/sounds/bgm.mp3');
        this.bgm.loop = true;
        this.bgm.volume = settings.soundVolume;
        this.sounds = {
            explosion: new Audio('assets/sounds/explosion.mp3'),
            laser: new Audio('assets/sounds/laser.mp3'),
            missile: new Audio('assets/sounds/missile.mp3'),
            penta: new Audio('assets/sounds/penta.mp3'),
            powerup: new Audio('assets/sounds/powerup.mp3'),
            shoot: new Audio('assets/sounds/shoot.mp3'),
            wave: new Audio('assets/sounds/wave.mp3'),
            boss_warning: new Audio('assets/sounds/boss_warning.mp3')
        };
        Object.values(this.sounds).forEach(sound => {
            sound.volume = settings.soundVolume;
            sound.onerror = () => console.warn(`音频加载失败: ${sound.src}`);
        });

        // 性能设置
        this.quality = settings.graphicsQuality;
    }

    start() {
        if (!this.bgm) {
            console.warn('背景音乐加载失败，使用静音模式');
        } else {
            this.bgm.play().catch(e => console.warn('音频播放失败:', e));
        }
        this.spawnWave();
        this.animate();
    }

    stop() {
        if (this.bgm) this.bgm.pause();
    }

    updateSettings(settings) {
        this.settings = settings;
        if (this.bgm) this.bgm.volume = settings.soundVolume;
        Object.values(this.sounds).forEach(sound => sound.volume = settings.soundVolume);
        this.quality = settings.graphicsQuality;
        this.hud.updateLanguage();
        this.input.updateKeyBindings(settings.keyBindings);
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.player.resize(width, height);
        this.hud.resize(width, height);
    }

    spawnWave() {
        const enemyCount = 5 + this.wave * 2;
        const enemyTypes = ['small', 'medium', 'large', 'stealth'];
        for (let i = 0; i < enemyCount; i++) {
            const type = enemyTypes[Math.floor(Math.random() * 4)];
            if (type === 'stealth') {
                this.enemies.push(new StealthEnemy(this, this.wave));
            } else {
                this.enemies.push(new Enemy(this, this.wave, false, type));
            }
        }
        if (this.wave % 5 === 0) {
            this.enemies.push(new Enemy(this, this.wave, true));
            this.bossActive = true;
            if (this.sounds.boss_warning) this.sounds.boss_warning.play();
        }
        if (Math.random() < 0.3) {
            this.powerups.push(new Powerup(this));
        }
    }

    animate() {
        if (this.paused || this.gameOver) return;
        try {
            console.log('Animating frame...');
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 优化背景渲染，使用 1920x1440 的 background.png 并自适应
            this.renderBackground();

            // 更新和绘制
            const keys = this.input.getKeys();
            console.log('Current keys:', keys);
            this.player.update(keys);
            this.player.draw();
            this.enemies.forEach(enemy => {
                enemy.update();
                enemy.draw();
            });
            this.powerups.forEach(powerup => {
                powerup.update();
                powerup.draw();
            });
            this.particles.update();
            this.particles.draw();
            this.hud.draw();

            // 碰撞检测
            this.handleCollisions();

            // 下一波
            if (this.enemies.length === 0) {
                this.wave++;
                this.bossActive = false;
                this.spawnWave();
            }

            requestAnimationFrame(() => this.animate());
        } catch (error) {
            console.error('动画循环错误:', error);
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    renderBackground() {
        const bgImage = this.images['assets/images/background.png'];
        if (bgImage) {
            const canvasAspect = this.canvas.width / this.canvas.height;
            const imageAspect = 1920 / 1440;
            let scale = 1;
            let x = 0;
            let y = 0;

            if (canvasAspect > imageAspect) {
                scale = this.canvas.width / 1920;
                y = (this.canvas.height - 1440 * scale) / 2;
            } else {
                scale = this.canvas.height / 1440;
                x = (this.canvas.width - 1920 * scale) / 2;
            }

            // 平滑过渡效果
            this.ctx.save();
            this.ctx.globalAlpha = 0.9;
            this.ctx.drawImage(bgImage, x, y, 1920 * scale, 1440 * scale);
            this.ctx.globalAlpha = 1;
            this.ctx.restore();
        } else {
            this.ctx.fillStyle = '#1a2a44';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < 100; i++) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
                this.ctx.beginPath();
                this.ctx.arc(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    Math.random() * 2 + 1,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
                if (this.quality === 'high') {
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = '#fff';
                }
            }
            this.ctx.shadowBlur = 0;
        }
    }

    handleCollisions() {
        // 玩家与敌方子弹碰撞
        this.enemies.forEach(enemy => {
            enemy.bullets.forEach(bullet => {
                if (this.isColliding(this.player, bullet)) {
                    this.player.health -= 10;
                    bullet.active = false;
                    this.particles.addExplosion(bullet.x, bullet.y);
                    if (this.sounds.explosion) this.sounds.explosion.play();
                    this.consecutiveHits = 0;
                    this.scoreMultiplier = 1;
                    console.log('Player hit by enemy bullet, health:', this.player.health);
                }
            });
        });

        // 玩家子弹与敌人碰撞
        this.player.weaponSystem.bullets.forEach(bullet => {
            this.enemies.forEach(enemy => {
                if (this.isColliding(bullet, enemy) && (!enemy.isStealth || !enemy.isCloaked)) {
                    enemy.health -= bullet.damage;
                    bullet.active = false;
                    this.bulletsHit++;
                    this.consecutiveHits++;
                    if (this.consecutiveHits >= 5) {
                        this.scoreMultiplier = Math.min(this.scoreMultiplier + 0.1, 2);
                    }
                    this.particles.addExplosion(bullet.x, bullet.y);
                    if (enemy.health <= 0) {
                        const baseScore = enemy.isBoss ? 100 : enemy.type === 'stealth' ? 50 : enemy.type === 'large' ? 30 : enemy.type === 'medium' ? 20 : 10;
                        this.score += Math.round(baseScore * this.scoreMultiplier);
                        enemy.active = false;
                        if (this.sounds.explosion) this.sounds.explosion.play();
                        console.log('Enemy defeated, score:', this.score);
                    }
                }
            });
        });

        // 玩家与道具碰撞
        this.powerups.forEach(powerup => {
            if (this.isColliding(this.player, powerup)) {
                console.log('Player collided with powerup:', powerup.type);
                if (powerup.type === 'life') {
                    this.player.health = Math.min(this.player.health + 50, 100);
                    console.log('Life powerup applied, new health:', this.player.health);
                } else if (powerup.type === 'energy') {
                    this.player.health = Math.min(this.player.health + 20, 100);
                    console.log('Energy powerup applied, new health:', this.player.health);
                } else {
                    this.player.weaponSystem.setWeapon(powerup.type);
                    console.log('Weapon powerup applied:', powerup.type);
                }
                powerup.active = false;
                if (this.sounds.powerup) this.sounds.powerup.play();
            }
        });

        // 清理
        this.enemies = this.enemies.filter(e => e.active);
        this.powerups = this.powerups.filter(p => p.active);
        this.player.weaponSystem.bullets = this.player.weaponSystem.bullets.filter(b => b.active);

        // 游戏结束
        if (this.player.health <= 0) {
            this.gameOver = true;
            this.hud.showGameOver();
        }
    }

    isColliding(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    saveState() {
        return {
            score: this.score,
            wave: this.wave,
            bulletsFired: this.bulletsFired,
            bulletsHit: this.bulletsHit,
            player: this.player.saveState(),
            enemies: this.enemies.map(e => e.saveState()),
            powerups: this.powerups.map(p => p.saveState()),
            scoreMultiplier: this.scoreMultiplier,
            consecutiveHits: this.consecutiveHits
        };
    }

    loadState(state) {
        this.score = state.score;
        this.wave = state.wave;
        this.bulletsFired = state.bulletsFired;
        this.bulletsHit = state.bulletsHit;
        this.scoreMultiplier = state.scoreMultiplier;
        this.consecutiveHits = state.consecutiveHits;
        this.player.loadState(state.player);
        this.enemies = state.enemies.map(data => {
            const enemy = data.type === 'stealth' ? new StealthEnemy(this, this.wave) : new Enemy(this, this.wave, data.isBoss, data.type);
            enemy.loadState(data);
            return enemy;
        });
        this.powerups = state.powerups.map(data => {
            const powerup = new Powerup(this);
            powerup.loadState(data);
            return powerup;
        });
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            if (this.bgm) this.bgm.pause();
            this.hud.showPauseMenu();
        } else {
            if (this.bgm) this.bgm.play().catch(e => console.warn('音频播放失败:', e));
            this.animate();
        }
    }
}