class Scene {
    constructor() {
        this.#clearElement()
    }

    loop(elapsedTime: number) {}

    #clearElement() {
        ;[...DOM.container.children].forEach((e) => e.remove())
    }
}
