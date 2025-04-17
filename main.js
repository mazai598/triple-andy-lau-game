import Game from './src/game/Game.js';
import { translations, updateLanguage } from './src/utils/Translations.js';

const canvas = document.getElementById('game-canvas');
const menuContainer = document.querySelector('.menu-container');
const settingsMenu = document.querySelector('.settings-menu');
const startButton = document.getElementById('start-game');
const continueButton = document.getElementById('continue-game');
const leaderboardButton = document.getElementById('leaderboard');
const helpButton = document.getElementById('help');
const aboutButton = document.getElementById('about');
const settingsButton = document.getElementById('settings');
const exitButton = document.getElementById('exit');
const soundVolume = document.getElementById('sound-volume');
const graphicsQuality = document.getElementById('graphics-quality');
const languageSelect = document.getElementById('language');
const saveSettings = document.getElementById('save-settings');
const closeSettings = document.getElementById('close-settings');
const keyUp = document.getElementById('key-up');
const keyDown = document.getElementById('key-down');
const keyLeft = document.getElementById('key-left');
const keyRight = document.getElementById('key-right');
const keyShoot = document.getElementById('key-shoot');
const keyLaser = document.getElementById('key-laser');
const virtualControls = document.querySelector('.virtual-controls');
const hud = document.getElementById('hud');
const gameOver = document.getElementById('game-over');
const pauseMenu = document.getElementById('pause-menu');
const restartButton = document.getElementById('restart-game');
const resumeButton = document.getElementById('resume-game');
const returnMenuButton = document.getElementById('return-menu');
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');
const backgroundVideo = document.querySelector('.background-video');
const leaderboardModal = document.getElementById('leaderboard-modal');
const helpModal = document.getElementById('help-modal');
const aboutModal = document.getElementById('about-modal');

let game = null;
let gameState = null;
let settings = {
    soundVolume: 0.5,
    graphicsQuality: 'high',
    language: 'zh',
    keyBindings: {
        up: ['KeyW', 'ArrowUp'],
        down: ['KeyS', 'ArrowDown'],
        left: ['KeyA', 'ArrowLeft'],
        right: ['KeyD', 'ArrowRight'],
        shoot: ['Space'],
        laser: ['KeyL']
    }
};

// 动态生成星光粒子
function createStarParticles() {
    const starParticles = document.querySelector('.star-particles');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.boxShadow = '0 0 5px white';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `twinkle ${2 + Math.random() * 2}s infinite`;
        starParticles.appendChild(star);
    }
}

