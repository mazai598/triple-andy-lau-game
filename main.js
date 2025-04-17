import Game from './src/game/Game.js';

const canvas = document.getElementById('game-canvas');
const menuContainer = document.querySelector('.menu-container');
const settingsMenu = document.querySelector('.settings-menu');
const startButton = document.getElementById('start-game');
const continueButton = document.getElementById('continue-game');
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
const virtualControls = document.querySelector('.virtual-controls');
const hud = document.getElementById('hud');
const gameOver = document.getElementById('game-over');
const pauseMenu = document.getElementById('pause-menu');
const restartButton = document.getElementById('restart-game');
const resumeButton = document.getElementById('resume-game');
const returnMenuButton = document.getElementById('return-menu');

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
        shoot: ['Space']
    }
};

const translations = {
    zh: {
        title: '极致飞机大战',
        start: '开始游戏',
        continue: '继续游戏',
        settings: '设置',
        exit: '退出',
        sound_volume: '音量',
        graphics_quality: '画质',
        language: '语言',
        low: '低',
        high: '高',
        chinese: '中文',
        english: 'English',
        save: '保存',
        close: '关闭',
        move_up: '向上',
        move_down: '向下',
        move_left: '向左',
        move_right: '向右',
        shoot: '射击',
        game_over: '游戏结束',
        restart: '重启',
        paused: '暂停',
        resume: '继续',
        menu: '主菜单',
        waiting_for_key: '按任意键...'
    },
    en: {
        title: 'Ultimate Air Combat',
        start: 'Start Game',
        continue: 'Continue Game',
        settings: 'Settings',
        exit: 'Exit',
        sound_volume: 'Sound Volume',
        graphics_quality: 'Graphics Quality',
        language: 'Language',
        low: 'Low',
        high: 'High',
        chinese: 'Chinese',
        english: 'English',
        save: 'Save',
        close: 'Close',
        move_up: 'Move Up',
        move_down: 'Move Down',
        move_left: 'Move Left',
        move_right: 'Move Right',
        shoot: 'Shoot',
        game_over: 'Game Over',
        restart: 'Restart',
        paused: 'Paused',
        resume: 'Resume',
        menu: 'Main Menu',
        waiting_for_key: 'Press any key...'
    }
};

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[settings.language][key];
    });
    updateKeyBindingDisplay();
    if (game) game.hud.updateLanguage();
}

