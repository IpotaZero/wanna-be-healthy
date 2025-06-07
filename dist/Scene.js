"use strict";
class Scene {
    constructor() {
        this.#clearElement();
    }
    loop(elapsedTime) { }
    #clearElement() {
        ;
        [...DOM.container.children].forEach((e) => e.remove());
    }
}