async function preloadAssets() {
    return new Promise((resolve) => {
        const assets = {
            images: [
                'assets/images/background.png',
                'assets/images/player_sheet.png',
                'assets/images/enemy_small.png',
                'assets/images/enemy_medium.png',
                'assets/images/enemy_large.png',
                'assets/images/enemy_stealth.png',
                'assets/images/boss_mini.png',
                'assets/images/boss_mid.png',
                'assets/images/boss_final.png',
                'assets/images/bullet.png',
                'assets/images/bullet_laser.png',
                'assets/images/bullet_penta.png',
                'assets/images/bullet_wave.png',
                'assets/images/powerup_life.png',
                'assets/images/powerup_energy.png',
                'assets/images/powerup_laser.png',
                'assets/images/powerup_penta.png',
                'assets/images/powerup_wave.png',
                'assets/images/loading_bg.png',
                'assets/images/explosion.png',
                'assets/images/enemy_bullet.png',
                'assets/images/laser.png',
                'assets/images/muzzle_flash.png',
                'assets/images/particle_trail.png'
            ],
            sounds: [
                'assets/sounds/bgm.mp3',
                'assets/sounds/explosion.mp3',
                'assets/sounds/laser.mp3',
                'assets/sounds/powerup.mp3',
                'assets/sounds/boss_warning.mp3',
                'assets/sounds/missile.mp3',
                'assets/sounds/penta.mp3',
                'assets/sounds/shoot.mp3',
                'assets/sounds/wave.mp3',
                'assets/sounds/click.mp3'
            ],
            videos: [
                'assets/videos/menu_starfield.mp4',
                'assets/videos/menu_starfield.webm'
            ]
        };

        const loadedAssets = { images: {}, sounds: {}, videos: {} };
        const total = assets.images.length + assets.sounds.length + assets.videos.length;
        let loaded = 0;

        const updateProgress = () => {
            const progress = Math.round((loaded / total) * 100);
            loadingProgress.textContent = `${progress}%`;
            console.log(`加载进度: ${progress}% (${loaded}/${total})`);
        };

        const onAssetLoad = (type, path, asset) => {
            loaded++;
            loadedAssets[type][path] = asset;
            console.log(`成功加载 ${type}: ${path}`);
            updateProgress();
            if (loaded === total) {
                console.log('所有资源加载完成');
                resolve(loadedAssets);
            }
        };

        const onAssetError = (type, path) => {
            loaded++;
            loadedAssets[type][path] = null;
            console.warn(`加载失败 ${type}: ${path}`);
            updateProgress();
            if (loaded === total) {
                console.log('所有资源加载完成（包含失败项）');
                resolve(loadedAssets);
            }
        };

        console.log('开始加载图像资源...');
        assets.images.forEach(path => {
            const img = new Image();
            img.src = path;
            img.onload = () => onAssetLoad('images', path, img);
            img.onerror = () => onAssetError('images', path);
        });

        console.log('开始加载音频资源...');
        assets.sounds.forEach(path => {
            const audio = new Audio();
            audio.src = path;
            audio.oncanplaythrough = () => onAssetLoad('sounds', path, audio);
            audio.onerror = () => onAssetError('sounds', path);
        });

        console.log('开始加载视频资源...');
        assets.videos.forEach(path => {
            const video = document.createElement('video');
            video.src = path;
            video.oncanplaythrough = () => onAssetLoad('videos', path, video);
            video.onerror = () => onAssetError('videos', path);
        });

        if (total === 0) {
            console.log('无资源需要加载');
            loadingProgress.textContent = '100%';
            resolve(loadedAssets);
        }
    });
}

async function initializeGame() {
    try {
        console.log('开始加载资源...');
        const assets = await preloadAssets();
        if (!assets.images || Object.values(assets.images).every(item => item === null)) {
            console.error('所有图像资源加载失败');
            loadingScreen.innerHTML = '<div class="loading-text">加载失败，请刷新页面</div>';
            return;
        }
        console.log('资源加载完成，初始化游戏...');
        loadingScreen.style.display = 'none';
        backgroundVideo.style.display = 'block';
        menuContainer.style.display = 'block';
        window.assets = assets;
        createStarParticles();
        updateLanguage(settings.language);
        if (isMobileDevice()) setupVirtualControls();
        // 播放背景音乐
        const audioEngine = new AudioEngine(assets);
        audioEngine.setVolume(settings.soundVolume);
        audioEngine.play('bgm', true);
    } catch (error) {
        console.error('游戏初始化失败:', error);
        loadingScreen.innerHTML = '<div class="loading-text">加载失败，请刷新页面</div>';
    }
}

async function startGame() {
    try {
        console.log('开始游戏...');
        menuContainer.style.display = 'none';
        backgroundVideo.style.display = 'none';
        canvas.style.display = 'block';
        virtualControls.style.display = isMobileDevice() ? 'flex' : 'none';
        game = new Game(canvas, settings, window.assets);
        game.resize(window.innerWidth, window.innerHeight);
        game.start();
        continueButton.disabled = false;
        gameOver.style.display = 'none';
        pauseMenu.style.display = 'none';
        console.log('游戏成功启动');
    } catch (error) {
        console.error('启动游戏失败:', error);
        alert('游戏启动失败，请检查网络连接或刷新页面');
        returnToMenu();
    }
}

