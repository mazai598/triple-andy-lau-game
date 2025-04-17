export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            shoot: false
        };
        this.virtualKeys = {};
        this.keyBindings = game.settings.keyBindings;

        window.addEventListener('keydown', (e) => {
            if (this.keyBindings.up.includes(e.code)) this.keys.up = true;
            if (this.keyBindings.down.includes(e.code)) this.keys.down = true;
            if (this.keyBindings.left.includes(e.code)) this.keys.left = true;
            if (this.keyBindings.right.includes(e.code)) this.keys.right = true;
            if (this.keyBindings.shoot.includes(e.code)) this.keys.shoot = true;
            if (e.code === 'KeyP') this.game.togglePause();
            if (e.code === 'KeyR' && this.game.gameOver) this.game.start();
        });

        window.addEventListener('keyup', (e) => {
            if (this.keyBindings.up.includes(e.code)) this.keys.up = false;
            if (this.keyBindings.down.includes(e.code)) this.keys.down = false;
            if (this.keyBindings.left.includes(e.code)) this.keys.left = false;
            if (this.keyBindings.right.includes(e.code)) this.keys.right = false;
            if (this.keyBindings.shoot.includes(e.code)) this.keys.shoot = false;
        });
    }

    setVirtualKeys(virtualKeys) {
        this.virtualKeys = virtualKeys;
    }

    updateKeyBindings(bindings) {
        this.keyBindings = bindings;
    }

    getKeys() {
        return {
            up: this.keys.up || this.virtualKeys.up || false,
            down: this.keys.down || this.virtualKeys.down || false,
            left: this.keys.left || this.virtualKeys.left || false,
            right: this.keys.right || this.virtualKeys.right || false,
            shoot: this.keys.shoot || this.virtualKeys.shoot || false
        };
    }
}