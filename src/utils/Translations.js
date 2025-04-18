export const translations = {
    zh: {
        loading: '加载中...',
        game_title: 'Triple Andy Lau 游戏',
        start_game: '开始游戏',
        continue_game: '继续游戏',
        settings: '设置',
        exit: '退出',
        install: '安装游戏',
        settings_title: '设置',
        sound_volume: '音量',
        sound_toggle: '音效',
        graphics_quality: '画质',
        language: '语言',
        key_up: '上移',
        key_down: '下移',
        key_left: '左移',
        key_right: '右移',
        key_shoot: '射击',
        key_laser: '激光',
        save: '保存',
        close: '关闭',
        game_over: '游戏结束',
        restart_game: '重新开始',
        return_menu: '返回菜单',
        pause: '暂停',
        resume: '继续',
        waiting_for_key: '等待按键...',
        low: '低',
        medium: '中',
        high: '高',
        on: '开启',
        off: '关闭',
        leaderboard: '排行榜',
        help: '帮助',
        about: '关于',
        help_text: '操作说明：\nW/↑：上移\nS/↓：下移\nA/←：左移\nD/→：右移\nSpace：射击\nL：激光\nP：暂停',
        about_text: 'Triple Andy Lau 游戏\n版本：1.0.0\n开发者：xAI Team\n感谢你的游玩！',
        leaderboard_text: '排行榜\n暂无数据'
    },
    en: {
        loading: 'Loading...',
        game_title: 'Triple Andy Lau Game',
        start_game: 'Start Game',
        continue_game: 'Continue Game',
        settings: 'Settings',
        exit: 'Exit',
        install: 'Install Game',
        settings_title: 'Settings',
        sound_volume: 'Sound Volume',
        sound_toggle: 'Sound',
        graphics_quality: 'Graphics Quality',
        language: 'Language',
        key_up: 'Move Up',
        key_down: 'Move Down',
        key_left: 'Move Left',
        key_right: 'Move Right',
        key_shoot: 'Shoot',
        key_laser: 'Laser',
        save: 'Save',
        close: 'Close',
        game_over: 'Game Over',
        restart_game: 'Restart Game',
        return_menu: 'Return to Menu',
        pause: 'Pause',
        resume: 'Resume',
        waiting_for_key: 'Waiting for key...',
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        on: 'On',
        off: 'Off',
        leaderboard: 'Leaderboard',
        help: 'Help',
        about: 'About',
        help_text: 'Controls:\nW/↑: Move Up\nS/↓: Move Down\nA/←: Move Left\nD/→: Move Right\nSpace: Shoot\nL: Laser\nP: Pause',
        about_text: 'Triple Andy Lau Game\nVersion: 1.0.0\nDeveloper: xAI Team\nThanks for playing!',
        leaderboard_text: 'Leaderboard\nNo data'
    }
};

export function updateLanguage(lang) {
    document.querySelectorAll('[id]').forEach(element => {
        const key = element.id.replace(/-/g, '_');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    const graphicsQuality = document.getElementById('graphics-quality');
    if (graphicsQuality) {
        graphicsQuality.querySelectorAll('option').forEach((option, index) => {
            const keys = ['low', 'medium', 'high'];
            option.textContent = translations[lang][keys[index]];
        });
    }
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.querySelectorAll('option').forEach((option, index) => {
            const keys = ['on', 'off'];
            option.textContent = translations[lang][keys[index]];
        });
    }
}