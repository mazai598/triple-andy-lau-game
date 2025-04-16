import Game from './src/game/Game.js';

const canvas = document.getElementById('game-canvas');
const menuContainer = document.querySelector('.menu-container');
const settingsMenu = document.querySelector('.settings-menu');
const startButton = document.getElementById('start-game');
const continueButton = document.getElementById('continue-game');
const settingsButton = document.getElementById('settings');
const returnButton = document.getElementById('return-game');
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
const mobileControls = document.querySelector('.mobile-controls');
const mobileLeft = document.getElementById('mobile-left');
const mobileRight = document.getElementById('mobile-right');
const mobileUp = document.getElementById('mobile-up');
const mobileDown = document.getElementById('mobile-down');
const mobileShoot = document.getElementById('mobile-shoot');

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

// 语言翻译
const translations = {
    en: {
        title: 'I Love to Shoot Planes',
        start: 'Start Game',
        continue: 'Continue Game',
        settings: 'Settings',
        return: 'Return to Game',
        exit: 'Exit',
        sound_volume: 'Sound Volume',
        graphics_quality: 'Graphics Quality',
        language: 'Language',
        low: 'Low',
        high: 'High',
        english: 'English',
        chinese: 'Chinese',
        save: 'Save',
        close: 'Close',
        score: 'Score',
        wave: 'Wave',
        health: 'Health',
        bullets_fired: 'Bullets Fired',
        bullets_hit: 'Bullets Hit',
        accuracy: 'Accuracy',
        game_over: 'Game Over',
        restart: 'Press R to Restart',
        paused: 'Paused',
        resume: 'Press P to Resume',
        menu: 'Press M for Main Menu',
        keybindings: 'Key Bindings',
        move_up: 'Move Up',
        move_down: 'Move Down',
        move_left: 'Move Left',
        move_right: 'Move Right',
        shoot: 'Shoot',
        cloaked_enemies: 'Cloaked Enemies',
        waiting_for_key: 'Press a key...',
        error_start_game: 'Failed to start game. Please ensure all assets are loaded.',
        install_app: 'Install App'
    },
    zh: {
        title: '我爱打飞机',
        start: '开始游戏',
        continue: '继续游戏',
        settings: '设置',
        return: '返回游戏',
        exit: '退出',
        sound_volume: '音量',
        graphics_quality: '画质',
        language: '语言',
        low: '低',
        high: '高',
        english: '英语',
        chinese: '中文',
        save: '保存',
        close: '关闭',
        score: '分数',
        wave: '波次',
        health: '生命值',
        bullets_fired: '发射子弹',
        bullets_hit: '命中子弹',
        accuracy: '命中率',
        game_over: '游戏结束',
        restart: '按 R 重新开始',
        paused: '暂停',
        resume: '按 P 继续',
        menu: '按 M 返回主菜单',
        keybindings: '按键绑定',
        move_up: '向上移动',
        move_down: '向下移动',
        move_left: '向左移动',
        move_right: '向右移动',
        shoot: '射击',
        cloaked_enemies: '隐形敌人',
        waiting_for_key: '请按一个键...',
        error_start_game: '无法开始游戏，请确保所有资源已加载。',
        install_app: '安装应用'
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
        input.value = translations[settings.language].waiting_for_key || '请按一个键...';
        const listener = e => {
            e.preventDefault();
            settings.keyBindings[action] = [e.code];
            updateKeyBindingDisplay();
            window.removeEventListener('keydown', listener);
        };
        window.addEventListener('keydown', listener);
    });
}

function preloadAssets() {
    return new Promise((resolve, reject) => {
        const imagePaths = [
            'assets/images/background.png',
            'assets/images/boss_final.png',
            'assets/images/boss_mid.png',
            'assets/images/boss_mini.png',
            'assets/images/boss_missile.png',
            'assets/images/bullet.png',
            'assets/images/bullet_laser.png',
            'assets/images/bullet_penta.png',
            'assets/images/bullet_wave.png',
            'assets/images/enemy_bullet.png',
            'assets/images/enemy_large.png',
            'assets/images/enemy_medium.png',
            'assets/images/enemy_small.png',
            'assets/images/enemy_stealth.png',
            'assets/images/explosion.png',
            'assets/images/glow.png',
            'assets/images/icon-192.png',
            'assets/images/icon-512.png',
            'assets/images/icon-maskable-192.png',
            'assets/images/icon-maskable-512.png',
            'assets/images/laser.png',
            'assets/images/loading_bg.png',
            'assets/images/muzzle_flash.png',
            'assets/images/particle_trail.png',
            'assets/images/player_sheet.png',
            'assets/images/powerup_energy.png',
            'assets/images/powerup_laser.png',
            'assets/images/powerup_life.png',
            'assets/images/powerup_penta.png',
            'assets/images/powerup_wave.png',
            'assets/images/thruster.png',
            'assets/images/weapon_normal.png'
        ];
        let loaded = 0;
        const total = imagePaths.length;
        const images = {};

        imagePaths.forEach(path => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                loaded++;
                images[path] = img;
                console.log(`加载成功: ${path}`);
                if (loaded === total) resolve(images);
            };
            img.onerror = () => {
                console.warn(`无法加载图片: ${path}，使用备用渲染方式。`);
                loaded++;
                images[path] = null;
                if (loaded === total) resolve(images);
            };
        });
    });
}

