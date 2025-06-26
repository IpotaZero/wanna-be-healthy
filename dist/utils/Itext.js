"use strict";
class Itext extends Ielement {
    isEnd = false;
    ready;
    #typing;
    constructor(container, text, options = {}) {
        if (!container) {
            console.error("Container is not defined for Itext");
        }
        super(container, options);
        // console.log("Ielement created", this, container)
        this.#typing = new Typing(text, options.speed, options.voice);
        this.appendChild(this.#typing);
        this.ready = this.#typing.ready;
        this.isEnd = this.#typing.isEnd;
    }
    // アニメーションを即座に完了
    finish() {
        this.#typing.finish();
    }
    remove() {
        this.#typing.remove();
        super.remove();
    }
}
customElements.define("i-text", Itext);
