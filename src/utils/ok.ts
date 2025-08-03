export class OK {
    #signal = new AbortController()

    get aborted() {
        return this.#signal.signal.aborted
    }

    constructor(handler: () => void) {
        document.addEventListener(
            "click",
            () => {
                handler()
                this.#signal.abort()
            },
            { signal: this.#signal.signal },
        )

        window.addEventListener(
            "keydown",
            (e) => {
                if (["Enter", "Space", "KeyZ"].includes(e.code)) {
                    handler()
                    this.#signal.abort()
                }
            },
            { signal: this.#signal.signal },
        )
    }

    abort() {
        this.#signal.abort()
    }
}