function continueGame() {
    if (gameState) {
        try {
            menuContainer.style.display = 'none';
            backgroundVideo.style.display = 'none';
            canvas.style.display = 'block';
            virtualControls.style.display = isMobileDevice() ? 'flex' : 'none';
            game = new Game(canvas, settings, window.assets);
            game.loadState(gameState);
            game.resize(window.innerWidth, window.innerHeight);
            game.start();
            console.log('继续游戏成功');
        } catch (error) {
            console.error('继续游戏失败:', error);
            alert('继续游戏失败，请检查网络连接或刷新页面');
            returnToMenu();
        }
    }
}

function showLeaderboard() {
    leaderboardModal.style.display = 'flex';
    updateLanguage(settings.language);
    const audioEngine = new AudioEngine(window.assets);
    audioEngine.play('click');
}

function showHelp() {
    helpModal.style.display = 'flex';
    updateLanguage(settings.language);
    const audioEngine = new AudioEngine(window.assets);
    audioEngine.play('click');
}

function showAbout() {
    aboutModal.style.display = 'flex';
    updateLanguage(settings.language);
    const audioEngine = new AudioEngine(window.assets);
    audioEngine.play('click');
}

function closeModal(modal) {
    modal.style.display = 'none';
    const audioEngine = new AudioEngine(window.assets);
    audioEngine.play('click');
}

function showSettings() {
    try {
        menuContainer.querySelector('.menu-buttons').style.display = 'none';
        settingsMenu.style.display = 'block';
        soundVolume.value = settings.soundVolume;
        graphicsQuality.value = settings.graphicsQuality;
        languageSelect.value = settings.language;
        updateKeyBindingDisplay();
        console.log('设置菜单显示成功');
        const audioEngine = new AudioEngine(window.assets);
        audioEngine.play('click');
    } catch (error) {
        console.error('显示设置菜单失败:', error);
    }
}

function saveSettingsHandler(e) {
    e.preventDefault();
    try {
        settings.soundVolume = parseFloat(soundVolume.value);
        settings.graphicsQuality = graphicsQuality.value;
        settings.language = languageSelect.value;
        if (game) game.updateSettings(settings);
        updateLanguage(settings.language);
        closeSettingsHandler();
        console.log('设置保存成功');
        const audioEngine = new AudioEngine(window.assets);
        audioEngine.play('click');
    } catch (error) {
        console.error('保存设置失败:', error);
    }
}

function closeSettingsHandler(e) {
    if (e) e.preventDefault();
    try {
        settingsMenu.style.display = 'none';
        menuContainer.querySelector('.menu-buttons').style.display = 'block';
        console.log('设置菜单关闭成功');
        const audioEngine = new AudioEngine(window.assets);
        audioEngine.play('click');
    } catch (error) {
        console.error('关闭设置菜单失败:', error);
    }
}

function returnToMenu() {
    try {
        if (game) {
            gameState = game.saveState();
            game.stop();
            game = null;
        }
        canvas.style.display = 'none';
        menuContainer.style.display = 'block';
        backgroundVideo.style.display = 'block';
        virtualControls.style.display = 'none';
        gameOver.style.display = 'none';
        pauseMenu.style.display = 'none';
        console.log('返回主菜单成功');
        const audioEngine = new AudioEngine(window.assets);
        audioEngine.play('click');
    } catch (error) {
        console.error('返回主菜单失败:', error);
    }
}

function exitGame() {
    try {
        window.close();
        console.log('游戏退出');
        const audioEngine = new AudioEngine(window.assets);
        audioEngine.play('click');
    } catch (error) {
        console.error('退出游戏失败:', error);
    }
}

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent);
}

function handleOrientation() {
    try {
        if (isMobileDevice()) {
            const isPortrait = window.innerHeight > window.innerWidth;
            virtualControls.style.flexDirection = isPortrait ? 'column' : 'row';
            virtualControls.style.bottom = '20px';
            virtualControls.style.left = isPortrait ? '20px' : '50%';
            virtualControls.style.transform = isPortrait ? 'none' : 'translateX(-50%)';
            if (game) game.resize(window.innerWidth, window.innerHeight);
            console.log('设备方向调整成功');
        }
    } catch (error) {
        console.error('设备方向调整失败:', error);
    }
}

