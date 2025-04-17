export const translations = {
    zh: {
        title: '我爱打飞机',
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
        restart: '按 R 重新开始',
        paused: '暂停',
        resume: '按 P 继续',
        menu: '主菜单',
        waiting_for_key: '按任意键...',
        install: '安装游戏'
    },
    en: {
        title: 'I Love Air Combat',
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
        restart: 'Press R to Restart',
        paused: 'Paused',
        resume: 'Press P to Resume',
        menu: 'Main Menu',
        waiting_for_key: 'Press any key...',
        install: 'Install Game'
    }
};

export function updateLanguage(lang) {
    try {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[lang][key] || translations.en[key] || key;
            element.textContent = translation;
        });
        console.log('语言更新成功:', lang);
    } catch (error) {
        console.error('语言更新失败:', error);
    }
}