import Player from './Player.js';
import EnemySystem from './EnemySystem.js';
import PowerUpSystem from './PowerUpSystem.js';
import ParticleSystem from './ParticleSystem.js';
import InputHandler from '../utils/InputHandler.js';

export default class Game {
    constructor(canvas, settings, assets) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.settings = settings;
        this.assets = assets;
        this.input = new InputHandler(this);
        this.player = new Player(this);
        this.enemySystem = new EnemySystem(this);
        this.powerUpSystem = new PowerUpSystem(this);
        this.particles = new ParticleSystem(this);
        this.score = 0;
        this.wave = 1;
        this.difficulty = 1;
        this.paused = false;
        this.gameOver = false;
        this.lastTime = 0;
        // 动态星云背景
        this.clouds = [];
        this.cloudTimer = 0;
        this.cloudInterval = 2000;
        // 星空粒子
        this.stars = [];
        this.initBackground();
    }

    initBackground() {
        // 初始化星云
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 50 + Math.random() * 100,
                speed: 0.2 + Math.random() * 0.3,
                opacity: 0.2 + Math.random() * 0.3,
                color: `hsl(${Math.random() * 360}, 50%, 50%)`
            });
        }
        // 初始化星空粒子
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 1 + Math.random() * 2,
                speed: 0.5 + Math.random(),
                opacity: 0.5 + Math.random() * 0.5
            });
        }
    }

    updateBackground(deltaTime) {
        // 更新星云
        this.cloudTimer += deltaTime;
        if (this.cloudTimer >= this.cloudInterval) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: -100,
                radius: 50 + Math.random() * 100,
                speed: 0.2 + Math.random() * 0.3,
                opacity: 0.2 + Math.random() * 0.3,
                color: `hsl(${Math.random() * 360}, 50%, 50%)`
            });
            this.cloudTimer = 0;
        }
        this.clouds.forEach(cloud => {
            cloud.y += cloud.speed * (deltaTime / 16.67);
        });
        this.clouds = this.clouds.filter(cloud => cloud.y < this.canvas.height + cloud.radius);
        // 更新星空粒子
        this.stars.forEach(star => {
            star.y += star.speed * (deltaTime / 16.67);
            if (star.y > this.canvas.height) {
                star.y = -star.radius;
                star.x = Math.random() * this.canvas.width;
            }
        });
    }

    drawBackground() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // 绘制星空粒子
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        });
        // 绘制星云
        this.clouds.forEach(cloud => {
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = cloud.color;
            this.ctx.globalAlpha = cloud.opacity;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }

    start() {
        this.lastTime = performance.now();
        this.animate(this.lastTime);
    }

    stop() {
        this.paused = true;
    }

    togglePause() {
        this.paused = !this.paused;
        if (!this.paused) {
            this.lastTime = performance.now();
            this.animate(this.lastTime);
        }
    }

    animate(currentTime) {
        if (this.paused || this.gameOver) return;
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateBackground(deltaTime);
        this.drawBackground();

        if (!this.gameOver) {
            const keys = this.input.getKeys();
            this.player.update(keys, deltaTime);
            this.enemySystem.update(deltaTime);
            this.powerUpSystem.update(deltaTime);
            this.particles.update(deltaTime);

            this.player.draw();
            this.enemySystem.draw();
            this.powerUpSystem.draw();
            this.particles.draw();

            this.handleCollisions();

            if (this.player.health <= 0) {
                this.gameOver = true;
                this.saveScore();
                document.getElementById('game-over').style.display = 'block';
            }

            if (this.enemySystem.enemies.length === 0) {
                this.wave++;
                this.difficulty += 0.1;
                this.enemySystem.spawnWave();
            }
        }

        if (!this.paused && !this.gameOver) {
            requestAnimationFrame((time) => this.animate(time));
        }
    }

    handleCollisions() {
        const playerRect = {
            x: this.player.x,
            y: this.player.y,
            width: this.player.width,
            height: this.player.height
        };

        this.enemySystem.enemies.forEach(enemy => {
            const enemyRect = {
                x: enemy.x,
                y: enemy.y,
                width: enemy.width,
                height: enemy.height
            };
            if (this.isColliding(playerRect, enemyRect)) {
                this.player.health -= 10;
                enemy.health = 0;
                this.particles.addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            }

            enemy.bullets.forEach(bullet => {
                const bulletRect = {
                    x: bullet.x,
                    y: bullet.y,
                    width: bullet.width,
                    height: bullet.height
                };
                if (this.isColliding(playerRect, bulletRect)) {
                    this.player.health -= 5;
                    bullet.markedForDeletion = true;
                    this.particles.addExplosion(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
                }
            });
        });

        this.player.weaponSystem.bullets.forEach(bullet => {
            const bulletRect = {
                x: bullet.x,
                y: bullet.y,
                width: bullet.width,
                height: bullet.height
            };
            this.enemySystem.enemies.forEach(enemy => {
                const enemyRect = {
                    x: enemy.x,
                    y: enemy.y,
                    width: enemy.width,
                    height: enemy.height
                };
                if (this.isColliding(bulletRect, enemyRect)) {
                    enemy.health -= bullet.damage;
                    bullet.markedForDeletion = true;
                    this.particles.addExplosion(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
                    if (enemy.health <= 0) {
                        this.score += enemy.score;
                    }
                }
            });
        });

        this.powerUpSystem.powerUps.forEach(powerUp => {
            const powerUpRect = {
                x: powerUp.x,
                y: powerUp.y,
                width: powerUp.width,
                height: powerUp.height
            };
            if (this.isColliding(playerRect, powerUpRect)) {
                powerUp.apply(this.player);
                powerUp.markedForDeletion = true;
            }
        });
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.player.resize(width, height);
        this.enemySystem.enemies.forEach(enemy => enemy.resize(width, height));
        this.initBackground();
    }

    saveState() {
        return {
            score: this.score,
            wave: this.wave,
            difficulty: this.difficulty,
            player: this.player.saveState(),
            enemies: this.enemySystem.enemies.map(enemy => enemy.saveState()),
            powerUps: this.powerUpSystem.powerUps.map(powerUp => powerUp.saveState())
        };
    }

    loadState(state) {
        this.score = state.score;
        this.wave = state.wave;
        this.difficulty = state.difficulty;
        this.player.loadState(state.player);
        this.enemySystem.enemies = state.enemies.map(enemyState => {
            const enemy = this.enemySystem.createEnemy(enemyState.type);
            enemy.loadState(enemyState);
            return enemy;
        });
        this.powerUpSystem.powerUps = state.powerUps.map(powerUpState => {
            const powerUp = this.powerUpSystem.createPowerUp(powerUpState.type);
            powerUp.loadState(powerUpState);
            return powerUp;
        });
    }

    updateSettings(settings) {
        this.settings = settings;
        this.player.audioEngine.setVolume(settings.soundVolume);
    }

    saveScore() {
        const scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push({ name: `玩家${scores.length + 1}`, score: this.score });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('scores', JSON.stringify(scores.slice(0, 5)));
    }
}