function setupVirtualControls() {
    try {
        const virtualKeys = {};
        const debounceDelay = 50;
        let lastTouchTime = 0;

        ['left', 'up', 'down', 'right', 'shoot', 'laser'].forEach(id => {
            const button = document.getElementById(`virtual-${id}`);
            const handleStart = (e) => {
                e.preventDefault();
                const now = Date.now();
                if (now - lastTouchTime < debounceDelay) return;
                lastTouchTime = now;
                virtualKeys[id] = true;
            };
            const handleEnd = (e) => {
                e.preventDefault();
                virtualKeys[id] = false;
            };

            button.addEventListener('touchstart', handleStart, { passive: false });
            button.addEventListener('touchend', handleEnd, { passive: false });
            button.addEventListener('mousedown', handleStart);
            button.addEventListener('mouseup', handleEnd);
        });
        if (game) game.input.setVirtualKeys(virtualKeys);
        console.log('虚拟按键设置成功');
    } catch (error) {
        console.error('虚拟按键设置失败:', error);
    }
}

function updateKeyBindingDisplay() {
    try {
        keyUp.value = settings.keyBindings.up.join('/');
        keyDown.value = settings.keyBindings.down.join('/');
        keyLeft.value = settings.keyBindings.left.join('/');
        keyRight.value = settings.keyBindings.right.join('/');
        keyShoot.value = settings.keyBindings.shoot.join('/');
        keyLaser.value = settings.keyBindings.laser.join('/');
        console.log('按键绑定显示更新成功');
    } catch (error) {
        console.error('按键绑定显示更新失败:', error);
    }
}

function bindKeyInput(input, action) {
    input.addEventListener('click', (e) => {
        e.preventDefault();
        input.value = translations[settings.language].waiting_for_key;
        const listener = (e) => {
            e.preventDefault();
            settings.keyBindings[action] = [e.code];
            updateKeyBindingDisplay();
            window.removeEventListener('keydown', listener);
        };
        window.addEventListener('keydown', listener, { once: true });
    });
}

function updateHUD() {
    try {
        if (game && !game.paused && !game.gameOver) {
            hud.innerHTML = `生命: ${Math.max(0, game.player.health)} | 得分: ${game.score} | 波次: ${game.wave} | 难度: ${game.difficulty.toFixed(1)}x | 武器: ${game.player.weaponSystem.currentWeapon} | 激光: ${game.player.laserCharges}`;
            hud.style.opacity = '1';
        } else {
            hud.style.opacity = '0';
        }
    } catch (error) {
        console.error('HUD 更新失败:', error);
    }
}

startButton.addEventListener('click', startGame);
continueButton.addEventListener('click', continueGame);
leaderboardButton.addEventListener('click', showLeaderboard);
helpButton.addEventListener('click', showHelp);
aboutButton.addEventListener('click', showAbout);
settingsButton.addEventListener('click', showSettings);
saveSettings.addEventListener('click', saveSettingsHandler);
closeSettings.addEventListener('click', closeSettingsHandler);
exitButton.addEventListener('click', exitGame);
restartButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', () => {
    if (game) {
        game.togglePause();
        pauseMenu.style.display = 'none';
        const audioEngine = new AudioEngine(window.assets);
        audioEngine.play('click');
    }
});
returnMenuButton.addEventListener('click', returnToMenu);

document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', () => {
        closeModal(button.closest('.modal'));
    });
});

bindKeyInput(keyUp, 'up');
bindKeyInput(keyDown, 'down');
bindKeyInput(keyLeft, 'left');
bindKeyInput(keyRight, 'right');
bindKeyInput(keyShoot, 'shoot');
bindKeyInput(keyLaser, 'laser');

window.addEventListener('resize', () => {
    handleOrientation();
    if (game) game.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener('orientationchange', handleOrientation);

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.getElementById('install');
    installButton.style.display = 'block';
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`用户选择: ${outcome}`);
            deferredPrompt = null;
            installButton.style.display = 'none';
        }
    });
});

window.addEventListener('appinstalled', () => {
    console.log('PWA 已安装');
    document.getElementById('install').style.display = 'none';
});

initializeGame();
setInterval(updateHUD, 100);