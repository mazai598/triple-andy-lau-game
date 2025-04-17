export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.virtualKeys = {};
        window.addEventListener('keydown', (e) => {
            if (!this.keys.includes(e.code)) this.keys.push(e.code);
        });
        window.addEventListener('keyup', (e) => {
            this.keys = this.keys.filter(key => key !== e.code);
        });
    }

    setVirtualKeys(virtualKeys) {
        this.virtualKeys = virtualKeys;
    }

    updateKeyBindings(keyBindings) {
        this.keyBindings = keyBindings;
    }

    getKeys() {
        return [...this.keys, ...Object.keys(this.virtualKeys).filter(key => this.virtualKeys[key])];
    }
}