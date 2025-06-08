"use strict";
class Input {
    static isAvailable = true;
    static keyboard = {
        pressed: new Set(),
        longPressed: new Set(),
        pushed: new Set(),
        upped: new Set(),
    };
    static mouse = {
        position: { x: 0, y: 0 },
        clicked: new Set(),
        upped: new Set(),
        down: new Set(),
    };
    static focusState = {
        isFocused: true,
        justFocused: false,
        justBlurred: false,
    };
    static #initialized = false;
    /**
     * 最初に呼んでくれ
     */
    static init() {
        if (this.#initialized)
            throw new Error("Input is already initialized!");
        this.#initialized = true;
        document.addEventListener("contextmenu", (e) => {
            // 右クリックメニューを無効化
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        document.addEventListener("keydown", (e) => {
            if (e.code === "Tab") {
                // Tabキーのデフォルト動作を無効化
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
        // Mouse events
        document.addEventListener("mousemove", this.#handleMouseMove.bind(this));
        document.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        document.addEventListener("mouseup", this.#handleMouseUp.bind(this));
        // Keyboard events
        document.addEventListener("keydown", this.#handleKeyDown.bind(this));
        document.addEventListener("keyup", this.#handleKeyUp.bind(this));
        // Window focus events
        window.addEventListener("blur", this.#handleBlur.bind(this));
        window.addEventListener("focus", this.#handleFocus.bind(this));
        document.addEventListener("visibilitychange", this.#handleVisibilityChange.bind(this));
    }
    /**
     * 毎フレームの最後に呼んでくれ
     */
    static update() {
        if (!this.#initialized)
            console.error("Input is not initialized!");
        this.keyboard.longPressed.clear();
        this.keyboard.pushed.clear();
        this.keyboard.upped.clear();
        this.mouse.clicked.clear();
        this.mouse.upped.clear();
        this.focusState.justFocused = false;
        this.focusState.justBlurred = false;
        if (!this.isAvailable) {
            this.mouse.down.clear();
            this.keyboard.pressed.clear();
        }
    }
    static #handleKeyDown(e) {
        if (!this.isAvailable)
            return;
        if (!this.keyboard.pressed.has(e.code)) {
            this.keyboard.pushed.add(e.code);
        }
        this.keyboard.pressed.add(e.code);
        this.keyboard.longPressed.add(e.code);
    }
    static #handleKeyUp(e) {
        if (!this.isAvailable)
            return;
        this.keyboard.pressed.delete(e.code);
        this.keyboard.upped.add(e.code);
    }
    static #handleMouseMove(e) {
        if (!this.isAvailable)
            return;
        this.mouse.position.x = e.clientX;
        this.mouse.position.y = e.clientY;
    }
    static #handleMouseDown(e) {
        if (!this.isAvailable)
            return;
        this.mouse.down.add(this.mouseButtons[e.button]);
        this.mouse.clicked.add(this.mouseButtons[e.button]);
    }
    static #handleMouseUp(e) {
        if (!this.isAvailable)
            return;
        this.mouse.down.delete(this.mouseButtons[e.button]);
        this.mouse.upped.add(this.mouseButtons[e.button]);
    }
    static #handleBlur() {
        console.log("よそ見するにゃ!");
        this.focusState.isFocused = false;
        this.focusState.justBlurred = true;
    }
    static #handleFocus() {
        console.log("こっち見んにゃ!");
        this.focusState.isFocused = true;
        this.focusState.justFocused = true;
    }
    static #handleVisibilityChange() {
        if (document.visibilityState === "visible") {
            this.#handleFocus();
        }
        else {
            this.#handleBlur();
        }
    }
}
(function (Input) {
    Input.mouseButtons = ["left", "middle", "right", "back", "forward"];
    Input.keys = [
        "KeyA",
        "KeyB",
        "KeyC",
        "KeyD",
        "KeyE",
        "KeyF",
        "KeyG",
        "KeyH",
        "KeyI",
        "KeyJ",
        "KeyK",
        "KeyL",
        "KeyM",
        "KeyN",
        "KeyO",
        "KeyP",
        "KeyQ",
        "KeyR",
        "KeyS",
        "KeyT",
        "KeyU",
        "KeyV",
        "KeyW",
        "KeyX",
        "KeyY",
        "KeyZ",
        "Digit0",
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "Digit9",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        "Escape",
        "Backspace",
        "Tab",
        "Space",
        "ShiftLeft",
        "ShiftRight",
        "ControlLeft",
        "ControlRight",
        "AltLeft",
        "AltRight",
        "MetaLeft",
        "MetaRight",
        "CapsLock",
        "NumLock",
        "ScrollLock",
        "Insert",
        "Delete",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "ContextMenu",
        "Pause",
        "PrintScreen",
    ];
})(Input || (Input = {}));
const { keyboard, focusState, mouse } = Input;
