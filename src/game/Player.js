import WeaponSystem from './weapons/WeaponSystem.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.width = 64;
        this.height = 64;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = this.canvas.height - this.height - 20;
        this.speed = 5;
        this.health = 100;
        this.weaponSystem = new WeaponSystem(this);
        this.image = game.assets.images['assets/images/player_sheet.png'] || new Image();
        this.audioEngine = {
            play: (key, loop = false) => {
                const sound = game.assets.sounds[`assets/sounds/${key}.mp3`];
                if (sound) {
                    sound.currentTime = 0;
                    sound.loop = loop;
                    sound.volume = game.settings.soundVolume;
                    sound.play().catch(e => console.warn(`${key}音效播放失败:`, e));
                }
            },
            pause: (key) => {
                const sound = game.assets.sounds[`assets/sounds/${key}.mp3`];
                if (sound) sound.pause();
            },
            resume: (key) => {
                const sound = game.assets.sounds[`assets/sounds/${key}.mp3`];
                if (sound && sound.paused) sound.play().catch(e => console.warn(`${key}音效恢复失败:`, e));
            },
            stopAll: () => {
                Object.values(game.assets.sounds).forEach(sound => {
                    if (sound) {
                        sound.pause();
                        sound.currentTime = 0;
                    }
                });
            },
            setVolume: (volume) => {
                Object.values(game.assets.sounds).forEach(sound => {
                    if (sound) sound.volume = volume;
                });
            }
        };
    }

    update(keys, deltaTime = 16.67) {
        const speed = this.speed * (deltaTime / 16.67);
        if (keys.left && this.x > 0) this.x -= speed;
        if (keys.right && this.x < this.canvas.width - this.width) this.x += speed;
        if (keys.up && this.y > 0) this.y -= speed;
        if (keys.down && this.y < this.canvas.height - this.height) this.y += speed;
        if (keys.shoot) this.weaponSystem.shoot();
        this.weaponSystem.update(deltaTime);
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.weaponSystem.draw();
    }

    resize(width, height) {
        this.x = width / 2 - this.width / 2;
        this.y = height - this.height - 20;
    }

    saveState() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            weapon: this.weaponSystem.currentWeapon
        };
    }

    loadState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.weaponSystem.setWeapon(state.weapon);
    }
}