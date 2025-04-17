export default class AudioEngine {
    constructor(assets) {
        this.assets = assets;
        this.sounds = {};
        this.volume = 0.5;
        this.initSounds();
    }

    initSounds() {
        const soundPaths = [
            'assets/sounds/bgm.mp3',
            'assets/sounds/explosion.mp3',
            'assets/sounds/laser.mp3',
            'assets/sounds/powerup.mp3',
            'assets/sounds/boss_warning.mp3',
            'assets/sounds/missile.mp3',
            'assets/sounds/penta.mp3',
            'assets/sounds/shoot.mp3',
            'assets/sounds/wave.mp3'
        ];

        soundPaths.forEach(path => {
            const sound = this.assets.sounds[path];
            if (sound) {
                this.sounds[path.split('/').pop().split('.')[0]] = sound;
            } else {
                console.warn(`音频文件 ${path} 未加载`);
            }
        });
    }

    setVolume(volume) {
        this.volume = volume;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }

    play(soundName, loop = false) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.loop = loop;
            sound.volume = this.volume;
            sound.play().catch(error => {
                console.warn(`播放音频 ${soundName} 失败:`, error);
            });
        } else {
            console.warn(`音频 ${soundName} 未找到`);
        }
    }

    pause(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
        }
    }

    resume(soundName) {
        const sound = this.sounds[soundName];
        if (sound && sound.paused) {
            sound.play().catch(error => {
                console.warn(`恢复音频 ${soundName} 失败:`, error);
            });
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}