async function startGame() {
    try {
        const images = await preloadAssets();
        if (!images || Object.values(images).every(img => img === null)) {
            throw new Error('所有图片加载失败');
        }
        menuContainer.style.display = 'none';
        canvas.style.display = 'block';
        mobileControls.style.display = isMobileDevice() ? 'flex' : 'none';
        game = new Game(canvas, settings, images);
        game.resize(canvas.width, canvas.height);
        game.start();
        continueButton.disabled = false;
        returnButton.style.display = 'block';
    } catch (error) {
        console.error('无法开始游戏:', error);
        alert(translations[settings.language].error_start_game);
    }
}

function continueGame() {
    if (gameState) {
        menuContainer.style.display = 'none';
        canvas.style.display = 'block';
        mobileControls.style.display = isMobileDevice() ? 'flex' : 'none';
        game = new Game(canvas, settings);
        game.loadState(gameState);
        game.resize(canvas.width, canvas.height);
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
    mobileControls.style.display = 'none';
}

function exitGame() {
    window.close();
}

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent);
}

// 事件监听器
startButton.addEventListener('click', startGame);
continueButton.addEventListener('click', continueGame);
settingsButton.addEventListener('click', showSettings);
saveSettings.addEventListener('click', saveSettingsHandler);
closeSettings.addEventListener('click', closeSettingsHandler);
returnButton.addEventListener('click', returnToMenu);
exitButton.addEventListener('click', exitGame);

// 按键绑定输入
bindKeyInput(keyUp, 'up');
bindKeyInput(keyDown, 'down');
bindKeyInput(keyLeft, 'left');
bindKeyInput(keyRight, 'right');
bindKeyInput(keyShoot, 'shoot');

// 移动端控制
let mobileKeys = {};
mobileLeft.addEventListener('touchstart', e => { e.preventDefault(); mobileKeys['left'] = true; });
mobileLeft.addEventListener('touchend', e => { e.preventDefault(); mobileKeys['left'] = false; });
mobileRight.addEventListener('touchstart', e => { e.preventDefault(); mobileKeys['right'] = true; });
mobileRight.addEventListener('touchend', e => { e.preventDefault(); mobileKeys['right'] = false; });
mobileUp.addEventListener('touchstart', e => { e.preventDefault(); mobileKeys['up'] = true; });
mobileUp.addEventListener('touchend', e => { e.preventDefault(); mobileKeys['up'] = false; });
mobileDown.addEventListener('touchstart', e => { e.preventDefault(); mobileKeys['down'] = true; });
mobileDown.addEventListener('touchend', e => { e.preventDefault(); mobileKeys['down'] = false; });
mobileShoot.addEventListener('touchstart', e => { e.preventDefault(); mobileKeys['shoot'] = true; });
mobileShoot.addEventListener('touchend', e => { e.preventDefault(); mobileKeys['shoot'] = false; });

// 响应式画布调整
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (game) game.resize(canvas.width, canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 初始化语言
updateLanguage();

// PWA 安装提示
let installPromptEvent;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptEvent = e;
    const installButton = document.createElement('button');
    installButton.setAttribute('data-i18n', 'install_app');
    installButton.className = 'install-button';
    menuContainer.appendChild(installButton);
    installButton.style.display = 'block';
    updateLanguage();

    installButton.addEventListener('click', () => {
        if (installPromptEvent) {
            installPromptEvent.prompt();
            installPromptEvent.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('用户接受了安装提示');
                } else {
                    console.log('用户取消了安装提示');
                }
                installPromptEvent = null;
                installButton.style.display = 'none';
            });
        }
    });
});