function updateKeyBindingDisplay() {
    keyUp.value = settings.keyBindings.up.join('/');
    keyDown.value = settings.keyBindings.down.join('/');
    keyLeft.value = settings.keyBindings.left.join('/');
    keyRight.value = settings.keyBindings.right.join('/');
    keyShoot.value = settings.keyBindings.shoot.join('/');
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

function preloadAssets() {
    return new Promise((resolve) => {
        const imagePaths = [
            'assets/images/background.png', 'assets/images/player_sheet.png',
            'assets/images/enemy_small.png', 'assets/images/enemy_medium.png',
            'assets/images/enemy_large.png', 'assets/images/enemy_stealth.png',
            'assets/images/enemy_boss.png', 'assets/images/bullet.png',
            'assets/images/powerup_life.png', 'assets/images/powerup_energy.png',
            'assets/images/powerup_laser.png', 'assets/images/powerup_penta.png',
            'assets/images/powerup_shield.png'
        ];
        const images = {};
        let loaded = 0;
        imagePaths.forEach(path => {
            const img = new Image();
            img.src = path;
            img.onload = () => { loaded++; images[path] = img; if (loaded === imagePaths.length) resolve(images); };
            img.onerror = () => { loaded++; images[path] = null; console.warn(`图片加载失败: ${path}`); if (loaded === imagePaths.length) resolve(images); };
        });
    });
}

async function startGame() {
    const images = await preloadAssets();
    if (!images || Object.values(images).every(img => img === null)) {
        alert(translations[settings.language].game_over + ': 资源加载失败');
        return;
    }
    menuContainer.style.display = 'none';
    canvas.style.display = 'block';
    virtualControls.style.display = isMobileDevice() ? 'flex' : 'none';
    game = new Game(canvas, settings, images);
    game.resize(window.innerWidth, window.innerHeight);
    game.start();
    continueButton.disabled = false;
    gameOver.style.display = 'none';
    pauseMenu.style.display = 'none';
}

function continueGame() {
    if (gameState) {
        menuContainer.style.display = 'none';
        canvas.style.display = 'block';
        virtualControls.style.display = isMobileDevice() ? 'flex' : 'none';
        game = new Game(canvas, settings);
        game.loadState(gameState);
        game.resize(window.innerWidth, window.innerHeight);
        game.start();
    }
}

function showSettings() {
    menuContainer.querySelector('.menu-buttons').style.display = 'none';
    settingsMenu.style.display = 'block';
    soundVolume.value = settings.soundVolume;
    graphicsQuality.value = settings.graphicsQuality;
    languageSelect.value = settings.language;
    updateKeyBindingDisplay();
}

function saveSettingsHandler(e) {
    e.preventDefault();
    settings.soundVolume = parseFloat(soundVolume.value);
    settings.graphicsQuality = graphicsQuality.value;
    settings.language = languageSelect.value;
    if (game) game.updateSettings(settings);
    updateLanguage();
    closeSettingsHandler();
}

function closeSettingsHandler(e) {
    if (e) e.preventDefault();
    settingsMenu.style.display = 'none';
    menuContainer.querySelector('.menu-buttons').style.display = 'block';
}

function returnToMenu() {
    if (game) {
        gameState = game.saveState();
        game.stop();
        game = null;
    }
    canvas.style.display = 'none';
    menuContainer.style.display = 'block';
    virtualControls.style.display = 'none';
    gameOver.style.display = 'none';
    pauseMenu.style.display = 'none';
}

function exitGame() {
    window.close();
}

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent);
}

function handleOrientation() {
    if (isMobileDevice()) {
        if (window.innerHeight > window.innerWidth) {
            virtualControls.style.flexDirection = 'column';
            virtualControls.style.bottom = '10px';
            virtualControls.style.left = '10px';
        } else {
            virtualControls.style.flexDirection = 'row';
            virtualControls.style.bottom = '10px';
            virtualControls.style.left = '50%';
            virtualControls.style.transform = 'translateX(-50%)';
        }
        if (game) game.resize(window.innerWidth, window.innerHeight);
    }
}

function setupVirtualControls() {
    const virtualKeys = {};
    ['left', 'up', 'down', 'right', 'shoot'].forEach(id => {
        const button = document.getElementById(`virtual-${id}`);
        button.addEventListener('touchstart', (e) => { e.preventDefault(); virtualKeys[id] = true; });
        button.addEventListener('touchend', (e) => { e.preventDefault(); virtualKeys[id] = false; });
    });
    game.input.setVirtualKeys(virtualKeys);
}

function updateHUD() {
    if (game) {
        hud.innerHTML = `生命: ${Math.max(0, game.player.health)} | 得分: ${game.score} | 波次: ${game.wave} | 难度: ${game.difficulty.toFixed(1)}x`;
    }
}

startButton.addEventListener('click', startGame);
continueButton.addEventListener('click', continueGame);
settingsButton.addEventListener('click', showSettings);
saveSettings.addEventListener('click', saveSettingsHandler);
closeSettings.addEventListener('click', closeSettingsHandler);
exitButton.addEventListener('click', exitGame);
restartButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', () => { game.togglePause(); pauseMenu.style.display = 'none'; });
returnMenuButton.addEventListener('click', returnToMenu);

bindKeyInput(keyUp, 'up');
bindKeyInput(keyDown, 'down');
bindKeyInput(keyLeft, 'left');
bindKeyInput(keyRight, 'right');
bindKeyInput(keyShoot, 'shoot');

window.addEventListener('resize', () => {
    handleOrientation();
    if (game) game.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener('orientationchange', handleOrientation);

updateLanguage();
if (isMobileDevice()) setupVirtualControls();

setInterval(updateHUD, 100);