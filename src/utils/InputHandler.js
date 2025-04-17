export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            shoot: false,
            laser: false
        };
        this.virtualKeys = {};
        this.keyBindings = game.settings.keyBindings;

        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    handleKey(event, isDown) {
        const code = event.code;
        if (this.keyBindings.left.includes(code)) this.keys.left = isDown;
        if (this.keyBindings.right.includes(code)) this.keys.right = isDown;
        if (this.keyBindings.up.includes(code)) this.keys.up = isDown;
        if (this.keyBindings.down.includes(code)) this.keys.down = isDown;
        if (this.keyBindings.shoot.includes(code)) this.keys.shoot = isDown;
        if (this.keyBindings.laser.includes(code)) this.keys.laser = isDown;
    }

    setVirtualKeys(virtualKeys) {
        this.virtualKeys = virtualKeys;
    }

    getKeys() {
        return {
            left: this.keys.left || this.virtualKeys.left || false,
            right: this.keys.right || this.virtualKeys.right || false,
            up: this.keys.up || this.virtualKeys.up || false,
            down: this.keys.down || this.virtualKeys.down || false,
            shoot: this.keys.shoot || this.virtualKeys.shoot || false,
            laser: this.keys.laser || this.virtualKeys.laser || false
        };
    }

    updateKeyBindings(newBindings) {
        this.keyBindings = newBindings;
    }
}